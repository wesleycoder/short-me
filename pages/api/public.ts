import { PostgrestError } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../db/db";
import type { definitions } from "../../types/database";
import { RequestError } from "../../utils/Errors";

interface NextRequestWithBody extends NextApiRequest {
  body: {
    start?: number;
    length?: number;
  };
}

type Data =
  | definitions["urls"][]
  | {
      ok: boolean;
      statusText?: string;
      error: PostgrestError | Error | null;
    };

export default async function getPublic(
  req: NextRequestWithBody,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      statusText: "Method not Allowed",
      error: new RequestError("Method not Allowed"),
    });
  }

  const { start = 0, length = 100 } = req.body;

  const { data: urls, status, statusText, error } = await dbClient
    .from<definitions["urls"]>("urls")
    .select()
    .eq("public", true)
    .range(start, start + length);

  if (status !== 200) {
    return res.status(status).json({ ok: status === 200, statusText, error });
  } else {
    res.json(urls!);
  }
}
