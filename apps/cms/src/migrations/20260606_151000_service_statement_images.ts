import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "statement_image_id" integer;
    ALTER TABLE "_service_pages_v" ADD COLUMN IF NOT EXISTS "version_statement_image_id" integer;
    ALTER TABLE "local_seo_pages" ADD COLUMN IF NOT EXISTS "statement_image_id" integer;
    ALTER TABLE "_local_seo_pages_v" ADD COLUMN IF NOT EXISTS "version_statement_image_id" integer;

    DO $$ BEGIN ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_statement_image_id_media_id_fk" FOREIGN KEY ("statement_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_version_statement_image_id_media_id_fk" FOREIGN KEY ("version_statement_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "local_seo_pages" ADD CONSTRAINT "local_seo_pages_statement_image_id_media_id_fk" FOREIGN KEY ("statement_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_local_seo_pages_v" ADD CONSTRAINT "_local_seo_pages_v_version_statement_image_id_media_id_fk" FOREIGN KEY ("version_statement_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "service_pages_statement_image_idx" ON "service_pages" USING btree ("statement_image_id");
    CREATE INDEX IF NOT EXISTS "_service_pages_v_version_statement_image_idx" ON "_service_pages_v" USING btree ("version_statement_image_id");
    CREATE INDEX IF NOT EXISTS "local_seo_pages_statement_image_idx" ON "local_seo_pages" USING btree ("statement_image_id");
    CREATE INDEX IF NOT EXISTS "_local_seo_pages_v_version_statement_image_idx" ON "_local_seo_pages_v" USING btree ("version_statement_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_local_seo_pages_v" DROP COLUMN IF EXISTS "version_statement_image_id";
    ALTER TABLE "local_seo_pages" DROP COLUMN IF EXISTS "statement_image_id";
    ALTER TABLE "_service_pages_v" DROP COLUMN IF EXISTS "version_statement_image_id";
    ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "statement_image_id";
  `)
}
