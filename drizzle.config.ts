import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL");
}

export default {
	schema: "./database/schema.ts",
	out: "./database/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
} satisfies Config;
