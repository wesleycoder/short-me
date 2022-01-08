import { PostgrestError } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "../../db";
import { definitions } from "../../types/database/index";
import { RequestError } from "../../utils/Errors";

type Data = {
  ok: boolean;
  statusText?: string;
  error: PostgrestError | Error | null;
};

export default async function postClear(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      statusText: "Method not Allowed",
      error: new RequestError("Method not Allowed"),
    });
  }

  const { status, statusText, error } = await dbClient
    .from<definitions["urls"]>("urls")
    .delete();

  return res.status(status).json({ ok: status === 200, statusText, error });
}
