import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "service_pages_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html'
    );

    CREATE TABLE IF NOT EXISTS "_service_pages_v_version_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html',
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "local_seo_pages_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html'
    );

    CREATE TABLE IF NOT EXISTS "_local_seo_pages_v_version_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html',
      "_uuid" varchar
    );

    DO $$ BEGIN ALTER TABLE "service_pages_hero_slides" ADD CONSTRAINT "service_pages_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "service_pages_hero_slides" ADD CONSTRAINT "service_pages_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_hero_slides" ADD CONSTRAINT "_service_pages_v_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_hero_slides" ADD CONSTRAINT "_service_pages_v_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "local_seo_pages_hero_slides" ADD CONSTRAINT "local_seo_pages_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_hero_slides" ADD CONSTRAINT "local_seo_pages_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_hero_slides" ADD CONSTRAINT "_local_seo_pages_v_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_hero_slides" ADD CONSTRAINT "_local_seo_pages_v_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "service_pages_hero_slides_order_idx" ON "service_pages_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_hero_slides_parent_idx" ON "service_pages_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "service_pages_hero_slides_image_idx" ON "service_pages_hero_slides" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_hero_slides_order_idx" ON "_service_pages_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_hero_slides_parent_idx" ON "_service_pages_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_hero_slides_image_idx" ON "_service_pages_v_version_hero_slides" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "local_seo_pages_hero_slides_order_idx" ON "local_seo_pages_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_hero_slides_parent_idx" ON "local_seo_pages_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_hero_slides_image_idx" ON "local_seo_pages_hero_slides" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_hero_slides_order_idx" ON "_local_seo_pages_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_hero_slides_parent_idx" ON "_local_seo_pages_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_hero_slides_image_idx" ON "_local_seo_pages_v_version_hero_slides" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_local_seo_pages_v_version_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "local_seo_pages_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "_service_pages_v_version_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "service_pages_hero_slides" CASCADE;
  `)
}
