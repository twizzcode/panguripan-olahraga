CREATE TABLE "training" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"speaker" text NOT NULL,
	"duration" text NOT NULL,
	"category" text NOT NULL,
	"video_src" text NOT NULL,
	"thumbnail_src" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
