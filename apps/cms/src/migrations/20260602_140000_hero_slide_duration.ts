import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "site_pages_hero_slides" ADD COLUMN IF NOT EXISTS "duration_sec" numeric DEFAULT 7;`))
  await db.execute(
    sql.raw(`ALTER TABLE "_site_pages_v_version_hero_slides" ADD COLUMN IF NOT EXISTS "duration_sec" numeric DEFAULT 7;`),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "site_pages_hero_slides" DROP COLUMN IF EXISTS "duration_sec";`))
  await db.execute(sql.raw(`ALTER TABLE "_site_pages_v_version_hero_slides" DROP COLUMN IF EXISTS "duration_sec";`))
}
