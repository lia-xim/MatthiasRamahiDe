import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Fotografie-Uebersicht (SitePages, pageType 'photography-index'): Themen-Bereiche + Einstiegstext.
// Rein additiv: nur neue Array-Tabellen auf site_pages / _site_pages_v. Keine Aenderung an
// bestehenden Objekten. Idempotent (IF NOT EXISTS / Constraint-Guards).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_pages_photography_index_cluster_intro" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "site_pages_photography_index_topics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "emphasis" varchar,
      "text" varchar,
      "link_label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_photography_index_cluster_intro" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_site_pages_v_version_photography_index_topics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "emphasis" varchar,
      "text" varchar,
      "link_label" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN ALTER TABLE "site_pages_photography_index_cluster_intro" ADD CONSTRAINT "site_pages_photography_index_cluster_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_photography_index_topics" ADD CONSTRAINT "site_pages_photography_index_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "site_pages_photography_index_topics" ADD CONSTRAINT "site_pages_photography_index_topics_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_photography_index_cluster_intro" ADD CONSTRAINT "spv_photo_cluster_intro_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_photography_index_topics" ADD CONSTRAINT "_site_pages_v_version_photography_index_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v_version_photography_index_topics" ADD CONSTRAINT "_spv_photo_topics_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "site_pages_photography_index_cluster_intro_order_idx" ON "site_pages_photography_index_cluster_intro" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_photography_index_cluster_intro_parent_id_idx" ON "site_pages_photography_index_cluster_intro" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_photography_index_topics_order_idx" ON "site_pages_photography_index_topics" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_pages_photography_index_topics_parent_id_idx" ON "site_pages_photography_index_topics" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_pages_photography_index_topics_image_idx" ON "site_pages_photography_index_topics" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "spv_photo_cluster_intro_order_idx" ON "_site_pages_v_version_photography_index_cluster_intro" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "spv_photo_cluster_intro_parent_idx" ON "_site_pages_v_version_photography_index_cluster_intro" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "spv_photo_topics_order_idx" ON "_site_pages_v_version_photography_index_topics" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "spv_photo_topics_parent_idx" ON "_site_pages_v_version_photography_index_topics" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "spv_photo_topics_image_idx" ON "_site_pages_v_version_photography_index_topics" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_site_pages_v_version_photography_index_cluster_intro" CASCADE;
    DROP TABLE IF EXISTS "_site_pages_v_version_photography_index_topics" CASCADE;
    DROP TABLE IF EXISTS "site_pages_photography_index_cluster_intro" CASCADE;
    DROP TABLE IF EXISTS "site_pages_photography_index_topics" CASCADE;
  `)
}
