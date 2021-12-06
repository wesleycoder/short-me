import type { NextApiRequest, NextApiResponse } from "next";
import { db, newId, HashedUrl } from "../db";
import { validateUrl } from "../utils";

type Data =
  | HashedUrl
  | {
      error: string;
    };

export default async function shorten(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;
  let user;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  if (!validateUrl(url)) {
    return res.status(400).json({ error: "url is invalid" });
  }

  const token = req.cookies.token;
  if (token) {
    const users = await db.collection<"users">("users");
    user = users.find((u) => u.provider_token === token).value();
  }
  
  const urls = await db.collection<"urls">("urls");
  const existentUrl = urls.find({ url }).value();

  if (existentUrl) {
    res.status(200).json(existentUrl);
  } else {
    const newUrl: HashedUrl = {
      url,
      hash: newId(),
      accessCount: 0,
      createdAt: new Date(),
    };
    db.data!.urls.push(newUrl);
    await db.write();
    res.status(200).json(newUrl);
  }
}
