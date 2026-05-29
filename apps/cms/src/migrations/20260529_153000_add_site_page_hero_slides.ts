import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html'
    );

    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar DEFAULT 'Fotografie',
      "headline_line2" varchar,
      "lead" varchar,
      "primary_label" varchar DEFAULT 'Projekt anfragen',
      "primary_href" varchar DEFAULT '#anfrage',
      "secondary_label" varchar DEFAULT 'Arbeiten ansehen',
      "secondary_href" varchar DEFAULT '/portfolio.html',
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "site_pages_hero_slides" ADD CONSTRAINT "site_pages_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "site_pages_hero_slides" ADD CONSTRAINT "site_pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_site_pages_v_version_hero_slides" ADD CONSTRAINT "_site_pages_v_version_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_site_pages_v_version_hero_slides" ADD CONSTRAINT "_site_pages_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_order_idx" ON "site_pages_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_parent_id_idx" ON "site_pages_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_hero_slides_image_idx" ON "site_pages_hero_slides" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_order_idx" ON "_site_pages_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_parent_id_idx" ON "_site_pages_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_hero_slides_image_idx" ON "_site_pages_v_version_hero_slides" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "site_pages_hero_slides" CASCADE;
  `)
}
