CREATE TYPE "public"."SleepStage" AS ENUM('INBED', 'ASLEEP', 'DEEP', 'CORE', 'REM');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sentTime" timestamp (3) DEFAULT now() NOT NULL,
	"responseTime" timestamp (3),
	"userId" uuid NOT NULL,
	"connectionUserId" uuid NOT NULL,
	"additionalNote" text DEFAULT '' NOT NULL,
	CONSTRAINT "connections_userId_connectionUserId_unique" UNIQUE("userId","connectionUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_data" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"date" timestamp (3) DEFAULT now() NOT NULL,
	"sleepDuration" integer DEFAULT 0 NOT NULL,
	"sleepCycle" jsonb,
	"sleepQuality" integer NOT NULL,
	"suggestions" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"fullName" text,
	"phoneNumber" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connections" ADD CONSTRAINT "connections_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connections" ADD CONSTRAINT "connections_connectionUserId_users_id_fk" FOREIGN KEY ("connectionUserId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sleep_data" ADD CONSTRAINT "sleep_data_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "users" USING btree ("fullName");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key" ON "users" USING btree ("phoneNumber");