import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const { Pool } = pg;

const globalConnection = global as typeof globalThis & {
	connection: pg.Pool;
};

globalConnection.connection = new Pool({
	connectionString: process.env.DATABASE_URL + "?sslmode=require",
	max: 20,
});

const connection = globalConnection.connection;

const db = drizzle(connection, {
	schema,
	logger: true,
});

export * from "./schema";
export { db };
