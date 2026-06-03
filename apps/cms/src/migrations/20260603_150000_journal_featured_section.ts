import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Journal-Uebersicht: Featured-Beitrag-Felder nachziehen, weil die Basis-
// Journal-Migration in Produktion bereits angewendet war.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_kicker" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_headline" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_text" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_button_label" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_button_href" varchar;
    ALTER TABLE "site_pages" ADD COLUMN IF NOT EXISTS "journal_index_featured_image_id" integer;

    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_kicker" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_headline" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_text" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_button_label" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_button_href" varchar;
    ALTER TABLE "_site_pages_v" ADD COLUMN IF NOT EXISTS "version_journal_index_featured_image_id" integer;

    DO $$ BEGIN ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_journal_featured_image_fk" FOREIGN KEY ("journal_index_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_journal_featured_image_fk" FOREIGN KEY ("version_journal_index_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "site_pages_journal_featured_image_idx" ON "site_pages" USING btree ("journal_index_featured_image_id");
    CREATE INDEX IF NOT EXISTS "_site_pages_v_journal_featured_image_idx" ON "_site_pages_v" USING btree ("version_journal_index_featured_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_kicker";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_headline";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_text";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_button_label";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_button_href";
    ALTER TABLE "site_pages" DROP COLUMN IF EXISTS "journal_index_featured_image_id";

    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_kicker";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_headline";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_text";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_button_label";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_button_href";
    ALTER TABLE "_site_pages_v" DROP COLUMN IF EXISTS "version_journal_index_featured_image_id";
  `)
}
