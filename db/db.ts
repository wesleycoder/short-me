import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { chain, ObjectChain } from "lodash";
import { nanoid } from "nanoid";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbFile = join(__dirname, "db.json");

export interface HashedUrl {
  url: string;
  hash: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  provider_user_token: string;
}

export interface Database {
  urls: HashedUrl[];
  users: User[];
}

type DBInstance = Low<Database> & { chain: ObjectChain<Database> };

export const db = new Low<Database>(new JSONFile(dbFile)) as DBInstance;

export const connectDB = async () => {
  await db.read();
  db.data ||= {
    urls: [],
    users: [],
  };
  db.chain = chain(db.data);
};

export const newId = () => nanoid(14);
