import type { SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	foreignKey,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid,
	varchar,
	vector,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const users = pgTable(
	"users",
	{
		id: uuid("id")
			.primaryKey()
			.notNull()
			.$defaultFn(() => uuidv4()),
		username: text("username"),
		firstName: text("firstName"),
		lastName: text("lastName"),
		fullName: text("fullName"),
		phoneNumber: text("phoneNumber"),
	},
	(table) => {
		return {
			nameIdx: index("name_idx").on(table.fullName),
			usernameIdx: index("username_idx").on(table.username),
			phoneKey: uniqueIndex("users_phone_key").on(table.phoneNumber),
			usernameKey: uniqueIndex("users_username_key").on(table.username),
		};
	},
);

export const connections = pgTable(
	"connections",
	{
		id: uuid("id")
			.primaryKey()
			.notNull()
			.$defaultFn(() => uuidv4()),
		sentTime: timestamp("sentTime", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		responseTime: timestamp("responseTime", { precision: 3, mode: "date" }),
		userId: uuid("userId")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		connectionUserId: uuid("connectionUserId")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		additionalNote: text("additionalNote").default("").notNull(),
	},
	(table) => {
		return {
			unique: unique().on(table.userId, table.connectionUserId),
		};
	},
);

export const connectionsRelations = relations(connections, ({ one }) => ({
	user: one(users, {
		fields: [connections.userId],
		references: [users.id],
		relationName: "userConnections",
	}),
	connectionUser: one(users, {
		fields: [connections.connectionUserId],
		references: [users.id],
	}),
}));
