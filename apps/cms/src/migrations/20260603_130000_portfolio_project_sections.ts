import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Portfolio-Projekte: eigener Hero-Slider plus echte Projektseiten-Sektionen.
// Rein additiv und idempotent; bestehende Cover/Galerie bleiben erhalten.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_projects_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar,
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar,
      "primary_href" varchar,
      "secondary_label" varchar,
      "secondary_href" varchar
    );
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_context_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_hero_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "headline_line1" varchar,
      "headline_line2" varchar,
      "lead" varchar,
      "duration_sec" numeric DEFAULT 7,
      "primary_label" varchar,
      "primary_href" varchar,
      "secondary_label" varchar,
      "secondary_href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_context_body" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_gallery_eyebrow" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_context_kicker" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_context_headline" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_contact_headline" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_contact_text" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_contact_button_label" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_contact_email_subject" varchar;

    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_gallery_eyebrow" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_context_kicker" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_context_headline" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_contact_headline" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_contact_text" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_contact_button_label" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_contact_email_subject" varchar;

    DO $$ BEGIN ALTER TABLE "portfolio_projects_hero_slides" ADD CONSTRAINT "pp_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_hero_slides" ADD CONSTRAINT "pp_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_context_body" ADD CONSTRAINT "pp_project_context_body_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_hero_slides" ADD CONSTRAINT "_ppv_hero_slides_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_hero_slides" ADD CONSTRAINT "_ppv_hero_slides_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_context_body" ADD CONSTRAINT "_ppv_project_context_body_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "pp_hero_slides_order_idx" ON "portfolio_projects_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pp_hero_slides_parent_idx" ON "portfolio_projects_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_hero_slides_image_idx" ON "portfolio_projects_hero_slides" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "pp_project_context_body_order_idx" ON "portfolio_projects_project_page_context_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pp_project_context_body_parent_idx" ON "portfolio_projects_project_page_context_body" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_ppv_hero_slides_order_idx" ON "_portfolio_projects_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_ppv_hero_slides_parent_idx" ON "_portfolio_projects_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_ppv_hero_slides_image_idx" ON "_portfolio_projects_v_version_hero_slides" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_ppv_project_context_body_order_idx" ON "_portfolio_projects_v_version_project_page_context_body" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_ppv_project_context_body_parent_idx" ON "_portfolio_projects_v_version_project_page_context_body" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_context_body" CASCADE;
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_hero_slides" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_context_body" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_hero_slides" CASCADE;

    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_gallery_eyebrow";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_context_kicker";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_context_headline";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_contact_headline";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_contact_text";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_contact_button_label";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_contact_email_subject";

    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_gallery_eyebrow";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_context_kicker";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_context_headline";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_contact_headline";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_contact_text";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_contact_button_label";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_contact_email_subject";
  `)
}
