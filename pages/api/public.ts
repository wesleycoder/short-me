import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../db/db";
import type { definitions } from "../../types/database";

interface NextRequestWithBody extends NextApiRequest {
  body: {
    start?: number;
    length?: number;
  };
}

type Data =
  | definitions["urls"][]
  | {
      error: string;
    };

export default async function getPublic(
  req: NextRequestWithBody,
  res: NextApiResponse<Data>
) {
  const { start = 0, length = 100 } = req.body;
  const urls =
    (
      await dbClient
        .from<definitions["urls"]>("urls")
        .select()
        .eq("public", true)
        .range(start, start + length)
    ).data || [];

  res.json(urls);
}
