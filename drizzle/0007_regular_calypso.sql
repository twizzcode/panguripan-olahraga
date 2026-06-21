CREATE TABLE "app_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_whatsapp_number" text NOT NULL,
	"whatsapp_confirmation_template" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
