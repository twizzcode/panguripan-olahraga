ALTER TABLE "booking" RENAME COLUMN "payment_status" TO "approval_status";--> statement-breakpoint
ALTER TABLE "training" RENAME COLUMN "duration" TO "description";--> statement-breakpoint
ALTER TABLE "training" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "app_settings" DROP COLUMN "booking_hourly_rate";