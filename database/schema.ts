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

export const sleepStage = pgEnum("SleepStage", [
	"INBED",
	"ASLEEP",
	"DEEP",
	"CORE",
	"REM",
]);

export const users = pgTable(
	"users",
	{
		id: uuid("id")
			.primaryKey()
			.notNull()
			.$defaultFn(() => uuidv4()),
		firstName: text("firstName"),
		lastName: text("lastName"),
		fullName: text("fullName"),
		phoneNumber: text("phoneNumber"),
	},
	(table) => {
		return {
			nameIdx: index("name_idx").on(table.fullName),
			phoneKey: uniqueIndex("users_phone_key").on(table.phoneNumber),
		};
	},
);

export enum SleepStage {
	"INBED",
	"ASLEEP",
	"DEEP",
	"CORE",
	"REM",
}

export type SleepCycle = {
	stage: SleepStage;
	startTime: Date;
	endTime: Date;
};

export const sleepData = pgTable("sleep_data", {
	id: uuid("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => uuidv4()),
	userId: uuid("userId")
		.notNull()
		.references(() => users.id, {
			onDelete: "restrict",
			onUpdate: "cascade",
		}),
	date: timestamp("date", { precision: 3, mode: "date" })
		.defaultNow()
		.notNull(),
	sleepDuration: integer("sleepDuration").default(0).notNull(), // minutes
	sleepCycle: jsonb().$type<SleepCycle[]>(),
	sleepQuality: integer("sleepQuality").notNull(),
	suggestions: text("suggestions").notNull(),
});

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
