import type { NextApiRequest, NextApiResponse } from "next";
import { validateUrl } from "../../utils";
import type { definitions } from "../../types/database";
import { dbClient } from "../../db/db";
import { nanoid } from 'nanoid';

interface NextRequestWithBody extends NextApiRequest {
  body: {
    url: string;
    public: boolean;
  };
}

type Data =
  | definitions["urls"]
  | {
      error: string;
    };

export default async function shorten(
  req: NextRequestWithBody,
  res: NextApiResponse<Data>
) {
  const { url, public: isPublic = true } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  if (!validateUrl(url)) {
    return res.status(400).json({ error: "url is invalid" });
  }

  const headers = req.headers;
  console.log(headers);

  const existentUrl = (
    await dbClient
      .from<definitions["urls"]>("urls")
      .select()
      .eq("url", url)
      .single()
  ).data;

  if (existentUrl) {
    res.status(200).json(existentUrl);
  } else {
    const newUrl: Omit<definitions["urls"], "id"> = {
      url,
      hash: nanoid(14),
      access_count: 0,
      public: isPublic,
      user_id: dbClient.auth.user()?.id,
      last_access_at: new Date().toTimeString(),
      created_at: new Date().toTimeString(),
      updated_at: new Date().toTimeString(),
    };
    dbClient.from<definitions["urls"]>("urls").insert(newUrl);
    const hashedUrl = (
      await dbClient.from<definitions["urls"]>("urls").insert(newUrl).single()
    ).data as definitions["urls"];
    res.status(200).json(hashedUrl);
  }
}
