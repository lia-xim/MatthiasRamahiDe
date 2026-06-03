import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Portfolio / Bildarchiv (SitePages, pageType 'portfolio-index'): eigener Hero
// ist bereits ueber heroSlides vorhanden; diese Migration ergaenzt Kontext,
// Bildstrecken/Slices, Archivbilder und Kontakt. Rein additiv und idempotent.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_portfolio_index_context_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_portfolio_index_slices" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "anchor" varchar,
      "label" varchar,
      "heading" varchar,
      "theme" varchar,
      "link_label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_portfolio_index_slices_photos" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "full_image_id" integer,
      "caption" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_portfolio_index_archive_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "full_image_id" integer,
      "caption" varchar,
      "href" varchar
    );

    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_portfolio_index_context_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_portfolio_index_slices" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "anchor" varchar,
      "label" varchar,
      "heading" varchar,
      "theme" varchar,
      "link_label" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_portfolio_index_slices_photos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "full_image_id" integer,
      "caption" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_portfolio_index_archive_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "full_image_id" integer,
      "caption" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_context_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_context_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_archive_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_archive_batch_size" numeric DEFAULT 12;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_contact_subject" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_contact_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "portfolio_index_contact_lead" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_context_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_context_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_archive_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_archive_batch_size" numeric DEFAULT 12;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_contact_subject" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_contact_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_portfolio_index_contact_lead" varchar;

    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_context_body" ADD CONSTRAINT "sp_portfolio_context_body_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_slices" ADD CONSTRAINT "sp_portfolio_slices_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_slices_photos" ADD CONSTRAINT "sp_portfolio_slices_photos_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages_portfolio_index_slices"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_slices_photos" ADD CONSTRAINT "sp_portfolio_slices_photos_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_slices_photos" ADD CONSTRAINT "sp_portfolio_slices_photos_full_image_fk" FOREIGN KEY ("full_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_archive_items" ADD CONSTRAINT "sp_portfolio_archive_items_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_archive_items" ADD CONSTRAINT "sp_portfolio_archive_items_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_portfolio_index_archive_items" ADD CONSTRAINT "sp_portfolio_archive_items_full_image_fk" FOREIGN KEY ("full_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_context_body" ADD CONSTRAINT "_spv_portfolio_context_body_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_slices" ADD CONSTRAINT "_spv_portfolio_slices_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_slices_photos" ADD CONSTRAINT "_spv_portfolio_slices_photos_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v_version_portfolio_index_slices"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_slices_photos" ADD CONSTRAINT "_spv_portfolio_slices_photos_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_slices_photos" ADD CONSTRAINT "_spv_portfolio_slices_photos_full_image_fk" FOREIGN KEY ("full_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_archive_items" ADD CONSTRAINT "_spv_portfolio_archive_items_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_archive_items" ADD CONSTRAINT "_spv_portfolio_archive_items_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_portfolio_index_archive_items" ADD CONSTRAINT "_spv_portfolio_archive_items_full_image_fk" FOREIGN KEY ("full_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "sp_portfolio_context_body_order_idx" ON "site_pages_portfolio_index_context_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_context_body_parent_idx" ON "site_pages_portfolio_index_context_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_order_idx" ON "site_pages_portfolio_index_slices" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_parent_idx" ON "site_pages_portfolio_index_slices" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_photos_order_idx" ON "site_pages_portfolio_index_slices_photos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_photos_parent_idx" ON "site_pages_portfolio_index_slices_photos" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_photos_image_idx" ON "site_pages_portfolio_index_slices_photos" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_slices_photos_full_image_idx" ON "site_pages_portfolio_index_slices_photos" USING btree ("full_image_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_archive_items_order_idx" ON "site_pages_portfolio_index_archive_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_archive_items_parent_idx" ON "site_pages_portfolio_index_archive_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_archive_items_image_idx" ON "site_pages_portfolio_index_archive_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "sp_portfolio_archive_items_full_image_idx" ON "site_pages_portfolio_index_archive_items" USING btree ("full_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_portfolio_index_slices_photos" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_portfolio_index_slices" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_portfolio_index_archive_items" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_portfolio_index_context_body" CASCADE;
    DROP TABLE IF EXISTS "site_pages_portfolio_index_slices_photos" CASCADE;
    DROP TABLE IF EXISTS "site_pages_portfolio_index_slices" CASCADE;
    DROP TABLE IF EXISTS "site_pages_portfolio_index_archive_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_portfolio_index_context_body" CASCADE;

    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_context_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_context_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_archive_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_archive_batch_size";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_contact_subject";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_contact_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "portfolio_index_contact_lead";

    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_context_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_context_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_archive_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_archive_batch_size";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_contact_subject";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_contact_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_portfolio_index_contact_lead";
  `)
}
