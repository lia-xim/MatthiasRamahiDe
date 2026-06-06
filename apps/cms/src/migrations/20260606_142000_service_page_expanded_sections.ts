import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const sectionColumns = [
  'focus_section_headline',
  'focus_section_emphasis',
  'focus_section_lead',
  'gallery_section_headline',
  'gallery_section_lead',
  'audience_section_headline',
  'audience_section_lead',
  'related_section_headline',
  'related_section_emphasis',
  'related_section_lead',
  'location_links_section_headline',
  'location_links_section_emphasis',
  'search_links_section_headline',
  'search_links_section_emphasis',
  'contact_section_headline',
  'contact_section_emphasis',
  'contact_section_lead',
  'contact_section_email_subject',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "focus_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "focus_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "focus_section_lead" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "gallery_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "gallery_section_lead" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "audience_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "audience_section_lead" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "related_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "related_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "related_section_lead" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "location_links_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "location_links_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "search_links_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "search_links_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "contact_section_headline" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "contact_section_emphasis" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "contact_section_lead" varchar;
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "contact_section_email_subject" varchar;

    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_audience_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_audience_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_location_links_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_location_links_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_search_links_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_search_links_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_headline" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_emphasis" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_lead" varchar;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_email_subject" varchar;

    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "focus_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "focus_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "focus_section_lead" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "gallery_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "gallery_section_lead" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "audience_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "audience_section_lead" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "related_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "related_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "related_section_lead" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "location_links_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "location_links_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "search_links_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "search_links_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "contact_section_headline" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "contact_section_emphasis" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "contact_section_lead" varchar;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "contact_section_email_subject" varchar;

    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_focus_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_gallery_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_audience_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_audience_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_related_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_location_links_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_location_links_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_search_links_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_search_links_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_headline" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_emphasis" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_lead" varchar;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_contact_section_email_subject" varchar;

    CREATE TABLE IF NOT EXISTS "service_pages_related_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "href" varchar,
      "alt" varchar
    );
    CREATE TABLE IF NOT EXISTS "service_pages_location_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "service_pages_search_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "_service_pages_v_version_related_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "href" varchar,
      "alt" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_service_pages_v_version_location_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_service_pages_v_version_search_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "local_seo_pages_related_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "href" varchar,
      "alt" varchar
    );
    CREATE TABLE IF NOT EXISTS "local_seo_pages_location_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "local_seo_pages_search_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );
    CREATE TABLE IF NOT EXISTS "_local_seo_pages_v_version_related_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "title" varchar,
      "href" varchar,
      "alt" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_local_seo_pages_v_version_location_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_local_seo_pages_v_version_search_links_section_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN ALTER TABLE "service_pages_related_section_items" ADD CONSTRAINT "service_pages_related_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "service_pages_related_section_items" ADD CONSTRAINT "service_pages_related_section_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "service_pages_location_links_section_items" ADD CONSTRAINT "service_pages_location_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "service_pages_search_links_section_items" ADD CONSTRAINT "service_pages_search_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_related_section_items" ADD CONSTRAINT "_service_pages_v_version_related_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_related_section_items" ADD CONSTRAINT "_service_pages_v_version_related_section_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_location_links_section_items" ADD CONSTRAINT "_service_pages_v_version_location_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v_version_search_links_section_items" ADD CONSTRAINT "_service_pages_v_version_search_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN ALTER TABLE "local_seo_pages_related_section_items" ADD CONSTRAINT "local_seo_pages_related_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_related_section_items" ADD CONSTRAINT "local_seo_pages_related_section_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_location_links_section_items" ADD CONSTRAINT "local_seo_pages_location_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages_search_links_section_items" ADD CONSTRAINT "local_seo_pages_search_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_related_section_items" ADD CONSTRAINT "_local_seo_pages_v_version_related_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_related_section_items" ADD CONSTRAINT "_local_seo_pages_v_version_related_section_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_location_links_section_items" ADD CONSTRAINT "_local_seo_pages_v_version_location_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v_version_search_links_section_items" ADD CONSTRAINT "_local_seo_pages_v_version_search_links_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "service_pages_related_section_items_order_idx" ON "service_pages_related_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_related_section_items_parent_id_idx" ON "service_pages_related_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "service_pages_related_section_items_image_idx" ON "service_pages_related_section_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "service_pages_location_links_section_items_order_idx" ON "service_pages_location_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_location_links_section_items_parent_id_idx" ON "service_pages_location_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "service_pages_search_links_section_items_order_idx" ON "service_pages_search_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_search_links_section_items_parent_id_idx" ON "service_pages_search_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_related_section_items_order_idx" ON "_service_pages_v_version_related_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_related_section_items_parent_id_idx" ON "_service_pages_v_version_related_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_related_section_items_image_idx" ON "_service_pages_v_version_related_section_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_location_links_section_items_order_idx" ON "_service_pages_v_version_location_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_location_links_section_items_parent_id_idx" ON "_service_pages_v_version_location_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_search_links_section_items_order_idx" ON "_service_pages_v_version_search_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_search_links_section_items_parent_id_idx" ON "_service_pages_v_version_search_links_section_items" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "local_seo_pages_related_section_items_order_idx" ON "local_seo_pages_related_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_related_section_items_parent_id_idx" ON "local_seo_pages_related_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_related_section_items_image_idx" ON "local_seo_pages_related_section_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_location_links_section_items_order_idx" ON "local_seo_pages_location_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_location_links_section_items_parent_id_idx" ON "local_seo_pages_location_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_search_links_section_items_order_idx" ON "local_seo_pages_search_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_search_links_section_items_parent_id_idx" ON "local_seo_pages_search_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_related_section_items_order_idx" ON "_local_seo_pages_v_version_related_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_related_section_items_parent_id_idx" ON "_local_seo_pages_v_version_related_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_related_section_items_image_idx" ON "_local_seo_pages_v_version_related_section_items" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_location_links_section_items_order_idx" ON "_local_seo_pages_v_version_location_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_location_links_section_items_parent_id_idx" ON "_local_seo_pages_v_version_location_links_section_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_search_links_section_items_order_idx" ON "_local_seo_pages_v_version_search_links_section_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_search_links_section_items_parent_id_idx" ON "_local_seo_pages_v_version_search_links_section_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_local_seo_pages_v_version_search_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "_local_seo_pages_v_version_location_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "_local_seo_pages_v_version_related_section_items" CASCADE;
    DROP TABLE IF EXISTS "local_seo_pages_search_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "local_seo_pages_location_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "local_seo_pages_related_section_items" CASCADE;
    DROP TABLE IF EXISTS "_service_pages_v_version_search_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "_service_pages_v_version_location_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "_service_pages_v_version_related_section_items" CASCADE;
    DROP TABLE IF EXISTS "service_pages_search_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "service_pages_location_links_section_items" CASCADE;
    DROP TABLE IF EXISTS "service_pages_related_section_items" CASCADE;
  `)

  for (const column of sectionColumns) {
    await db.execute(sql.raw(`ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "${column}";`))
    await db.execute(sql.raw(`ALTER TABLE "local_seo_pages" DROP COLUMN IF EXISTS "${column}";`))
    await db.execute(sql.raw(`ALTER TABLE "_service_pages_v" DROP COLUMN IF EXISTS "version_${column}";`))
    await db.execute(sql.raw(`ALTER TABLE "_local_seo_pages_v" DROP COLUMN IF EXISTS "version_${column}";`))
  }
}
