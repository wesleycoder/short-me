import type { NextApiRequest, NextApiResponse } from "next";
import { validateUrl } from "../../utils";
import type { definitions } from "../../types/database";
import { dbClient } from "../../db/db";
import { nanoid } from "nanoid";
import { PostgrestError } from "@supabase/supabase-js";
import { RequestError } from "../../utils/Errors";

interface NextRequestWithBody extends NextApiRequest {
  body: {
    url: string;
    public: boolean;
  };
}

type Data =
  | definitions["urls"]
  | {
      ok: boolean;
      statusText?: string;
      error: PostgrestError | Error | null;
    };

export default async function shorten(
  req: NextRequestWithBody,
  res: NextApiResponse<Data>
) {
  const { url, public: isPublic = true } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ ok: false, error: new RequestError("url is required") });
  }

  if (!validateUrl(url)) {
    return res.json({ ok: false, error: new RequestError("url is invalid") });
  }

  const {
    data: existentUrl,
    status,
    statusText,
    error,
  } = await dbClient
    .from<definitions["urls"]>("urls")
    .select()
    .eq("url", url)
    .maybeSingle();

  if (status !== 200) {
    return res.status(status).json({ ok: status === 200, statusText, error });
  }

  if (existentUrl) {
    res.status(200).json(existentUrl);
  } else {
    const newUrl: Omit<
      definitions["urls"],
      "id" | "last_access_at" | "created_at" | "updated_at"
    > = {
      url,
      hash: nanoid(14),
      access_count: 0,
      public: isPublic,
      user_id: dbClient.auth.user()?.id,
    };
    dbClient.from<definitions["urls"]>("urls").insert(newUrl);
    const { data: hashedUrl } = await dbClient
      .from<definitions["urls"]>("urls")
      .insert(newUrl)
      .single();

    res.status(200).json(hashedUrl!);
  }
}
