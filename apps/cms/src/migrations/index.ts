import * as migration_20260528_182951_initial_postgres_schema from './20260528_182951_initial_postgres_schema';
import * as migration_20260529_120800_add_native_component_render_source from './20260529_120800_add_native_component_render_source';
import * as migration_20260529_153000_add_site_page_hero_slides from './20260529_153000_add_site_page_hero_slides';

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
];
