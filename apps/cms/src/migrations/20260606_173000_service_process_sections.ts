import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "process_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "process_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "process_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_lead" varchar;

    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "process_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "process_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "process_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_process_section_lead" varchar;

    CREATE TABLE IF NOT EXISTS "service_pages_process_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_label" varchar,
      "title" varchar,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "_service_pages_v_version_process_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_label" varchar,
      "title" varchar,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "local_seo_pages_process_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_label" varchar,
      "title" varchar,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "_local_seo_pages_v_version_process_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_label" varchar,
      "title" varchar,
      "text" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN ALTER TABLE "service_pages_process_steps" ADD CONSTRAINT "service_pages_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "service_pages_process_steps" ADD CONSTRAINT "service_pages_process_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_process_steps" ADD CONSTRAINT "_service_pages_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_process_steps" ADD CONSTRAINT "_service_pages_v_version_process_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_process_steps" ADD CONSTRAINT "local_seo_pages_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_process_steps" ADD CONSTRAINT "local_seo_pages_process_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_process_steps" ADD CONSTRAINT "_local_seo_pages_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_process_steps" ADD CONSTRAINT "_local_seo_pages_v_version_process_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "service_pages_process_steps_order_idx" ON "service_pages_process_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_process_steps_parent_id_idx" ON "service_pages_process_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "service_pages_process_steps_image_idx" ON "service_pages_process_steps" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_process_steps_order_idx" ON "_service_pages_v_version_process_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_process_steps_parent_id_idx" ON "_service_pages_v_version_process_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_process_steps_image_idx" ON "_service_pages_v_version_process_steps" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_process_steps_order_idx" ON "local_seo_pages_process_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_process_steps_parent_id_idx" ON "local_seo_pages_process_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_process_steps_image_idx" ON "local_seo_pages_process_steps" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_process_steps_order_idx" ON "_local_seo_pages_v_version_process_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_process_steps_parent_id_idx" ON "_local_seo_pages_v_version_process_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_process_steps_image_idx" ON "_local_seo_pages_v_version_process_steps" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_local_seo_pages_v_version_process_steps" CASCADE;
    DROP TABLE IF EXISTS "local_seo_pages_process_steps" CASCADE;
    DROP TABLE IF EXISTS "_service_pages_v_version_process_steps" CASCADE;
    DROP TABLE IF EXISTS "service_pages_process_steps" CASCADE;
    ALTER TABLE "_local_seo_pages_v" DROP COLUMN IF EXISTS "version_process_section_lead";
    ALTER TABLE "_local_seo_pages_v" DROP COLUMN IF EXISTS "version_process_section_emphasis";
    ALTER TABLE "_local_seo_pages_v" DROP COLUMN IF EXISTS "version_process_section_headline";
    ALTER TABLE "local_seo_pages" DROP COLUMN IF EXISTS "process_section_lead";
    ALTER TABLE "local_seo_pages" DROP COLUMN IF EXISTS "process_section_emphasis";
    ALTER TABLE "local_seo_pages" DROP COLUMN IF EXISTS "process_section_headline";
    ALTER TABLE "_service_pages_v" DROP COLUMN IF EXISTS "version_process_section_lead";
    ALTER TABLE "_service_pages_v" DROP COLUMN IF EXISTS "version_process_section_emphasis";
    ALTER TABLE "_service_pages_v" DROP COLUMN IF EXISTS "version_process_section_headline";
    ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "process_section_lead";
    ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "process_section_emphasis";
    ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "process_section_headline";
  `)
}

