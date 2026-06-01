import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Startseiten-Sektionen für SitePages (pageType 'home'): Statement, Bereiche, Ausgewählte
// Arbeiten, Hinter der Kamera, Weitere Leistungen, Journal. Rein additiv: nur neue Tabellen +
// Spalten auf site_pages / _site_pages_v. Keine Änderungen an bestehenden Objekten.
// Idempotent geschrieben (IF NOT EXISTS / Constraint-Guards), damit ein erneuter Lauf auf prod
// gefahrlos ist.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Array-Tabellen (Live)
    CREATE TABLE IF NOT EXISTS "site_pages_home_statement_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_home_chapters_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "meta" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_home_about_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_home_services_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar,
      "title" varchar,
      "text" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_home_journal_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "number" varchar,
      "date" varchar,
      "category" varchar,
      "title" varchar,
      "text" varchar,
      "href" varchar
    );

    -- Array-Tabellen (Versionierung)
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_home_statement_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_home_chapters_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "meta" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_home_about_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_home_services_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "number" varchar,
      "title" varchar,
      "text" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_home_journal_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "number" varchar,
      "date" varchar,
      "category" varchar,
      "title" varchar,
      "text" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    -- Gruppen-Spalten (Live)
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_statement_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_statement_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_chapters_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_chapters_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_chapters_intro" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_selected_works_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_selected_works_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_selected_works_intro" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_about_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_about_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_about_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_about_image_id" integer;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_services_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_services_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_services_intro" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_journal_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_journal_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "home_journal_intro" varchar;

    -- Gruppen-Spalten (Versionierung)
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_statement_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_statement_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_chapters_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_chapters_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_chapters_intro" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_selected_works_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_selected_works_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_selected_works_intro" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_about_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_about_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_about_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_about_image_id" integer;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_services_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_services_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_services_intro" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_journal_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_journal_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_home_journal_intro" varchar;

    -- Foreign Keys: Parent + Media
    DO $$ BEGIN ALTER TABLE "site_pages_home_statement_body" ADD CONSTRAINT "site_pages_home_statement_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_chapters_items" ADD CONSTRAINT "site_pages_home_chapters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_chapters_items" ADD CONSTRAINT "site_pages_home_chapters_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_about_body" ADD CONSTRAINT "site_pages_home_about_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_services_items" ADD CONSTRAINT "site_pages_home_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_journal_items" ADD CONSTRAINT "site_pages_home_journal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_home_journal_items" ADD CONSTRAINT "site_pages_home_journal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_statement_body" ADD CONSTRAINT "_site_pages_v_version_home_statement_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_chapters_items" ADD CONSTRAINT "_site_pages_v_version_home_chapters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_chapters_items" ADD CONSTRAINT "_site_pages_v_version_home_chapters_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_about_body" ADD CONSTRAINT "_site_pages_v_version_home_about_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_services_items" ADD CONSTRAINT "_site_pages_v_version_home_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_journal_items" ADD CONSTRAINT "_site_pages_v_version_home_journal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_home_journal_items" ADD CONSTRAINT "_site_pages_v_version_home_journal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_home_about_image_id_media_id_fk" FOREIGN KEY ("home_about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_home_about_image_id_media_id_fk" FOREIGN KEY ("version_home_about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- Indizes
    CREATE INDEX IF NOT EXISTS "site_pages_home_statement_body_order_idx" ON "site_pages_home_statement_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_home_statement_body_parent_id_idx" ON "site_pages_home_statement_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_chapters_items_order_idx" ON "site_pages_home_chapters_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_home_chapters_items_parent_id_idx" ON "site_pages_home_chapters_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_chapters_items_image_idx" ON "site_pages_home_chapters_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_about_body_order_idx" ON "site_pages_home_about_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_home_about_body_parent_id_idx" ON "site_pages_home_about_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_services_items_order_idx" ON "site_pages_home_services_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_home_services_items_parent_id_idx" ON "site_pages_home_services_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_journal_items_order_idx" ON "site_pages_home_journal_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_home_journal_items_parent_id_idx" ON "site_pages_home_journal_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_home_journal_items_image_idx" ON "site_pages_home_journal_items" USING btree ("image_id");

    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_statement_body_order_idx" ON "_site_pages_v_version_home_statement_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_statement_body_parent_id_idx" ON "_site_pages_v_version_home_statement_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_chapters_items_order_idx" ON "_site_pages_v_version_home_chapters_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_chapters_items_parent_id_idx" ON "_site_pages_v_version_home_chapters_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_chapters_items_image_idx" ON "_site_pages_v_version_home_chapters_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_about_body_order_idx" ON "_site_pages_v_version_home_about_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_about_body_parent_id_idx" ON "_site_pages_v_version_home_about_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_services_items_order_idx" ON "_site_pages_v_version_home_services_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_services_items_parent_id_idx" ON "_site_pages_v_version_home_services_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_journal_items_order_idx" ON "_site_pages_v_version_home_journal_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_journal_items_parent_id_idx" ON "_site_pages_v_version_home_journal_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_version_home_journal_items_image_idx" ON "_site_pages_v_version_home_journal_items" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_home_statement_body" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_home_chapters_items" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_home_about_body" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_home_services_items" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_home_journal_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_home_statement_body" CASCADE;
    DROP TABLE IF EXISTS "site_pages_home_chapters_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_home_about_body" CASCADE;
    DROP TABLE IF EXISTS "site_pages_home_services_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_home_journal_items" CASCADE;

    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_statement_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_statement_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_chapters_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_chapters_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_chapters_intro";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_selected_works_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_selected_works_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_selected_works_intro";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_about_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_about_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_about_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_about_image_id";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_services_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_services_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_services_intro";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_journal_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_journal_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "home_journal_intro";

    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_statement_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_statement_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_chapters_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_chapters_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_chapters_intro";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_selected_works_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_selected_works_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_selected_works_intro";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_about_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_about_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_about_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_about_image_id";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_services_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_services_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_services_intro";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_journal_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_journal_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_home_journal_intro";
  `)
}
