import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const renderSourceEnums = [
  'enum_site_pages_legacy_render_source',
  'enum__site_pages_v_version_legacy_render_source',
  'enum_service_pages_legacy_render_source',
  'enum__service_pages_v_version_legacy_render_source',
  'enum_portfolio_projects_legacy_render_source',
  'enum__portfolio_projects_v_version_legacy_render_source',
  'enum_portfolio_categories_legacy_render_source',
  'enum__portfolio_categories_v_version_legacy_render_source',
  'enum_journal_posts_legacy_render_source',
  'enum__journal_posts_v_version_legacy_render_source',
  'enum_local_seo_pages_legacy_render_source',
  'enum__local_seo_pages_v_version_legacy_render_source',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const enumName of renderSourceEnums) {
    await db.execute(sql.raw(`ALTER TYPE "public"."${enumName}" ADD VALUE IF NOT EXISTS 'native-component';`))
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn(
    'Skipping enum rollback for native-component render source. PostgreSQL enum value removal requires a manual type rebuild.',
  )
}
