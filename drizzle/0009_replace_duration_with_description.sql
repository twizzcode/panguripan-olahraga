ALTER TABLE "training" ADD COLUMN "description" text;
UPDATE "training" SET "description" = "duration" WHERE "description" IS NULL;
ALTER TABLE "training" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "training" DROP COLUMN "duration";
