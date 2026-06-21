CREATE TABLE "booking" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"name" text NOT NULL,
	"institution" text NOT NULL,
	"whatsapp" text NOT NULL,
	"duration_hours" integer NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_user_id_idx" ON "booking" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "booking_starts_at_idx" ON "booking" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "booking_ends_at_idx" ON "booking" USING btree ("ends_at");