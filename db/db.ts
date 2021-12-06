import { existsSync } from "fs";
import { chain, CollectionChain, ObjectChain } from "lodash";
import { Adapter, JSONFile, Low, Memory } from "lowdb";
import { nanoid } from "nanoid";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dbFile = join(process.cwd(), "db", "db.json");

export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  provider_token: string;
}

export interface HashedUrl {
  url: string;
  hash: string;
  createdAt: Date;
  accessCount?: number;
  userId?: User["id"];
}

export interface Database {
  urls: HashedUrl[];
  users: User[];
}

type DbKeys = keyof Database;

type DBInstance = Low<Database> & {
  /** populated after connection */
  data: Database;
  /** lodash chain wrapper for data */
  chain: ObjectChain<Database>;
  /** connects to the database and instantiates db.chain */
  connect(): Promise<void>;
  /** reads the database and finds the collection */
  collection<T extends DbKeys>(
    collection: DbKeys
  ): Promise<CollectionChain<Database[T][0]>>;
};

const dbSource: Adapter<Database> = existsSync(dbFile)
  ? new JSONFile(dbFile)
  : new Memory();

export const db = new Low<Database>(dbSource) as DBInstance;

db.collection = async function <T extends DbKeys>(
  collection: DbKeys
): Promise<CollectionChain<Database[T][0]>> {
  await db.connect();
  return db.chain.get(collection) as CollectionChain<Database[T][0]>;
};

db.connect = async function () {
  await db.read();
  db.data ||= {
    urls: [],
    users: [],
  };
  db.chain = chain(db.data);
};

export const newId = () => nanoid(14);
