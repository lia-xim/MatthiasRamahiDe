import * as migration_20260528_182951_initial_postgres_schema from './20260528_182951_initial_postgres_schema';
import * as migration_20260529_120800_add_native_component_render_source from './20260529_120800_add_native_component_render_source';
import * as migration_20260529_153000_add_site_page_hero_slides from './20260529_153000_add_site_page_hero_slides';
import * as migration_20260530_193435_svc_sections from './20260530_193435_svc_sections';
import * as migration_20260531_120000_local_seo_sections from './20260531_120000_local_seo_sections';
import * as migration_20260601_120000_home_sections from './20260601_120000_home_sections';
import * as migration_20260601_140000_photography_index_sections from './20260601_140000_photography_index_sections';
import * as migration_20260602_120000_services_index_sections from './20260602_120000_services_index_sections';
import * as migration_20260602_130000_media_quality_preset from './20260602_130000_media_quality_preset';
import * as migration_20260602_140000_hero_slide_duration from './20260602_140000_hero_slide_duration';

export const migrations = [
  {
    up: migration_20260528_182951_initial_postgres_schema.up,
    down: migration_20260528_182951_initial_postgres_schema.down,
    name: '20260528_182951_initial_postgres_schema'
  },
  {
    up: migration_20260529_120800_add_native_component_render_source.up,
    down: migration_20260529_120800_add_native_component_render_source.down,
    name: '20260529_120800_add_native_component_render_source'
  },
  {
    up: migration_20260529_153000_add_site_page_hero_slides.up,
    down: migration_20260529_153000_add_site_page_hero_slides.down,
    name: '20260529_153000_add_site_page_hero_slides'
  },
  {
    up: migration_20260530_193435_svc_sections.up,
    down: migration_20260530_193435_svc_sections.down,
    name: '20260530_193435_svc_sections'
  },
  {
    up: migration_20260531_120000_local_seo_sections.up,
    down: migration_20260531_120000_local_seo_sections.down,
    name: '20260531_120000_local_seo_sections'
  },
  {
    up: migration_20260601_120000_home_sections.up,
    down: migration_20260601_120000_home_sections.down,
    name: '20260601_120000_home_sections'
  },
  {
    up: migration_20260601_140000_photography_index_sections.up,
    down: migration_20260601_140000_photography_index_sections.down,
    name: '20260601_140000_photography_index_sections'
  },
  {
    up: migration_20260602_120000_services_index_sections.up,
    down: migration_20260602_120000_services_index_sections.down,
    name: '20260602_120000_services_index_sections'
  },
  {
    up: migration_20260602_130000_media_quality_preset.up,
    down: migration_20260602_130000_media_quality_preset.down,
    name: '20260602_130000_media_quality_preset'
  },
  {
    up: migration_20260602_140000_hero_slide_duration.up,
    down: migration_20260602_140000_hero_slide_duration.down,
    name: '20260602_140000_hero_slide_duration'
  },
];
