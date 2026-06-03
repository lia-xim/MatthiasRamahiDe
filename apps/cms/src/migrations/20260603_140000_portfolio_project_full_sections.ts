import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Portfolio-Projekte: volle, editierbare Projektseiten-Struktur nach Legacy-Aufbau.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_statement_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_perspectives" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "title" varchar,
      "text" varchar,
      "image_id" integer
    );
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_perspectives_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_info_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar,
      "title" varchar,
      "label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "portfolio_projects_project_page_related_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "title" varchar,
      "href" varchar,
      "image_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_statement_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_perspectives" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "title" varchar,
      "text" varchar,
      "image_id" integer,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_perspectives_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_info_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "number" varchar,
      "title" varchar,
      "label" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_portfolio_projects_v_version_project_page_related_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "title" varchar,
      "href" varchar,
      "image_id" integer,
      "_uuid" varchar
    );

    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_statement_quote" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_statement_accent" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_statement_button_label" varchar;
    ALTER TABLE "portfolio_projects" ADD COLUMN IF NOT EXISTS "project_page_statement_button_href" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_statement_quote" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_statement_accent" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_statement_button_label" varchar;
    ALTER TABLE "_portfolio_projects_v" ADD COLUMN IF NOT EXISTS "version_project_page_statement_button_href" varchar;

    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_statement_stats" ADD CONSTRAINT "pp_project_statement_stats_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_perspectives" ADD CONSTRAINT "pp_project_perspectives_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_perspectives" ADD CONSTRAINT "pp_project_perspectives_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_perspectives_bullets" ADD CONSTRAINT "pp_project_perspectives_bullets_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_project_page_perspectives"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_info_cards" ADD CONSTRAINT "pp_project_info_cards_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_related_cards" ADD CONSTRAINT "pp_project_related_cards_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "portfolio_projects_project_page_related_cards" ADD CONSTRAINT "pp_project_related_cards_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_statement_stats" ADD CONSTRAINT "_ppv_project_statement_stats_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_perspectives" ADD CONSTRAINT "_ppv_project_perspectives_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_perspectives" ADD CONSTRAINT "_ppv_project_perspectives_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_perspectives_bullets" ADD CONSTRAINT "_ppv_project_perspectives_bullets_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_version_project_page_perspectives"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_info_cards" ADD CONSTRAINT "_ppv_project_info_cards_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_related_cards" ADD CONSTRAINT "_ppv_project_related_cards_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_portfolio_projects_v_version_project_page_related_cards" ADD CONSTRAINT "_ppv_project_related_cards_image_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "pp_project_statement_stats_parent_idx" ON "portfolio_projects_project_page_statement_stats" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_project_perspectives_parent_idx" ON "portfolio_projects_project_page_perspectives" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_project_perspectives_image_idx" ON "portfolio_projects_project_page_perspectives" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "pp_project_perspectives_bullets_parent_idx" ON "portfolio_projects_project_page_perspectives_bullets" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_project_info_cards_parent_idx" ON "portfolio_projects_project_page_info_cards" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_project_related_cards_parent_idx" ON "portfolio_projects_project_page_related_cards" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pp_project_related_cards_image_idx" ON "portfolio_projects_project_page_related_cards" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_related_cards" CASCADE;
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_info_cards" CASCADE;
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_perspectives_bullets" CASCADE;
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_perspectives" CASCADE;
    DROP TABLE IF EXISTS "_portfolio_projects_v_version_project_page_statement_stats" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_related_cards" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_info_cards" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_perspectives_bullets" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_perspectives" CASCADE;
    DROP TABLE IF EXISTS "portfolio_projects_project_page_statement_stats" CASCADE;

    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_statement_quote";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_statement_accent";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_statement_button_label";
    ALTER TABLE "portfolio_projects" DROP COLUMN IF EXISTS "project_page_statement_button_href";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_statement_quote";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_statement_accent";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_statement_button_label";
    ALTER TABLE "_portfolio_projects_v" DROP COLUMN IF EXISTS "version_project_page_statement_button_href";
  `)
}
