import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../db";
import { connectDB, newId } from "../../db/db";
import { validateUrl } from "../../utils";

type Data = {
  url: string;
  hash: string;
} | {
  error: string;
};

export default async function shorten(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  if (!validateUrl(url)) {
    return res.status(400).json({ error: "url is invalid" });
  }

  await connectDB();

  const existentUrl = db.chain.get("urls").find({ url }).value();

  if (existentUrl) {
    res.status(200).json(existentUrl);
  } else {
    const newUrl = { url, hash: newId() };
    db.data!.urls.push(newUrl);
    await db.write();
    res.status(200).json(newUrl);
  }
}
