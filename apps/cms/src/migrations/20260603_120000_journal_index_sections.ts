import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Journal-Uebersicht (SitePages, pageType 'journal-index'): Hero ist ueber
// heroSlides vorhanden; diese Migration ergaenzt Ticker, Filter, Index-Texte
// und Abschluss-CTA. Rein additiv und idempotent.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_journal_index_ticker_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_journal_index_filters" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "value" varchar
    );

    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_journal_index_ticker_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_journal_index_filters" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "value" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_index_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_initial_visible_post_count" numeric DEFAULT 6;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_load_more_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_load_status_template" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_text" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_primary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_primary_href" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_secondary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_final_cta_secondary_href" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_index_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_initial_visible_post_count" numeric DEFAULT 6;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_load_more_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_load_status_template" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_text" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_primary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_primary_href" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_secondary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_final_cta_secondary_href" varchar;

    DO $$ BEGIN ALTER TABLE "site_pages_journal_index_ticker_items" ADD CONSTRAINT "sp_journal_ticker_items_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_journal_index_filters" ADD CONSTRAINT "sp_journal_filters_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_journal_index_ticker_items" ADD CONSTRAINT "_spv_journal_ticker_items_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_journal_index_filters" ADD CONSTRAINT "_spv_journal_filters_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "sp_journal_ticker_items_order_idx" ON "site_pages_journal_index_ticker_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_journal_ticker_items_parent_idx" ON "site_pages_journal_index_ticker_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "sp_journal_filters_order_idx" ON "site_pages_journal_index_filters" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "sp_journal_filters_parent_idx" ON "site_pages_journal_index_filters" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_journal_ticker_items_order_idx" ON "_site_pages_v_version_journal_index_ticker_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_journal_ticker_items_parent_idx" ON "_site_pages_v_version_journal_index_ticker_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_journal_filters_order_idx" ON "_site_pages_v_version_journal_index_filters" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_journal_filters_parent_idx" ON "_site_pages_v_version_journal_index_filters" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_journal_index_filters" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_journal_index_ticker_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_journal_index_filters" CASCADE;
    DROP TABLE IF EXISTS "site_pages_journal_index_ticker_items" CASCADE;

    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_index_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_initial_visible_post_count";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_load_more_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_load_status_template";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_text";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_primary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_primary_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_secondary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_final_cta_secondary_href";

    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_index_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_initial_visible_post_count";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_load_more_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_load_status_template";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_text";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_primary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_primary_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_secondary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_final_cta_secondary_href";
  `)
}
