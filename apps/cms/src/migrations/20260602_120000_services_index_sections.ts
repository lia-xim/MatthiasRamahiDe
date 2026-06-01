import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Leistungs-Uebersicht (SitePages, pageType 'services-index'): Ueberblick-Kopf, Leistungen, Warum-Block.
// Rein additiv: neue Array-Tabellen + Spalten auf site_pages / _site_pages_v. Idempotent.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_services_index_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar,
      "overview_label" varchar,
      "headline" varchar,
      "emphasis" varchar,
      "text" varchar,
      "tags" varchar,
      "href" varchar,
      "image1_id" integer,
      "caption1" varchar,
      "image2_id" integer,
      "caption2" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_services_index_why_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "headline" varchar,
      "emphasis" varchar,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_services_index_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "number" varchar,
      "overview_label" varchar,
      "headline" varchar,
      "emphasis" varchar,
      "text" varchar,
      "tags" varchar,
      "href" varchar,
      "image1_id" integer,
      "caption1" varchar,
      "image2_id" integer,
      "caption2" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_services_index_why_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "headline" varchar,
      "emphasis" varchar,
      "text" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_overview_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_overview_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_overview_intro" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_why_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_why_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_why_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "services_index_why_lead" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_overview_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_overview_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_overview_intro" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_why_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_why_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_why_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_services_index_why_lead" varchar;

    DO $$ BEGIN ALTER TABLE "site_pages_services_index_items" ADD CONSTRAINT "site_pages_services_index_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_services_index_items" ADD CONSTRAINT "site_pages_services_index_items_image1_id_media_id_fk" FOREIGN KEY ("image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_services_index_items" ADD CONSTRAINT "site_pages_services_index_items_image2_id_media_id_fk" FOREIGN KEY ("image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_services_index_why_cards" ADD CONSTRAINT "site_pages_services_index_why_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_services_index_items" ADD CONSTRAINT "_site_pages_v_version_services_index_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_services_index_items" ADD CONSTRAINT "_spv_svc_items_image1_media_fk" FOREIGN KEY ("image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_services_index_items" ADD CONSTRAINT "_spv_svc_items_image2_media_fk" FOREIGN KEY ("image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_services_index_why_cards" ADD CONSTRAINT "_spv_svc_why_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "site_pages_services_index_items_order_idx" ON "site_pages_services_index_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_services_index_items_parent_id_idx" ON "site_pages_services_index_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_services_index_items_image1_idx" ON "site_pages_services_index_items" USING btree ("image1_id");
    CREATE INDEX IF NOT EXISTS "site_pages_services_index_items_image2_idx" ON "site_pages_services_index_items" USING btree ("image2_id");
    CREATE INDEX IF NOT EXISTS "site_pages_services_index_why_cards_order_idx" ON "site_pages_services_index_why_cards" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_services_index_why_cards_parent_id_idx" ON "site_pages_services_index_why_cards" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_svc_items_order_idx" ON "_site_pages_v_version_services_index_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_svc_items_parent_idx" ON "_site_pages_v_version_services_index_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_svc_items_image1_idx" ON "_site_pages_v_version_services_index_items" USING btree ("image1_id");
    CREATE INDEX IF NOT EXISTS "_spv_svc_items_image2_idx" ON "_site_pages_v_version_services_index_items" USING btree ("image2_id");
    CREATE INDEX IF NOT EXISTS "_spv_svc_why_cards_order_idx" ON "_site_pages_v_version_services_index_why_cards" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_svc_why_cards_parent_idx" ON "_site_pages_v_version_services_index_why_cards" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_services_index_items" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_services_index_why_cards" CASCADE;
    DROP TABLE IF EXISTS "site_pages_services_index_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_services_index_why_cards" CASCADE;
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_overview_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_overview_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_overview_intro";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_why_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_why_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_why_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "services_index_why_lead";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_overview_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_overview_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_overview_intro";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_why_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_why_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_why_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_services_index_why_lead";
  `)
}
