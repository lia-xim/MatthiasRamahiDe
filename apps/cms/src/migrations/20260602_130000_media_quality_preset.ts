import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`DO $$ BEGIN
  CREATE TYPE "public"."enum_site_settings_media_quality_preset" AS ENUM('eco', 'standard', 'maximal');
EXCEPTION WHEN duplicate_object THEN null; END $$;`),
  )
  await db.execute(
    sql.raw(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "media_quality_preset" "enum_site_settings_media_quality_preset" DEFAULT 'standard';`,
    ),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "media_quality_preset";`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_site_settings_media_quality_preset";`))
}
