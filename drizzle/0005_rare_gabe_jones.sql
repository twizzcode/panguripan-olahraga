ALTER TABLE "booking" ADD COLUMN "transaction_id" text;--> statement-breakpoint
UPDATE "booking"
SET "transaction_id" = CONCAT(
	'TRX-',
	TO_CHAR(COALESCE("created_at", NOW()) AT TIME ZONE 'UTC', 'YYYYMMDD'),
	'-',
	UPPER(SUBSTRING(MD5("id" || COALESCE("created_at", NOW())::text) FROM 1 FOR 8))
)
WHERE "transaction_id" IS NULL;--> statement-breakpoint
ALTER TABLE "booking" ALTER COLUMN "transaction_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_transaction_id_unique" UNIQUE("transaction_id");
