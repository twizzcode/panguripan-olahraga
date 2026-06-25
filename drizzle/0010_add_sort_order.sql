ALTER TABLE "training" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;

UPDATE "training" SET "sort_order" = (
  SELECT COUNT(*) 
  FROM "training" AS t2 
  WHERE t2."created_at" < "training"."created_at"
);
