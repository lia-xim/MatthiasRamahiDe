import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Ueber-mich-Seite (SitePages, pageType 'about'): Hero, Haltung, sechs Bereiche,
// Sophia/Video und Kontakt. Rein additiv: neue Array-Tabellen + Spalten auf
// site_pages / _site_pages_v. Idempotent, damit ein erneuter Lauf gefahrlos ist.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_about_chapters_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "alt" varchar,
      "link_label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_about_sister_plate_roles" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar
    );

    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_about_chapters_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "alt" varchar,
      "link_label" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_about_sister_plate_roles" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_title_line1" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_title_line2" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_lead" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_image_id" integer;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_primary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_primary_href" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_secondary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_hero_secondary_href" varchar;

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_lead" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_body" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_primary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_primary_href" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_secondary_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_statement_secondary_href" varchar;

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_chapters_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_chapters_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_chapters_intro" varchar;

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_headline_emphasis" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_lead" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_body" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_button_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_href" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_plate_tag" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_plate_name_line1" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_plate_name_line2" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_sister_plate_location" varchar;

    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_contact_subject" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_contact_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "about_contact_lead" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_title_line1" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_title_line2" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_lead" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_image_id" integer;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_primary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_primary_href" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_secondary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_hero_secondary_href" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_lead" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_body" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_primary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_primary_href" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_secondary_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_statement_secondary_href" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_chapters_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_chapters_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_chapters_intro" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_headline_emphasis" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_lead" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_body" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_button_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_href" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_plate_tag" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_plate_name_line1" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_plate_name_line2" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_sister_plate_location" varchar;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_contact_subject" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_contact_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_about_contact_lead" varchar;

    DO $$ BEGIN ALTER TABLE "site_pages_about_chapters_items" ADD CONSTRAINT "site_pages_about_chapters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_about_chapters_items" ADD CONSTRAINT "site_pages_about_chapters_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_about_sister_plate_roles" ADD CONSTRAINT "site_pages_about_sister_plate_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_about_chapters_items" ADD CONSTRAINT "_spv_about_chapters_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_about_chapters_items" ADD CONSTRAINT "_spv_about_chapters_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_about_sister_plate_roles" ADD CONSTRAINT "_spv_about_sister_plate_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_about_hero_image_id_media_id_fk" FOREIGN KEY ("about_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_about_hero_image_id_media_id_fk" FOREIGN KEY ("version_about_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "site_pages_about_chapters_items_order_idx" ON "site_pages_about_chapters_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_about_chapters_items_parent_id_idx" ON "site_pages_about_chapters_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_about_chapters_items_image_idx" ON "site_pages_about_chapters_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "site_pages_about_sister_plate_roles_order_idx" ON "site_pages_about_sister_plate_roles" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_about_sister_plate_roles_parent_id_idx" ON "site_pages_about_sister_plate_roles" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_about_chapters_items_order_idx" ON "_site_pages_v_version_about_chapters_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_about_chapters_items_parent_idx" ON "_site_pages_v_version_about_chapters_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_spv_about_chapters_items_image_idx" ON "_site_pages_v_version_about_chapters_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_spv_about_sister_plate_roles_order_idx" ON "_site_pages_v_version_about_sister_plate_roles" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_spv_about_sister_plate_roles_parent_idx" ON "_site_pages_v_version_about_sister_plate_roles" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_about_chapters_items" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_about_sister_plate_roles" CASCADE;
    DROP TABLE IF EXISTS "site_pages_about_chapters_items" CASCADE;
    DROP TABLE IF EXISTS "site_pages_about_sister_plate_roles" CASCADE;

    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_title_line1";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_title_line2";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_lead";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_image_id";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_primary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_primary_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_secondary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_hero_secondary_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_lead";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_body";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_primary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_primary_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_secondary_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_statement_secondary_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_chapters_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_chapters_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_chapters_intro";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_headline_emphasis";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_lead";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_body";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_button_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_plate_tag";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_plate_name_line1";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_plate_name_line2";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_sister_plate_location";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_contact_subject";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_contact_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "about_contact_lead";

    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_title_line1";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_title_line2";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_lead";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_image_id";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_primary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_primary_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_secondary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_hero_secondary_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_lead";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_body";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_primary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_primary_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_secondary_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_statement_secondary_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_chapters_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_chapters_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_chapters_intro";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_headline_emphasis";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_lead";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_body";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_button_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_plate_tag";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_plate_name_line1";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_plate_name_line2";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_sister_plate_location";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_contact_subject";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_contact_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_about_contact_lead";
  `)
}
