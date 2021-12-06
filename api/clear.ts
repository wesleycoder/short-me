import { NextApiRequest, NextApiResponse } from "next";
import { db, HashedUrl } from "../db";

interface Data {
  ok: boolean;
  urls: HashedUrl[];
}

export default async function clear(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.read();
  db.data!.urls = [];
  await db.write();

  const urls = await db.collection<"urls">("urls");
  res.status(200).json({ ok: true, urls: urls.value() });
}
