import { createClient } from "@supabase/supabase-js";
import { existsSync } from "fs";
import { chain, CollectionChain, ObjectChain } from "lodash";
import { Adapter, JSONFile, Low, Memory } from "lowdb";
import { nanoid } from "nanoid";
import { join } from "path";

const dbFile = join(process.cwd(), "db", "db.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const dbClient = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  created_at: Date;
  token: string;
  last_sign_in_at: Date;
}

export interface HashedUrl {
  url: string;
  hash: string;
  user_id?: User["id"];
  access_count?: number;
  public: boolean;
  created_at: Date;
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
