import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."crop" AS ENUM('auto', 'protect-detail', 'protect-space', 'dramatic-crop');
  CREATE TYPE "public"."enum_site_pages_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum_site_pages_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_site_pages_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_site_pages_page_type" AS ENUM('home', 'about', 'contact', 'photography-index', 'portfolio-index', 'services-index', 'journal-index', 'legal');
  CREATE TYPE "public"."enum_site_pages_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_site_pages_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_site_pages_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_site_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_pages_v_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum__site_pages_v_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__site_pages_v_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__site_pages_v_version_page_type" AS ENUM('home', 'about', 'contact', 'photography-index', 'portfolio-index', 'services-index', 'journal-index', 'legal');
  CREATE TYPE "public"."enum__site_pages_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__site_pages_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__site_pages_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__site_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_pages_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum_service_pages_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_service_pages_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_service_pages_related_pages_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_service_pages_related_pages_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_service_pages_service_type" AS ENUM('automotive', 'sportwagen', 'oldtimer', 'motorrad', 'portrait', 'landschaft', 'fotolabor', 'grossformatdruck', 'werbetechnik', 'webdesign-seo', 'videografie', 'other');
  CREATE TYPE "public"."enum_service_pages_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_service_pages_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_service_pages_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_service_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_pages_v_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum__service_pages_v_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__service_pages_v_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__service_pages_v_version_related_pages_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__service_pages_v_version_related_pages_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__service_pages_v_version_service_type" AS ENUM('automotive', 'sportwagen', 'oldtimer', 'motorrad', 'portrait', 'landschaft', 'fotolabor', 'grossformatdruck', 'werbetechnik', 'webdesign-seo', 'videografie', 'other');
  CREATE TYPE "public"."enum__service_pages_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__service_pages_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__service_pages_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__service_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_portfolio_projects_gallery_role" AS ENUM('hero', 'sequence', 'detail', 'closing');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_portfolio_projects_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_portfolio_projects_presentation_mode" AS ENUM('floating-archive', 'narrative-stage', 'experimental-lens', 'editorial');
  CREATE TYPE "public"."enum_portfolio_projects_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_portfolio_projects_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_portfolio_projects_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_portfolio_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_gallery_role" AS ENUM('hero', 'sequence', 'detail', 'closing');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__portfolio_projects_v_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_presentation_mode" AS ENUM('floating-archive', 'narrative-stage', 'experimental-lens', 'editorial');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__portfolio_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_portfolio_categories_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_portfolio_categories_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_portfolio_categories_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_portfolio_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__portfolio_categories_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__portfolio_categories_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__portfolio_categories_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__portfolio_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_journal_posts_related_pages_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_journal_posts_related_pages_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_journal_posts_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum_journal_posts_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_journal_posts_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_journal_posts_category" AS ENUM('behind-the-scenes', 'automotive', 'portrait', 'landscape-print', 'process');
  CREATE TYPE "public"."enum_journal_posts_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_journal_posts_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_journal_posts_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_journal_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_posts_v_version_related_pages_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__journal_posts_v_version_related_pages_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__journal_posts_v_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum__journal_posts_v_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__journal_posts_v_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__journal_posts_v_version_category" AS ENUM('behind-the-scenes', 'automotive', 'portrait', 'landscape-print', 'process');
  CREATE TYPE "public"."enum__journal_posts_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__journal_posts_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__journal_posts_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__journal_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_local_seo_pages_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum_local_seo_pages_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_local_seo_pages_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_local_seo_pages_priority" AS ENUM('high', 'medium', 'later');
  CREATE TYPE "public"."enum_local_seo_pages_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum_local_seo_pages_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum_local_seo_pages_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum_local_seo_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__local_seo_pages_v_blocks_image_sequence_layout" AS ENUM('editorial-strip', 'contact-sheet', 'stage', 'single-large');
  CREATE TYPE "public"."enum__local_seo_pages_v_blocks_link_list_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum__local_seo_pages_v_blocks_link_list_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum__local_seo_pages_v_version_priority" AS ENUM('high', 'medium', 'later');
  CREATE TYPE "public"."enum__local_seo_pages_v_version_seo_search_intent" AS ENUM('informational', 'commercial', 'local', 'transactional', 'navigational');
  CREATE TYPE "public"."enum__local_seo_pages_v_version_legacy_migration_status" AS ENUM('seeded', 'reviewed', 'componentized', 'live');
  CREATE TYPE "public"."enum__local_seo_pages_v_version_legacy_render_source" AS ENUM('legacy-file', 'payload-legacy-html', 'structured-blocks');
  CREATE TYPE "public"."enum__local_seo_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_image_type" AS ENUM('portrait', 'automotive', 'landscape', 'motorcycle', 'detail', 'editorial', 'atmosphere', 'behind-the-scenes');
  CREATE TYPE "public"."enum_media_visual_tone" AS ENUM('dark-cinematic', 'light-editorial', 'warm-atmospheric', 'cool-technical', 'detail-texture');
  CREATE TYPE "public"."enum_media_usage_purpose" AS ENUM('hero', 'teaser', 'gallery', 'social', 'local-seo', 'print', 'internal-only');
  CREATE TYPE "public"."enum_media_category" AS ENUM('uncategorized', 'portrait', 'automotive', 'oldtimer', 'motorrad', 'landschaft', 'service', 'atmosphere');
  CREATE TYPE "public"."enum_media_orientation" AS ENUM('portrait', 'landscape', 'square', 'panorama');
  CREATE TYPE "public"."enum_navigation_primary_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_navigation_primary_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_navigation_photography_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_navigation_photography_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_navigation_footer_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_navigation_footer_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_navigation_legal_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_navigation_legal_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_columns_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_columns_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_primary_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_primary_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_service_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_service_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_social_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_social_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'behance', 'other');
  CREATE TYPE "public"."enum_footer_legal_links_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_legal_links_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TYPE "public"."enum_footer_about_link_seo_purpose" AS ENUM('contextual', 'navigation', 'conversion', 'citation', 'legal', 'social');
  CREATE TYPE "public"."enum_footer_about_link_rel" AS ENUM('follow', 'nofollow', 'sponsored', 'ugc');
  CREATE TABLE "site_pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto'
  );
  
  CREATE TABLE "site_pages_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum_site_pages_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "site_pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum_site_pages_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_site_pages_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_pages_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"page_type" "enum_site_pages_page_type",
  	"intro" varchar,
  	"hero_image_id" integer,
  	"teaser_image_id" integer,
  	"contact_override_headline" varchar,
  	"contact_override_text" varchar,
  	"contact_override_email_subject" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_site_pages_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_site_pages_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_site_pages_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_site_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "site_pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum__site_pages_v_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum__site_pages_v_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__site_pages_v_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_page_type" "enum__site_pages_v_version_page_type",
  	"version_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_teaser_image_id" integer,
  	"version_contact_override_headline" varchar,
  	"version_contact_override_text" varchar,
  	"version_contact_override_email_subject" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__site_pages_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__site_pages_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__site_pages_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__site_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_site_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_pages_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "service_pages_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "service_pages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "service_pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto'
  );
  
  CREATE TABLE "service_pages_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum_service_pages_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "service_pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum_service_pages_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_service_pages_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "service_pages_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_pages_related_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"seo_purpose" "enum_service_pages_related_pages_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_service_pages_related_pages_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "service_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"service_type" "enum_service_pages_service_type",
  	"intro" varchar,
  	"hero_image_id" integer,
  	"teaser_image_id" integer,
  	"cta_headline" varchar,
  	"cta_text" varchar,
  	"cta_button_label" varchar,
  	"cta_email_subject" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_service_pages_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_service_pages_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_service_pages_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_service_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "service_pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_proof_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum__service_pages_v_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum__service_pages_v_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__service_pages_v_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_pages_v_version_related_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"seo_purpose" "enum__service_pages_v_version_related_pages_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__service_pages_v_version_related_pages_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_service_type" "enum__service_pages_v_version_service_type",
  	"version_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_teaser_image_id" integer,
  	"version_cta_headline" varchar,
  	"version_cta_text" varchar,
  	"version_cta_button_label" varchar,
  	"version_cta_email_subject" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__service_pages_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__service_pages_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__service_pages_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__service_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_service_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "portfolio_projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"role" "enum_portfolio_projects_gallery_role" DEFAULT 'sequence'
  );
  
  CREATE TABLE "portfolio_projects_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto'
  );
  
  CREATE TABLE "portfolio_projects_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum_portfolio_projects_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum_portfolio_projects_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_portfolio_projects_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "portfolio_projects_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"published_at" timestamp(3) with time zone,
  	"category_id" integer,
  	"excerpt" varchar,
  	"usage_summary" varchar,
  	"year" varchar,
  	"location" varchar,
  	"client" varchar,
  	"cover_image_id" integer,
  	"presentation_mode" "enum_portfolio_projects_presentation_mode" DEFAULT 'floating-archive',
  	"cta_headline" varchar,
  	"cta_text" varchar,
  	"cta_button_label" varchar,
  	"cta_email_subject" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_portfolio_projects_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_portfolio_projects_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_portfolio_projects_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio_projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "portfolio_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"service_pages_id" integer
  );
  
  CREATE TABLE "_portfolio_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"role" "enum__portfolio_projects_v_version_gallery_role" DEFAULT 'sequence',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum__portfolio_projects_v_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum__portfolio_projects_v_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__portfolio_projects_v_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_published_at" timestamp(3) with time zone,
  	"version_category_id" integer,
  	"version_excerpt" varchar,
  	"version_usage_summary" varchar,
  	"version_year" varchar,
  	"version_location" varchar,
  	"version_client" varchar,
  	"version_cover_image_id" integer,
  	"version_presentation_mode" "enum__portfolio_projects_v_version_presentation_mode" DEFAULT 'floating-archive',
  	"version_cta_headline" varchar,
  	"version_cta_text" varchar,
  	"version_cta_button_label" varchar,
  	"version_cta_email_subject" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__portfolio_projects_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__portfolio_projects_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__portfolio_projects_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_portfolio_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_portfolio_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"service_pages_id" integer
  );
  
  CREATE TABLE "portfolio_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"sort_order" numeric DEFAULT 100,
  	"intro" varchar,
  	"cover_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_portfolio_categories_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_portfolio_categories_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_portfolio_categories_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_portfolio_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio_categories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_portfolio_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_intro" varchar,
  	"version_cover_image_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__portfolio_categories_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__portfolio_categories_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__portfolio_categories_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__portfolio_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_portfolio_categories_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "journal_posts_related_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"seo_purpose" "enum_journal_posts_related_pages_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_journal_posts_related_pages_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "journal_posts_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto'
  );
  
  CREATE TABLE "journal_posts_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum_journal_posts_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum_journal_posts_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_journal_posts_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "journal_posts_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "journal_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"category" "enum_journal_posts_category",
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"reading_time" numeric,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_journal_posts_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_journal_posts_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_journal_posts_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journal_posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_journal_posts_v_version_related_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"seo_purpose" "enum__journal_posts_v_version_related_pages_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__journal_posts_v_version_related_pages_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum__journal_posts_v_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum__journal_posts_v_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__journal_posts_v_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_journal_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_category" "enum__journal_posts_v_version_category",
  	"version_published_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_reading_time" numeric,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__journal_posts_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__journal_posts_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__journal_posts_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_journal_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "local_seo_pages_local_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "local_seo_pages_local_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto'
  );
  
  CREATE TABLE "local_seo_pages_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum_local_seo_pages_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum_local_seo_pages_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_local_seo_pages_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "local_seo_pages_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "local_seo_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"priority" "enum_local_seo_pages_priority" DEFAULT 'later',
  	"city" varchar,
  	"service" varchar,
  	"intro" varchar,
  	"hero_image_id" integer,
  	"canonical_service_page_id" integer,
  	"target_keyword" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_focus_keyword" varchar,
  	"seo_search_intent" "enum_local_seo_pages_seo_search_intent",
  	"seo_canonical_url" varchar,
  	"seo_legacy_url" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"legacy_source_file" varchar,
  	"legacy_source_url" varchar,
  	"legacy_migration_status" "enum_local_seo_pages_legacy_migration_status" DEFAULT 'seeded',
  	"legacy_render_source" "enum_local_seo_pages_legacy_render_source" DEFAULT 'legacy-file',
  	"legacy_rendered_head_html" varchar,
  	"legacy_rendered_body_html" varchar,
  	"legacy_after_footer_html" varchar,
  	"legacy_body_class" varchar,
  	"legacy_header_current" varchar,
  	"legacy_extracted_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_local_seo_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "local_seo_pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_version_local_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_version_local_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_image_sequence_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"crop_intent" "crop" DEFAULT 'auto',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_image_sequence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"layout" "enum__local_seo_pages_v_blocks_image_sequence_layout" DEFAULT 'editorial-strip',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_link_list_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"seo_purpose" "enum__local_seo_pages_v_blocks_link_list_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum__local_seo_pages_v_blocks_link_list_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_link_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Projekt anfragen',
  	"email_subject" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_local_seo_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_priority" "enum__local_seo_pages_v_version_priority" DEFAULT 'later',
  	"version_city" varchar,
  	"version_service" varchar,
  	"version_intro" varchar,
  	"version_hero_image_id" integer,
  	"version_canonical_service_page_id" integer,
  	"version_target_keyword" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyword" varchar,
  	"version_seo_search_intent" "enum__local_seo_pages_v_version_seo_search_intent",
  	"version_seo_canonical_url" varchar,
  	"version_seo_legacy_url" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_legacy_source_file" varchar,
  	"version_legacy_source_url" varchar,
  	"version_legacy_migration_status" "enum__local_seo_pages_v_version_legacy_migration_status" DEFAULT 'seeded',
  	"version_legacy_render_source" "enum__local_seo_pages_v_version_legacy_render_source" DEFAULT 'legacy-file',
  	"version_legacy_rendered_head_html" varchar,
  	"version_legacy_rendered_body_html" varchar,
  	"version_legacy_after_footer_html" varchar,
  	"version_legacy_body_class" varchar,
  	"version_legacy_header_current" varchar,
  	"version_legacy_extracted_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__local_seo_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_local_seo_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "media_image_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_media_image_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "media_visual_tone" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_media_visual_tone",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "media_usage_purpose" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_media_usage_purpose",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"featured" boolean DEFAULT false,
  	"category" "enum_media_category" DEFAULT 'uncategorized',
  	"orientation" "enum_media_orientation",
  	"usage_notes" varchar,
  	"dominant_color" varchar,
  	"blur_data_url" varchar,
  	"legacy_source_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_mobile_url" varchar,
  	"sizes_mobile_width" numeric,
  	"sizes_mobile_height" numeric,
  	"sizes_mobile_mime_type" varchar,
  	"sizes_mobile_filesize" numeric,
  	"sizes_mobile_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_thumb_avif_url" varchar,
  	"sizes_thumb_avif_width" numeric,
  	"sizes_thumb_avif_height" numeric,
  	"sizes_thumb_avif_mime_type" varchar,
  	"sizes_thumb_avif_filesize" numeric,
  	"sizes_thumb_avif_filename" varchar,
  	"sizes_mobile_avif_url" varchar,
  	"sizes_mobile_avif_width" numeric,
  	"sizes_mobile_avif_height" numeric,
  	"sizes_mobile_avif_mime_type" varchar,
  	"sizes_mobile_avif_filesize" numeric,
  	"sizes_mobile_avif_filename" varchar,
  	"sizes_card_avif_url" varchar,
  	"sizes_card_avif_width" numeric,
  	"sizes_card_avif_height" numeric,
  	"sizes_card_avif_mime_type" varchar,
  	"sizes_card_avif_filesize" numeric,
  	"sizes_card_avif_filename" varchar,
  	"sizes_hero_avif_url" varchar,
  	"sizes_hero_avif_width" numeric,
  	"sizes_hero_avif_height" numeric,
  	"sizes_hero_avif_mime_type" varchar,
  	"sizes_hero_avif_filesize" numeric,
  	"sizes_hero_avif_filename" varchar,
  	"sizes_wide_avif_url" varchar,
  	"sizes_wide_avif_width" numeric,
  	"sizes_wide_avif_height" numeric,
  	"sizes_wide_avif_mime_type" varchar,
  	"sizes_wide_avif_filesize" numeric,
  	"sizes_wide_avif_filename" varchar
  );
  
  CREATE TABLE "media_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"site_pages_id" integer,
  	"service_pages_id" integer,
  	"portfolio_projects_id" integer,
  	"portfolio_categories_id" integer,
  	"journal_posts_id" integer,
  	"local_seo_pages_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_primary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_navigation_primary_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_navigation_primary_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_photography_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_navigation_photography_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_navigation_photography_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_navigation_footer_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_navigation_footer_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_navigation_legal_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_navigation_legal_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT 'Anfrage',
  	"cta_href" varchar DEFAULT 'mailto:info@matthiasramahi.de?subject=Projektanfrage' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Matthias Ramahi Fotografie' NOT NULL,
  	"site_url" varchar DEFAULT 'https://matthiasramahi.de' NOT NULL,
  	"locale" varchar DEFAULT 'de_DE' NOT NULL,
  	"owner_name" varchar DEFAULT 'Matthias Ramahi',
  	"email" varchar DEFAULT 'info@matthiasramahi.de' NOT NULL,
  	"phone" varchar,
  	"instagram_url" varchar,
  	"default_meta_title" varchar,
  	"default_meta_description" varchar,
  	"default_og_image_id" integer,
  	"footer_statement" varchar DEFAULT 'Fotografie, die Raeume oeffnet. Portfolio, Auftraege und visuelle Produktion in Duesseldorf / NRW - klar kuratiert, technisch sauber und bereit fuer Print, Web und Kampagne.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "global_ctas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_label" varchar DEFAULT 'Projekt anfragen' NOT NULL,
  	"primary_href" varchar DEFAULT '/contact.html#anfrage' NOT NULL,
  	"contact_module_eyebrow" varchar DEFAULT 'Anfrage',
  	"contact_module_headline" varchar DEFAULT 'Projekt anfragen.',
  	"contact_module_text" varchar DEFAULT 'Projektart, Ort, Zeitraum und gewuenschte Nutzung reichen fuer den ersten Schritt. Ich melde mich mit Rueckfragen oder einem naechsten Vorschlag per E-Mail.',
  	"contact_module_button_label" varchar DEFAULT 'Projekt anfragen',
  	"contact_module_email_subject" varchar DEFAULT 'Projektanfrage',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_footer_columns_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_footer_columns_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_primary_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_footer_primary_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_footer_primary_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_footer_service_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_footer_service_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_footer_social_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_footer_social_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false,
  	"platform" "enum_footer_social_links_platform"
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"seo_purpose" "enum_footer_legal_links_seo_purpose" DEFAULT 'contextual',
  	"rel" "enum_footer_legal_links_rel" DEFAULT 'follow',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statement" varchar DEFAULT 'Fotografie, die Raeume oeffnet. Portfolio, Auftraege und visuelle Produktion in Duesseldorf / NRW - klar kuratiert, technisch sauber und bereit fuer Print, Web und Kampagne.',
  	"statement_highlight" varchar DEFAULT 'Marke, Sammlung und Druck',
  	"email" varchar DEFAULT 'info@matthiasramahi.de' NOT NULL,
  	"phone" varchar,
  	"location_label" varchar DEFAULT 'Duesseldorf / NRW',
  	"copyright" varchar DEFAULT '(c) 2026 Matthias Ramahi',
  	"about_link_label" varchar NOT NULL,
  	"about_link_href" varchar NOT NULL,
  	"about_link_seo_purpose" "enum_footer_about_link_seo_purpose" DEFAULT 'contextual',
  	"about_link_rel" "enum_footer_about_link_rel" DEFAULT 'follow',
  	"about_link_open_in_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_pages_blocks_text_block" ADD CONSTRAINT "site_pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_image_sequence_items" ADD CONSTRAINT "site_pages_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_image_sequence_items" ADD CONSTRAINT "site_pages_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_image_sequence" ADD CONSTRAINT "site_pages_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_quote_block" ADD CONSTRAINT "site_pages_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_faq_block_items" ADD CONSTRAINT "site_pages_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_faq_block" ADD CONSTRAINT "site_pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_link_list_links" ADD CONSTRAINT "site_pages_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_link_list" ADD CONSTRAINT "site_pages_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages_blocks_cta_block" ADD CONSTRAINT "site_pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_teaser_image_id_media_id_fk" FOREIGN KEY ("teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_pages_texts" ADD CONSTRAINT "site_pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_text_block" ADD CONSTRAINT "_site_pages_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_site_pages_v_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_site_pages_v_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_image_sequence" ADD CONSTRAINT "_site_pages_v_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_quote_block" ADD CONSTRAINT "_site_pages_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_faq_block_items" ADD CONSTRAINT "_site_pages_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_faq_block" ADD CONSTRAINT "_site_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_link_list_links" ADD CONSTRAINT "_site_pages_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_link_list" ADD CONSTRAINT "_site_pages_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v_blocks_cta_block" ADD CONSTRAINT "_site_pages_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_parent_id_site_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_teaser_image_id_media_id_fk" FOREIGN KEY ("version_teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v" ADD CONSTRAINT "_site_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_pages_v_texts" ADD CONSTRAINT "_site_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_audience" ADD CONSTRAINT "service_pages_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_proof_points" ADD CONSTRAINT "service_pages_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_faq" ADD CONSTRAINT "service_pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_text_block" ADD CONSTRAINT "service_pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_image_sequence_items" ADD CONSTRAINT "service_pages_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_image_sequence_items" ADD CONSTRAINT "service_pages_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_image_sequence" ADD CONSTRAINT "service_pages_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_quote_block" ADD CONSTRAINT "service_pages_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_faq_block_items" ADD CONSTRAINT "service_pages_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_faq_block" ADD CONSTRAINT "service_pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_link_list_links" ADD CONSTRAINT "service_pages_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_link_list" ADD CONSTRAINT "service_pages_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_blocks_cta_block" ADD CONSTRAINT "service_pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_related_pages" ADD CONSTRAINT "service_pages_related_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_teaser_image_id_media_id_fk" FOREIGN KEY ("teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_texts" ADD CONSTRAINT "service_pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_audience" ADD CONSTRAINT "_service_pages_v_version_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_proof_points" ADD CONSTRAINT "_service_pages_v_version_proof_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_faq" ADD CONSTRAINT "_service_pages_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_text_block" ADD CONSTRAINT "_service_pages_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_service_pages_v_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_service_pages_v_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_image_sequence" ADD CONSTRAINT "_service_pages_v_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_quote_block" ADD CONSTRAINT "_service_pages_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_faq_block_items" ADD CONSTRAINT "_service_pages_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_faq_block" ADD CONSTRAINT "_service_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_link_list_links" ADD CONSTRAINT "_service_pages_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_link_list" ADD CONSTRAINT "_service_pages_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_blocks_cta_block" ADD CONSTRAINT "_service_pages_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_related_pages" ADD CONSTRAINT "_service_pages_v_version_related_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_parent_id_service_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_version_teaser_image_id_media_id_fk" FOREIGN KEY ("version_teaser_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v" ADD CONSTRAINT "_service_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_texts" ADD CONSTRAINT "_service_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_gallery" ADD CONSTRAINT "portfolio_projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_gallery" ADD CONSTRAINT "portfolio_projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_text_block" ADD CONSTRAINT "portfolio_projects_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_image_sequence_items" ADD CONSTRAINT "portfolio_projects_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_image_sequence_items" ADD CONSTRAINT "portfolio_projects_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_image_sequence" ADD CONSTRAINT "portfolio_projects_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_quote_block" ADD CONSTRAINT "portfolio_projects_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_faq_block_items" ADD CONSTRAINT "portfolio_projects_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_faq_block" ADD CONSTRAINT "portfolio_projects_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_link_list_links" ADD CONSTRAINT "portfolio_projects_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_link_list" ADD CONSTRAINT "portfolio_projects_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_blocks_cta_block" ADD CONSTRAINT "portfolio_projects_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_category_id_portfolio_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_projects_texts" ADD CONSTRAINT "portfolio_projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_projects_rels" ADD CONSTRAINT "portfolio_projects_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_version_gallery" ADD CONSTRAINT "_portfolio_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_version_gallery" ADD CONSTRAINT "_portfolio_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_text_block" ADD CONSTRAINT "_portfolio_projects_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_image_sequence_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_image_sequence_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_image_sequence" ADD CONSTRAINT "_portfolio_projects_v_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_quote_block" ADD CONSTRAINT "_portfolio_projects_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_faq_block_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_faq_block" ADD CONSTRAINT "_portfolio_projects_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_link_list_links" ADD CONSTRAINT "_portfolio_projects_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_link_list" ADD CONSTRAINT "_portfolio_projects_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_blocks_cta_block" ADD CONSTRAINT "_portfolio_projects_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_parent_id_portfolio_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_category_id_portfolio_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_texts" ADD CONSTRAINT "_portfolio_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_rels" ADD CONSTRAINT "_portfolio_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_projects_v_rels" ADD CONSTRAINT "_portfolio_projects_v_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio_categories" ADD CONSTRAINT "portfolio_categories_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_categories" ADD CONSTRAINT "portfolio_categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio_categories_texts" ADD CONSTRAINT "portfolio_categories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_portfolio_categories_v" ADD CONSTRAINT "_portfolio_categories_v_parent_id_portfolio_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_categories_v" ADD CONSTRAINT "_portfolio_categories_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_categories_v" ADD CONSTRAINT "_portfolio_categories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_portfolio_categories_v_texts" ADD CONSTRAINT "_portfolio_categories_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_portfolio_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_related_pages" ADD CONSTRAINT "journal_posts_related_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_text_block" ADD CONSTRAINT "journal_posts_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_image_sequence_items" ADD CONSTRAINT "journal_posts_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_image_sequence_items" ADD CONSTRAINT "journal_posts_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_image_sequence" ADD CONSTRAINT "journal_posts_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_quote_block" ADD CONSTRAINT "journal_posts_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_faq_block_items" ADD CONSTRAINT "journal_posts_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_faq_block" ADD CONSTRAINT "journal_posts_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_link_list_links" ADD CONSTRAINT "journal_posts_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_link_list" ADD CONSTRAINT "journal_posts_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts_blocks_cta_block" ADD CONSTRAINT "journal_posts_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts_texts" ADD CONSTRAINT "journal_posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_version_related_pages" ADD CONSTRAINT "_journal_posts_v_version_related_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_text_block" ADD CONSTRAINT "_journal_posts_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_image_sequence_items" ADD CONSTRAINT "_journal_posts_v_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_image_sequence_items" ADD CONSTRAINT "_journal_posts_v_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_image_sequence" ADD CONSTRAINT "_journal_posts_v_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_quote_block" ADD CONSTRAINT "_journal_posts_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_faq_block_items" ADD CONSTRAINT "_journal_posts_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_faq_block" ADD CONSTRAINT "_journal_posts_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_link_list_links" ADD CONSTRAINT "_journal_posts_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_link_list" ADD CONSTRAINT "_journal_posts_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_blocks_cta_block" ADD CONSTRAINT "_journal_posts_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_parent_id_journal_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_texts" ADD CONSTRAINT "_journal_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_local_proof" ADD CONSTRAINT "local_seo_pages_local_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_local_faq" ADD CONSTRAINT "local_seo_pages_local_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_text_block" ADD CONSTRAINT "local_seo_pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_image_sequence_items" ADD CONSTRAINT "local_seo_pages_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_image_sequence_items" ADD CONSTRAINT "local_seo_pages_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_image_sequence" ADD CONSTRAINT "local_seo_pages_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_quote_block" ADD CONSTRAINT "local_seo_pages_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_faq_block_items" ADD CONSTRAINT "local_seo_pages_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_faq_block" ADD CONSTRAINT "local_seo_pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_link_list_links" ADD CONSTRAINT "local_seo_pages_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_link_list" ADD CONSTRAINT "local_seo_pages_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages_blocks_cta_block" ADD CONSTRAINT "local_seo_pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_seo_pages" ADD CONSTRAINT "local_seo_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_seo_pages" ADD CONSTRAINT "local_seo_pages_canonical_service_page_id_service_pages_id_fk" FOREIGN KEY ("canonical_service_page_id") REFERENCES "public"."service_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_seo_pages" ADD CONSTRAINT "local_seo_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_seo_pages_texts" ADD CONSTRAINT "local_seo_pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_version_local_proof" ADD CONSTRAINT "_local_seo_pages_v_version_local_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_version_local_faq" ADD CONSTRAINT "_local_seo_pages_v_version_local_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_text_block" ADD CONSTRAINT "_local_seo_pages_v_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_local_seo_pages_v_blocks_image_sequence_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_image_sequence_items" ADD CONSTRAINT "_local_seo_pages_v_blocks_image_sequence_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v_blocks_image_sequence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_image_sequence" ADD CONSTRAINT "_local_seo_pages_v_blocks_image_sequence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_quote_block" ADD CONSTRAINT "_local_seo_pages_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_faq_block_items" ADD CONSTRAINT "_local_seo_pages_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_faq_block" ADD CONSTRAINT "_local_seo_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_link_list_links" ADD CONSTRAINT "_local_seo_pages_v_blocks_link_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v_blocks_link_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_link_list" ADD CONSTRAINT "_local_seo_pages_v_blocks_link_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_blocks_cta_block" ADD CONSTRAINT "_local_seo_pages_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v" ADD CONSTRAINT "_local_seo_pages_v_parent_id_local_seo_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v" ADD CONSTRAINT "_local_seo_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v" ADD CONSTRAINT "_local_seo_pages_v_version_canonical_service_page_id_service_pages_id_fk" FOREIGN KEY ("version_canonical_service_page_id") REFERENCES "public"."service_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v" ADD CONSTRAINT "_local_seo_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_seo_pages_v_texts" ADD CONSTRAINT "_local_seo_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_seo_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_image_type" ADD CONSTRAINT "media_image_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_visual_tone" ADD CONSTRAINT "media_visual_tone_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_usage_purpose" ADD CONSTRAINT "media_usage_purpose_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_texts" ADD CONSTRAINT "media_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_pages_fk" FOREIGN KEY ("site_pages_id") REFERENCES "public"."site_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_categories_fk" FOREIGN KEY ("portfolio_categories_id") REFERENCES "public"."portfolio_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_local_seo_pages_fk" FOREIGN KEY ("local_seo_pages_id") REFERENCES "public"."local_seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary" ADD CONSTRAINT "navigation_primary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_photography_links" ADD CONSTRAINT "navigation_photography_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legal_links" ADD CONSTRAINT "navigation_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_primary_links" ADD CONSTRAINT "footer_primary_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links" ADD CONSTRAINT "footer_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_pages_blocks_text_block_order_idx" ON "site_pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_text_block_parent_id_idx" ON "site_pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_text_block_path_idx" ON "site_pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "site_pages_blocks_image_sequence_items_order_idx" ON "site_pages_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_image_sequence_items_parent_id_idx" ON "site_pages_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_image_sequence_items_image_idx" ON "site_pages_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "site_pages_blocks_image_sequence_order_idx" ON "site_pages_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_image_sequence_parent_id_idx" ON "site_pages_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_image_sequence_path_idx" ON "site_pages_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "site_pages_blocks_quote_block_order_idx" ON "site_pages_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_quote_block_parent_id_idx" ON "site_pages_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_quote_block_path_idx" ON "site_pages_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "site_pages_blocks_faq_block_items_order_idx" ON "site_pages_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_faq_block_items_parent_id_idx" ON "site_pages_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_faq_block_order_idx" ON "site_pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_faq_block_parent_id_idx" ON "site_pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_faq_block_path_idx" ON "site_pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "site_pages_blocks_link_list_links_order_idx" ON "site_pages_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_link_list_links_parent_id_idx" ON "site_pages_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_link_list_order_idx" ON "site_pages_blocks_link_list" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_link_list_parent_id_idx" ON "site_pages_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_link_list_path_idx" ON "site_pages_blocks_link_list" USING btree ("_path");
  CREATE INDEX "site_pages_blocks_cta_block_order_idx" ON "site_pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "site_pages_blocks_cta_block_parent_id_idx" ON "site_pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "site_pages_blocks_cta_block_path_idx" ON "site_pages_blocks_cta_block" USING btree ("_path");
  CREATE UNIQUE INDEX "site_pages_slug_idx" ON "site_pages" USING btree ("slug");
  CREATE INDEX "site_pages_hero_image_idx" ON "site_pages" USING btree ("hero_image_id");
  CREATE INDEX "site_pages_teaser_image_idx" ON "site_pages" USING btree ("teaser_image_id");
  CREATE INDEX "site_pages_seo_seo_og_image_idx" ON "site_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "site_pages_updated_at_idx" ON "site_pages" USING btree ("updated_at");
  CREATE INDEX "site_pages_created_at_idx" ON "site_pages" USING btree ("created_at");
  CREATE INDEX "site_pages__status_idx" ON "site_pages" USING btree ("_status");
  CREATE INDEX "site_pages_texts_order_parent" ON "site_pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_site_pages_v_blocks_text_block_order_idx" ON "_site_pages_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_text_block_parent_id_idx" ON "_site_pages_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_text_block_path_idx" ON "_site_pages_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_items_order_idx" ON "_site_pages_v_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_items_parent_id_idx" ON "_site_pages_v_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_items_image_idx" ON "_site_pages_v_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_order_idx" ON "_site_pages_v_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_parent_id_idx" ON "_site_pages_v_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_image_sequence_path_idx" ON "_site_pages_v_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "_site_pages_v_blocks_quote_block_order_idx" ON "_site_pages_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_quote_block_parent_id_idx" ON "_site_pages_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_quote_block_path_idx" ON "_site_pages_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_site_pages_v_blocks_faq_block_items_order_idx" ON "_site_pages_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_faq_block_items_parent_id_idx" ON "_site_pages_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_faq_block_order_idx" ON "_site_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_faq_block_parent_id_idx" ON "_site_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_faq_block_path_idx" ON "_site_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_site_pages_v_blocks_link_list_links_order_idx" ON "_site_pages_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_link_list_links_parent_id_idx" ON "_site_pages_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_link_list_order_idx" ON "_site_pages_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_link_list_parent_id_idx" ON "_site_pages_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_link_list_path_idx" ON "_site_pages_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_site_pages_v_blocks_cta_block_order_idx" ON "_site_pages_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_site_pages_v_blocks_cta_block_parent_id_idx" ON "_site_pages_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_site_pages_v_blocks_cta_block_path_idx" ON "_site_pages_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_site_pages_v_parent_idx" ON "_site_pages_v" USING btree ("parent_id");
  CREATE INDEX "_site_pages_v_version_version_slug_idx" ON "_site_pages_v" USING btree ("version_slug");
  CREATE INDEX "_site_pages_v_version_version_hero_image_idx" ON "_site_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_site_pages_v_version_version_teaser_image_idx" ON "_site_pages_v" USING btree ("version_teaser_image_id");
  CREATE INDEX "_site_pages_v_version_seo_version_seo_og_image_idx" ON "_site_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_site_pages_v_version_version_updated_at_idx" ON "_site_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_pages_v_version_version_created_at_idx" ON "_site_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_site_pages_v_version_version__status_idx" ON "_site_pages_v" USING btree ("version__status");
  CREATE INDEX "_site_pages_v_created_at_idx" ON "_site_pages_v" USING btree ("created_at");
  CREATE INDEX "_site_pages_v_updated_at_idx" ON "_site_pages_v" USING btree ("updated_at");
  CREATE INDEX "_site_pages_v_latest_idx" ON "_site_pages_v" USING btree ("latest");
  CREATE INDEX "_site_pages_v_autosave_idx" ON "_site_pages_v" USING btree ("autosave");
  CREATE INDEX "_site_pages_v_texts_order_parent" ON "_site_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "service_pages_audience_order_idx" ON "service_pages_audience" USING btree ("_order");
  CREATE INDEX "service_pages_audience_parent_id_idx" ON "service_pages_audience" USING btree ("_parent_id");
  CREATE INDEX "service_pages_proof_points_order_idx" ON "service_pages_proof_points" USING btree ("_order");
  CREATE INDEX "service_pages_proof_points_parent_id_idx" ON "service_pages_proof_points" USING btree ("_parent_id");
  CREATE INDEX "service_pages_faq_order_idx" ON "service_pages_faq" USING btree ("_order");
  CREATE INDEX "service_pages_faq_parent_id_idx" ON "service_pages_faq" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_text_block_order_idx" ON "service_pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_text_block_parent_id_idx" ON "service_pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_text_block_path_idx" ON "service_pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "service_pages_blocks_image_sequence_items_order_idx" ON "service_pages_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_image_sequence_items_parent_id_idx" ON "service_pages_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_image_sequence_items_image_idx" ON "service_pages_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "service_pages_blocks_image_sequence_order_idx" ON "service_pages_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_image_sequence_parent_id_idx" ON "service_pages_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_image_sequence_path_idx" ON "service_pages_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "service_pages_blocks_quote_block_order_idx" ON "service_pages_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_quote_block_parent_id_idx" ON "service_pages_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_quote_block_path_idx" ON "service_pages_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "service_pages_blocks_faq_block_items_order_idx" ON "service_pages_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_faq_block_items_parent_id_idx" ON "service_pages_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_faq_block_order_idx" ON "service_pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_faq_block_parent_id_idx" ON "service_pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_faq_block_path_idx" ON "service_pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "service_pages_blocks_link_list_links_order_idx" ON "service_pages_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_link_list_links_parent_id_idx" ON "service_pages_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_link_list_order_idx" ON "service_pages_blocks_link_list" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_link_list_parent_id_idx" ON "service_pages_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_link_list_path_idx" ON "service_pages_blocks_link_list" USING btree ("_path");
  CREATE INDEX "service_pages_blocks_cta_block_order_idx" ON "service_pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "service_pages_blocks_cta_block_parent_id_idx" ON "service_pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "service_pages_blocks_cta_block_path_idx" ON "service_pages_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "service_pages_related_pages_order_idx" ON "service_pages_related_pages" USING btree ("_order");
  CREATE INDEX "service_pages_related_pages_parent_id_idx" ON "service_pages_related_pages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_pages_slug_idx" ON "service_pages" USING btree ("slug");
  CREATE INDEX "service_pages_hero_image_idx" ON "service_pages" USING btree ("hero_image_id");
  CREATE INDEX "service_pages_teaser_image_idx" ON "service_pages" USING btree ("teaser_image_id");
  CREATE INDEX "service_pages_seo_seo_og_image_idx" ON "service_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "service_pages_updated_at_idx" ON "service_pages" USING btree ("updated_at");
  CREATE INDEX "service_pages_created_at_idx" ON "service_pages" USING btree ("created_at");
  CREATE INDEX "service_pages__status_idx" ON "service_pages" USING btree ("_status");
  CREATE INDEX "service_pages_texts_order_parent" ON "service_pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_service_pages_v_version_audience_order_idx" ON "_service_pages_v_version_audience" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_audience_parent_id_idx" ON "_service_pages_v_version_audience" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_proof_points_order_idx" ON "_service_pages_v_version_proof_points" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_proof_points_parent_id_idx" ON "_service_pages_v_version_proof_points" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_faq_order_idx" ON "_service_pages_v_version_faq" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_faq_parent_id_idx" ON "_service_pages_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_text_block_order_idx" ON "_service_pages_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_text_block_parent_id_idx" ON "_service_pages_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_text_block_path_idx" ON "_service_pages_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_items_order_idx" ON "_service_pages_v_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_items_parent_id_idx" ON "_service_pages_v_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_items_image_idx" ON "_service_pages_v_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_order_idx" ON "_service_pages_v_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_parent_id_idx" ON "_service_pages_v_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_image_sequence_path_idx" ON "_service_pages_v_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "_service_pages_v_blocks_quote_block_order_idx" ON "_service_pages_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_quote_block_parent_id_idx" ON "_service_pages_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_quote_block_path_idx" ON "_service_pages_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_service_pages_v_blocks_faq_block_items_order_idx" ON "_service_pages_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_faq_block_items_parent_id_idx" ON "_service_pages_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_faq_block_order_idx" ON "_service_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_faq_block_parent_id_idx" ON "_service_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_faq_block_path_idx" ON "_service_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_service_pages_v_blocks_link_list_links_order_idx" ON "_service_pages_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_link_list_links_parent_id_idx" ON "_service_pages_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_link_list_order_idx" ON "_service_pages_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_link_list_parent_id_idx" ON "_service_pages_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_link_list_path_idx" ON "_service_pages_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_service_pages_v_blocks_cta_block_order_idx" ON "_service_pages_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_service_pages_v_blocks_cta_block_parent_id_idx" ON "_service_pages_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_blocks_cta_block_path_idx" ON "_service_pages_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_service_pages_v_version_related_pages_order_idx" ON "_service_pages_v_version_related_pages" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_related_pages_parent_id_idx" ON "_service_pages_v_version_related_pages" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_parent_idx" ON "_service_pages_v" USING btree ("parent_id");
  CREATE INDEX "_service_pages_v_version_version_slug_idx" ON "_service_pages_v" USING btree ("version_slug");
  CREATE INDEX "_service_pages_v_version_version_hero_image_idx" ON "_service_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_service_pages_v_version_version_teaser_image_idx" ON "_service_pages_v" USING btree ("version_teaser_image_id");
  CREATE INDEX "_service_pages_v_version_seo_version_seo_og_image_idx" ON "_service_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_service_pages_v_version_version_updated_at_idx" ON "_service_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_pages_v_version_version_created_at_idx" ON "_service_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_service_pages_v_version_version__status_idx" ON "_service_pages_v" USING btree ("version__status");
  CREATE INDEX "_service_pages_v_created_at_idx" ON "_service_pages_v" USING btree ("created_at");
  CREATE INDEX "_service_pages_v_updated_at_idx" ON "_service_pages_v" USING btree ("updated_at");
  CREATE INDEX "_service_pages_v_latest_idx" ON "_service_pages_v" USING btree ("latest");
  CREATE INDEX "_service_pages_v_autosave_idx" ON "_service_pages_v" USING btree ("autosave");
  CREATE INDEX "_service_pages_v_texts_order_parent" ON "_service_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_projects_gallery_order_idx" ON "portfolio_projects_gallery" USING btree ("_order");
  CREATE INDEX "portfolio_projects_gallery_parent_id_idx" ON "portfolio_projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_gallery_image_idx" ON "portfolio_projects_gallery" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_blocks_text_block_order_idx" ON "portfolio_projects_blocks_text_block" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_text_block_parent_id_idx" ON "portfolio_projects_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_text_block_path_idx" ON "portfolio_projects_blocks_text_block" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_items_order_idx" ON "portfolio_projects_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_items_parent_id_idx" ON "portfolio_projects_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_items_image_idx" ON "portfolio_projects_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_order_idx" ON "portfolio_projects_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_parent_id_idx" ON "portfolio_projects_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_image_sequence_path_idx" ON "portfolio_projects_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_quote_block_order_idx" ON "portfolio_projects_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_quote_block_parent_id_idx" ON "portfolio_projects_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_quote_block_path_idx" ON "portfolio_projects_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_faq_block_items_order_idx" ON "portfolio_projects_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_faq_block_items_parent_id_idx" ON "portfolio_projects_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_faq_block_order_idx" ON "portfolio_projects_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_faq_block_parent_id_idx" ON "portfolio_projects_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_faq_block_path_idx" ON "portfolio_projects_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_link_list_links_order_idx" ON "portfolio_projects_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_link_list_links_parent_id_idx" ON "portfolio_projects_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_link_list_order_idx" ON "portfolio_projects_blocks_link_list" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_link_list_parent_id_idx" ON "portfolio_projects_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_link_list_path_idx" ON "portfolio_projects_blocks_link_list" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_cta_block_order_idx" ON "portfolio_projects_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_cta_block_parent_id_idx" ON "portfolio_projects_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_cta_block_path_idx" ON "portfolio_projects_blocks_cta_block" USING btree ("_path");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_category_idx" ON "portfolio_projects" USING btree ("category_id");
  CREATE INDEX "portfolio_projects_cover_image_idx" ON "portfolio_projects" USING btree ("cover_image_id");
  CREATE INDEX "portfolio_projects_seo_seo_og_image_idx" ON "portfolio_projects" USING btree ("seo_og_image_id");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects__status_idx" ON "portfolio_projects" USING btree ("_status");
  CREATE INDEX "portfolio_projects_texts_order_parent" ON "portfolio_projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_projects_rels_order_idx" ON "portfolio_projects_rels" USING btree ("order");
  CREATE INDEX "portfolio_projects_rels_parent_idx" ON "portfolio_projects_rels" USING btree ("parent_id");
  CREATE INDEX "portfolio_projects_rels_path_idx" ON "portfolio_projects_rels" USING btree ("path");
  CREATE INDEX "portfolio_projects_rels_service_pages_id_idx" ON "portfolio_projects_rels" USING btree ("service_pages_id");
  CREATE INDEX "_portfolio_projects_v_version_gallery_order_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_version_gallery_parent_id_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_version_gallery_image_idx" ON "_portfolio_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_text_block_order_idx" ON "_portfolio_projects_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_text_block_parent_id_idx" ON "_portfolio_projects_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_text_block_path_idx" ON "_portfolio_projects_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_items_order_idx" ON "_portfolio_projects_v_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_items_parent_id_idx" ON "_portfolio_projects_v_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_items_image_idx" ON "_portfolio_projects_v_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_order_idx" ON "_portfolio_projects_v_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_parent_id_idx" ON "_portfolio_projects_v_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_image_sequence_path_idx" ON "_portfolio_projects_v_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_quote_block_order_idx" ON "_portfolio_projects_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_quote_block_parent_id_idx" ON "_portfolio_projects_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_quote_block_path_idx" ON "_portfolio_projects_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_faq_block_items_order_idx" ON "_portfolio_projects_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_faq_block_items_parent_id_idx" ON "_portfolio_projects_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_faq_block_order_idx" ON "_portfolio_projects_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_faq_block_parent_id_idx" ON "_portfolio_projects_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_faq_block_path_idx" ON "_portfolio_projects_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_link_list_links_order_idx" ON "_portfolio_projects_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_link_list_links_parent_id_idx" ON "_portfolio_projects_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_link_list_order_idx" ON "_portfolio_projects_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_link_list_parent_id_idx" ON "_portfolio_projects_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_link_list_path_idx" ON "_portfolio_projects_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_cta_block_order_idx" ON "_portfolio_projects_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_cta_block_parent_id_idx" ON "_portfolio_projects_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_cta_block_path_idx" ON "_portfolio_projects_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_parent_idx" ON "_portfolio_projects_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_version_version_slug_idx" ON "_portfolio_projects_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_projects_v_version_version_category_idx" ON "_portfolio_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_portfolio_projects_v_version_version_cover_image_idx" ON "_portfolio_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_portfolio_projects_v_version_seo_version_seo_og_image_idx" ON "_portfolio_projects_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_portfolio_projects_v_version_version_updated_at_idx" ON "_portfolio_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_projects_v_version_version_created_at_idx" ON "_portfolio_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_projects_v_version_version__status_idx" ON "_portfolio_projects_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_projects_v_created_at_idx" ON "_portfolio_projects_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_projects_v_updated_at_idx" ON "_portfolio_projects_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_projects_v_latest_idx" ON "_portfolio_projects_v" USING btree ("latest");
  CREATE INDEX "_portfolio_projects_v_autosave_idx" ON "_portfolio_projects_v" USING btree ("autosave");
  CREATE INDEX "_portfolio_projects_v_texts_order_parent" ON "_portfolio_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_projects_v_rels_order_idx" ON "_portfolio_projects_v_rels" USING btree ("order");
  CREATE INDEX "_portfolio_projects_v_rels_parent_idx" ON "_portfolio_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_rels_path_idx" ON "_portfolio_projects_v_rels" USING btree ("path");
  CREATE INDEX "_portfolio_projects_v_rels_service_pages_id_idx" ON "_portfolio_projects_v_rels" USING btree ("service_pages_id");
  CREATE UNIQUE INDEX "portfolio_categories_slug_idx" ON "portfolio_categories" USING btree ("slug");
  CREATE INDEX "portfolio_categories_cover_image_idx" ON "portfolio_categories" USING btree ("cover_image_id");
  CREATE INDEX "portfolio_categories_seo_seo_og_image_idx" ON "portfolio_categories" USING btree ("seo_og_image_id");
  CREATE INDEX "portfolio_categories_updated_at_idx" ON "portfolio_categories" USING btree ("updated_at");
  CREATE INDEX "portfolio_categories_created_at_idx" ON "portfolio_categories" USING btree ("created_at");
  CREATE INDEX "portfolio_categories__status_idx" ON "portfolio_categories" USING btree ("_status");
  CREATE INDEX "portfolio_categories_texts_order_parent" ON "portfolio_categories_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_categories_v_parent_idx" ON "_portfolio_categories_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_categories_v_version_version_slug_idx" ON "_portfolio_categories_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_categories_v_version_version_cover_image_idx" ON "_portfolio_categories_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_portfolio_categories_v_version_seo_version_seo_og_image_idx" ON "_portfolio_categories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_portfolio_categories_v_version_version_updated_at_idx" ON "_portfolio_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_categories_v_version_version_created_at_idx" ON "_portfolio_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_categories_v_version_version__status_idx" ON "_portfolio_categories_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_categories_v_created_at_idx" ON "_portfolio_categories_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_categories_v_updated_at_idx" ON "_portfolio_categories_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_categories_v_latest_idx" ON "_portfolio_categories_v" USING btree ("latest");
  CREATE INDEX "_portfolio_categories_v_texts_order_parent" ON "_portfolio_categories_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "journal_posts_related_pages_order_idx" ON "journal_posts_related_pages" USING btree ("_order");
  CREATE INDEX "journal_posts_related_pages_parent_id_idx" ON "journal_posts_related_pages" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_text_block_order_idx" ON "journal_posts_blocks_text_block" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_text_block_parent_id_idx" ON "journal_posts_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_text_block_path_idx" ON "journal_posts_blocks_text_block" USING btree ("_path");
  CREATE INDEX "journal_posts_blocks_image_sequence_items_order_idx" ON "journal_posts_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_image_sequence_items_parent_id_idx" ON "journal_posts_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_image_sequence_items_image_idx" ON "journal_posts_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "journal_posts_blocks_image_sequence_order_idx" ON "journal_posts_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_image_sequence_parent_id_idx" ON "journal_posts_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_image_sequence_path_idx" ON "journal_posts_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "journal_posts_blocks_quote_block_order_idx" ON "journal_posts_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_quote_block_parent_id_idx" ON "journal_posts_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_quote_block_path_idx" ON "journal_posts_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "journal_posts_blocks_faq_block_items_order_idx" ON "journal_posts_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_faq_block_items_parent_id_idx" ON "journal_posts_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_faq_block_order_idx" ON "journal_posts_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_faq_block_parent_id_idx" ON "journal_posts_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_faq_block_path_idx" ON "journal_posts_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "journal_posts_blocks_link_list_links_order_idx" ON "journal_posts_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_link_list_links_parent_id_idx" ON "journal_posts_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_link_list_order_idx" ON "journal_posts_blocks_link_list" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_link_list_parent_id_idx" ON "journal_posts_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_link_list_path_idx" ON "journal_posts_blocks_link_list" USING btree ("_path");
  CREATE INDEX "journal_posts_blocks_cta_block_order_idx" ON "journal_posts_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "journal_posts_blocks_cta_block_parent_id_idx" ON "journal_posts_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "journal_posts_blocks_cta_block_path_idx" ON "journal_posts_blocks_cta_block" USING btree ("_path");
  CREATE UNIQUE INDEX "journal_posts_slug_idx" ON "journal_posts" USING btree ("slug");
  CREATE INDEX "journal_posts_cover_image_idx" ON "journal_posts" USING btree ("cover_image_id");
  CREATE INDEX "journal_posts_seo_seo_og_image_idx" ON "journal_posts" USING btree ("seo_og_image_id");
  CREATE INDEX "journal_posts_updated_at_idx" ON "journal_posts" USING btree ("updated_at");
  CREATE INDEX "journal_posts_created_at_idx" ON "journal_posts" USING btree ("created_at");
  CREATE INDEX "journal_posts__status_idx" ON "journal_posts" USING btree ("_status");
  CREATE INDEX "journal_posts_texts_order_parent" ON "journal_posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_journal_posts_v_version_related_pages_order_idx" ON "_journal_posts_v_version_related_pages" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_version_related_pages_parent_id_idx" ON "_journal_posts_v_version_related_pages" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_text_block_order_idx" ON "_journal_posts_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_text_block_parent_id_idx" ON "_journal_posts_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_text_block_path_idx" ON "_journal_posts_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_items_order_idx" ON "_journal_posts_v_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_items_parent_id_idx" ON "_journal_posts_v_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_items_image_idx" ON "_journal_posts_v_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_order_idx" ON "_journal_posts_v_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_parent_id_idx" ON "_journal_posts_v_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_image_sequence_path_idx" ON "_journal_posts_v_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_blocks_quote_block_order_idx" ON "_journal_posts_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_quote_block_parent_id_idx" ON "_journal_posts_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_quote_block_path_idx" ON "_journal_posts_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_blocks_faq_block_items_order_idx" ON "_journal_posts_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_faq_block_items_parent_id_idx" ON "_journal_posts_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_faq_block_order_idx" ON "_journal_posts_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_faq_block_parent_id_idx" ON "_journal_posts_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_faq_block_path_idx" ON "_journal_posts_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_blocks_link_list_links_order_idx" ON "_journal_posts_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_link_list_links_parent_id_idx" ON "_journal_posts_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_link_list_order_idx" ON "_journal_posts_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_link_list_parent_id_idx" ON "_journal_posts_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_link_list_path_idx" ON "_journal_posts_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_blocks_cta_block_order_idx" ON "_journal_posts_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_journal_posts_v_blocks_cta_block_parent_id_idx" ON "_journal_posts_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_journal_posts_v_blocks_cta_block_path_idx" ON "_journal_posts_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_journal_posts_v_parent_idx" ON "_journal_posts_v" USING btree ("parent_id");
  CREATE INDEX "_journal_posts_v_version_version_slug_idx" ON "_journal_posts_v" USING btree ("version_slug");
  CREATE INDEX "_journal_posts_v_version_version_cover_image_idx" ON "_journal_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_journal_posts_v_version_seo_version_seo_og_image_idx" ON "_journal_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_journal_posts_v_version_version_updated_at_idx" ON "_journal_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_posts_v_version_version_created_at_idx" ON "_journal_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_posts_v_version_version__status_idx" ON "_journal_posts_v" USING btree ("version__status");
  CREATE INDEX "_journal_posts_v_created_at_idx" ON "_journal_posts_v" USING btree ("created_at");
  CREATE INDEX "_journal_posts_v_updated_at_idx" ON "_journal_posts_v" USING btree ("updated_at");
  CREATE INDEX "_journal_posts_v_latest_idx" ON "_journal_posts_v" USING btree ("latest");
  CREATE INDEX "_journal_posts_v_autosave_idx" ON "_journal_posts_v" USING btree ("autosave");
  CREATE INDEX "_journal_posts_v_texts_order_parent" ON "_journal_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "local_seo_pages_local_proof_order_idx" ON "local_seo_pages_local_proof" USING btree ("_order");
  CREATE INDEX "local_seo_pages_local_proof_parent_id_idx" ON "local_seo_pages_local_proof" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_local_faq_order_idx" ON "local_seo_pages_local_faq" USING btree ("_order");
  CREATE INDEX "local_seo_pages_local_faq_parent_id_idx" ON "local_seo_pages_local_faq" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_text_block_order_idx" ON "local_seo_pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_text_block_parent_id_idx" ON "local_seo_pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_text_block_path_idx" ON "local_seo_pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_items_order_idx" ON "local_seo_pages_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_items_parent_id_idx" ON "local_seo_pages_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_items_image_idx" ON "local_seo_pages_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_order_idx" ON "local_seo_pages_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_parent_id_idx" ON "local_seo_pages_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_image_sequence_path_idx" ON "local_seo_pages_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "local_seo_pages_blocks_quote_block_order_idx" ON "local_seo_pages_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_quote_block_parent_id_idx" ON "local_seo_pages_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_quote_block_path_idx" ON "local_seo_pages_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "local_seo_pages_blocks_faq_block_items_order_idx" ON "local_seo_pages_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_faq_block_items_parent_id_idx" ON "local_seo_pages_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_faq_block_order_idx" ON "local_seo_pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_faq_block_parent_id_idx" ON "local_seo_pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_faq_block_path_idx" ON "local_seo_pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "local_seo_pages_blocks_link_list_links_order_idx" ON "local_seo_pages_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_link_list_links_parent_id_idx" ON "local_seo_pages_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_link_list_order_idx" ON "local_seo_pages_blocks_link_list" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_link_list_parent_id_idx" ON "local_seo_pages_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_link_list_path_idx" ON "local_seo_pages_blocks_link_list" USING btree ("_path");
  CREATE INDEX "local_seo_pages_blocks_cta_block_order_idx" ON "local_seo_pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "local_seo_pages_blocks_cta_block_parent_id_idx" ON "local_seo_pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "local_seo_pages_blocks_cta_block_path_idx" ON "local_seo_pages_blocks_cta_block" USING btree ("_path");
  CREATE UNIQUE INDEX "local_seo_pages_slug_idx" ON "local_seo_pages" USING btree ("slug");
  CREATE INDEX "local_seo_pages_hero_image_idx" ON "local_seo_pages" USING btree ("hero_image_id");
  CREATE INDEX "local_seo_pages_canonical_service_page_idx" ON "local_seo_pages" USING btree ("canonical_service_page_id");
  CREATE INDEX "local_seo_pages_seo_seo_og_image_idx" ON "local_seo_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "local_seo_pages_updated_at_idx" ON "local_seo_pages" USING btree ("updated_at");
  CREATE INDEX "local_seo_pages_created_at_idx" ON "local_seo_pages" USING btree ("created_at");
  CREATE INDEX "local_seo_pages__status_idx" ON "local_seo_pages" USING btree ("_status");
  CREATE INDEX "local_seo_pages_texts_order_parent" ON "local_seo_pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_local_seo_pages_v_version_local_proof_order_idx" ON "_local_seo_pages_v_version_local_proof" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_version_local_proof_parent_id_idx" ON "_local_seo_pages_v_version_local_proof" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_version_local_faq_order_idx" ON "_local_seo_pages_v_version_local_faq" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_version_local_faq_parent_id_idx" ON "_local_seo_pages_v_version_local_faq" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_text_block_order_idx" ON "_local_seo_pages_v_blocks_text_block" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_text_block_parent_id_idx" ON "_local_seo_pages_v_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_text_block_path_idx" ON "_local_seo_pages_v_blocks_text_block" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_items_order_idx" ON "_local_seo_pages_v_blocks_image_sequence_items" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_items_parent_id_idx" ON "_local_seo_pages_v_blocks_image_sequence_items" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_items_image_idx" ON "_local_seo_pages_v_blocks_image_sequence_items" USING btree ("image_id");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_order_idx" ON "_local_seo_pages_v_blocks_image_sequence" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_parent_id_idx" ON "_local_seo_pages_v_blocks_image_sequence" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_image_sequence_path_idx" ON "_local_seo_pages_v_blocks_image_sequence" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_blocks_quote_block_order_idx" ON "_local_seo_pages_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_quote_block_parent_id_idx" ON "_local_seo_pages_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_quote_block_path_idx" ON "_local_seo_pages_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_blocks_faq_block_items_order_idx" ON "_local_seo_pages_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_faq_block_items_parent_id_idx" ON "_local_seo_pages_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_faq_block_order_idx" ON "_local_seo_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_faq_block_parent_id_idx" ON "_local_seo_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_faq_block_path_idx" ON "_local_seo_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_blocks_link_list_links_order_idx" ON "_local_seo_pages_v_blocks_link_list_links" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_link_list_links_parent_id_idx" ON "_local_seo_pages_v_blocks_link_list_links" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_link_list_order_idx" ON "_local_seo_pages_v_blocks_link_list" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_link_list_parent_id_idx" ON "_local_seo_pages_v_blocks_link_list" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_link_list_path_idx" ON "_local_seo_pages_v_blocks_link_list" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_blocks_cta_block_order_idx" ON "_local_seo_pages_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "_local_seo_pages_v_blocks_cta_block_parent_id_idx" ON "_local_seo_pages_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "_local_seo_pages_v_blocks_cta_block_path_idx" ON "_local_seo_pages_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "_local_seo_pages_v_parent_idx" ON "_local_seo_pages_v" USING btree ("parent_id");
  CREATE INDEX "_local_seo_pages_v_version_version_slug_idx" ON "_local_seo_pages_v" USING btree ("version_slug");
  CREATE INDEX "_local_seo_pages_v_version_version_hero_image_idx" ON "_local_seo_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_local_seo_pages_v_version_version_canonical_service_pag_idx" ON "_local_seo_pages_v" USING btree ("version_canonical_service_page_id");
  CREATE INDEX "_local_seo_pages_v_version_seo_version_seo_og_image_idx" ON "_local_seo_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_local_seo_pages_v_version_version_updated_at_idx" ON "_local_seo_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_local_seo_pages_v_version_version_created_at_idx" ON "_local_seo_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_local_seo_pages_v_version_version__status_idx" ON "_local_seo_pages_v" USING btree ("version__status");
  CREATE INDEX "_local_seo_pages_v_created_at_idx" ON "_local_seo_pages_v" USING btree ("created_at");
  CREATE INDEX "_local_seo_pages_v_updated_at_idx" ON "_local_seo_pages_v" USING btree ("updated_at");
  CREATE INDEX "_local_seo_pages_v_latest_idx" ON "_local_seo_pages_v" USING btree ("latest");
  CREATE INDEX "_local_seo_pages_v_autosave_idx" ON "_local_seo_pages_v" USING btree ("autosave");
  CREATE INDEX "_local_seo_pages_v_texts_order_parent" ON "_local_seo_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "media_image_type_order_idx" ON "media_image_type" USING btree ("order");
  CREATE INDEX "media_image_type_parent_idx" ON "media_image_type" USING btree ("parent_id");
  CREATE INDEX "media_image_type_value_idx" ON "media_image_type" USING btree ("value");
  CREATE INDEX "media_visual_tone_order_idx" ON "media_visual_tone" USING btree ("order");
  CREATE INDEX "media_visual_tone_parent_idx" ON "media_visual_tone" USING btree ("parent_id");
  CREATE INDEX "media_usage_purpose_order_idx" ON "media_usage_purpose" USING btree ("order");
  CREATE INDEX "media_usage_purpose_parent_idx" ON "media_usage_purpose" USING btree ("parent_id");
  CREATE INDEX "media_category_idx" ON "media" USING btree ("category");
  CREATE INDEX "media_orientation_idx" ON "media" USING btree ("orientation");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_mobile_sizes_mobile_filename_idx" ON "media" USING btree ("sizes_mobile_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_thumb_avif_sizes_thumb_avif_filename_idx" ON "media" USING btree ("sizes_thumb_avif_filename");
  CREATE INDEX "media_sizes_mobile_avif_sizes_mobile_avif_filename_idx" ON "media" USING btree ("sizes_mobile_avif_filename");
  CREATE INDEX "media_sizes_card_avif_sizes_card_avif_filename_idx" ON "media" USING btree ("sizes_card_avif_filename");
  CREATE INDEX "media_sizes_hero_avif_sizes_hero_avif_filename_idx" ON "media" USING btree ("sizes_hero_avif_filename");
  CREATE INDEX "media_sizes_wide_avif_sizes_wide_avif_filename_idx" ON "media" USING btree ("sizes_wide_avif_filename");
  CREATE INDEX "media_texts_order_parent" ON "media_texts" USING btree ("order","parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_site_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("site_pages_id");
  CREATE INDEX "payload_locked_documents_rels_service_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("service_pages_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_categories_id");
  CREATE INDEX "payload_locked_documents_rels_journal_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_posts_id");
  CREATE INDEX "payload_locked_documents_rels_local_seo_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("local_seo_pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "navigation_primary_order_idx" ON "navigation_primary" USING btree ("_order");
  CREATE INDEX "navigation_primary_parent_id_idx" ON "navigation_primary" USING btree ("_parent_id");
  CREATE INDEX "navigation_photography_links_order_idx" ON "navigation_photography_links" USING btree ("_order");
  CREATE INDEX "navigation_photography_links_parent_id_idx" ON "navigation_photography_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_legal_links_order_idx" ON "navigation_legal_links" USING btree ("_order");
  CREATE INDEX "navigation_legal_links_parent_id_idx" ON "navigation_legal_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_primary_links_order_idx" ON "footer_primary_links" USING btree ("_order");
  CREATE INDEX "footer_primary_links_parent_id_idx" ON "footer_primary_links" USING btree ("_parent_id");
  CREATE INDEX "footer_service_links_order_idx" ON "footer_service_links" USING btree ("_order");
  CREATE INDEX "footer_service_links_parent_id_idx" ON "footer_service_links" USING btree ("_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_pages_blocks_text_block" CASCADE;
  DROP TABLE "site_pages_blocks_image_sequence_items" CASCADE;
  DROP TABLE "site_pages_blocks_image_sequence" CASCADE;
  DROP TABLE "site_pages_blocks_quote_block" CASCADE;
  DROP TABLE "site_pages_blocks_faq_block_items" CASCADE;
  DROP TABLE "site_pages_blocks_faq_block" CASCADE;
  DROP TABLE "site_pages_blocks_link_list_links" CASCADE;
  DROP TABLE "site_pages_blocks_link_list" CASCADE;
  DROP TABLE "site_pages_blocks_cta_block" CASCADE;
  DROP TABLE "site_pages" CASCADE;
  DROP TABLE "site_pages_texts" CASCADE;
  DROP TABLE "_site_pages_v_blocks_text_block" CASCADE;
  DROP TABLE "_site_pages_v_blocks_image_sequence_items" CASCADE;
  DROP TABLE "_site_pages_v_blocks_image_sequence" CASCADE;
  DROP TABLE "_site_pages_v_blocks_quote_block" CASCADE;
  DROP TABLE "_site_pages_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_site_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_site_pages_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_site_pages_v_blocks_link_list" CASCADE;
  DROP TABLE "_site_pages_v_blocks_cta_block" CASCADE;
  DROP TABLE "_site_pages_v" CASCADE;
  DROP TABLE "_site_pages_v_texts" CASCADE;
  DROP TABLE "service_pages_audience" CASCADE;
  DROP TABLE "service_pages_proof_points" CASCADE;
  DROP TABLE "service_pages_faq" CASCADE;
  DROP TABLE "service_pages_blocks_text_block" CASCADE;
  DROP TABLE "service_pages_blocks_image_sequence_items" CASCADE;
  DROP TABLE "service_pages_blocks_image_sequence" CASCADE;
  DROP TABLE "service_pages_blocks_quote_block" CASCADE;
  DROP TABLE "service_pages_blocks_faq_block_items" CASCADE;
  DROP TABLE "service_pages_blocks_faq_block" CASCADE;
  DROP TABLE "service_pages_blocks_link_list_links" CASCADE;
  DROP TABLE "service_pages_blocks_link_list" CASCADE;
  DROP TABLE "service_pages_blocks_cta_block" CASCADE;
  DROP TABLE "service_pages_related_pages" CASCADE;
  DROP TABLE "service_pages" CASCADE;
  DROP TABLE "service_pages_texts" CASCADE;
  DROP TABLE "_service_pages_v_version_audience" CASCADE;
  DROP TABLE "_service_pages_v_version_proof_points" CASCADE;
  DROP TABLE "_service_pages_v_version_faq" CASCADE;
  DROP TABLE "_service_pages_v_blocks_text_block" CASCADE;
  DROP TABLE "_service_pages_v_blocks_image_sequence_items" CASCADE;
  DROP TABLE "_service_pages_v_blocks_image_sequence" CASCADE;
  DROP TABLE "_service_pages_v_blocks_quote_block" CASCADE;
  DROP TABLE "_service_pages_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_service_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_service_pages_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_service_pages_v_blocks_link_list" CASCADE;
  DROP TABLE "_service_pages_v_blocks_cta_block" CASCADE;
  DROP TABLE "_service_pages_v_version_related_pages" CASCADE;
  DROP TABLE "_service_pages_v" CASCADE;
  DROP TABLE "_service_pages_v_texts" CASCADE;
  DROP TABLE "portfolio_projects_gallery" CASCADE;
  DROP TABLE "portfolio_projects_blocks_text_block" CASCADE;
  DROP TABLE "portfolio_projects_blocks_image_sequence_items" CASCADE;
  DROP TABLE "portfolio_projects_blocks_image_sequence" CASCADE;
  DROP TABLE "portfolio_projects_blocks_quote_block" CASCADE;
  DROP TABLE "portfolio_projects_blocks_faq_block_items" CASCADE;
  DROP TABLE "portfolio_projects_blocks_faq_block" CASCADE;
  DROP TABLE "portfolio_projects_blocks_link_list_links" CASCADE;
  DROP TABLE "portfolio_projects_blocks_link_list" CASCADE;
  DROP TABLE "portfolio_projects_blocks_cta_block" CASCADE;
  DROP TABLE "portfolio_projects" CASCADE;
  DROP TABLE "portfolio_projects_texts" CASCADE;
  DROP TABLE "portfolio_projects_rels" CASCADE;
  DROP TABLE "_portfolio_projects_v_version_gallery" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_text_block" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_image_sequence_items" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_image_sequence" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_quote_block" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_faq_block" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_link_list" CASCADE;
  DROP TABLE "_portfolio_projects_v_blocks_cta_block" CASCADE;
  DROP TABLE "_portfolio_projects_v" CASCADE;
  DROP TABLE "_portfolio_projects_v_texts" CASCADE;
  DROP TABLE "_portfolio_projects_v_rels" CASCADE;
  DROP TABLE "portfolio_categories" CASCADE;
  DROP TABLE "portfolio_categories_texts" CASCADE;
  DROP TABLE "_portfolio_categories_v" CASCADE;
  DROP TABLE "_portfolio_categories_v_texts" CASCADE;
  DROP TABLE "journal_posts_related_pages" CASCADE;
  DROP TABLE "journal_posts_blocks_text_block" CASCADE;
  DROP TABLE "journal_posts_blocks_image_sequence_items" CASCADE;
  DROP TABLE "journal_posts_blocks_image_sequence" CASCADE;
  DROP TABLE "journal_posts_blocks_quote_block" CASCADE;
  DROP TABLE "journal_posts_blocks_faq_block_items" CASCADE;
  DROP TABLE "journal_posts_blocks_faq_block" CASCADE;
  DROP TABLE "journal_posts_blocks_link_list_links" CASCADE;
  DROP TABLE "journal_posts_blocks_link_list" CASCADE;
  DROP TABLE "journal_posts_blocks_cta_block" CASCADE;
  DROP TABLE "journal_posts" CASCADE;
  DROP TABLE "journal_posts_texts" CASCADE;
  DROP TABLE "_journal_posts_v_version_related_pages" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_text_block" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_image_sequence_items" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_image_sequence" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_quote_block" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_faq_block" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_link_list" CASCADE;
  DROP TABLE "_journal_posts_v_blocks_cta_block" CASCADE;
  DROP TABLE "_journal_posts_v" CASCADE;
  DROP TABLE "_journal_posts_v_texts" CASCADE;
  DROP TABLE "local_seo_pages_local_proof" CASCADE;
  DROP TABLE "local_seo_pages_local_faq" CASCADE;
  DROP TABLE "local_seo_pages_blocks_text_block" CASCADE;
  DROP TABLE "local_seo_pages_blocks_image_sequence_items" CASCADE;
  DROP TABLE "local_seo_pages_blocks_image_sequence" CASCADE;
  DROP TABLE "local_seo_pages_blocks_quote_block" CASCADE;
  DROP TABLE "local_seo_pages_blocks_faq_block_items" CASCADE;
  DROP TABLE "local_seo_pages_blocks_faq_block" CASCADE;
  DROP TABLE "local_seo_pages_blocks_link_list_links" CASCADE;
  DROP TABLE "local_seo_pages_blocks_link_list" CASCADE;
  DROP TABLE "local_seo_pages_blocks_cta_block" CASCADE;
  DROP TABLE "local_seo_pages" CASCADE;
  DROP TABLE "local_seo_pages_texts" CASCADE;
  DROP TABLE "_local_seo_pages_v_version_local_proof" CASCADE;
  DROP TABLE "_local_seo_pages_v_version_local_faq" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_text_block" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_image_sequence_items" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_image_sequence" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_quote_block" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_link_list_links" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_link_list" CASCADE;
  DROP TABLE "_local_seo_pages_v_blocks_cta_block" CASCADE;
  DROP TABLE "_local_seo_pages_v" CASCADE;
  DROP TABLE "_local_seo_pages_v_texts" CASCADE;
  DROP TABLE "media_image_type" CASCADE;
  DROP TABLE "media_visual_tone" CASCADE;
  DROP TABLE "media_usage_purpose" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_texts" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "navigation_primary" CASCADE;
  DROP TABLE "navigation_photography_links" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_legal_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "global_ctas" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_primary_links" CASCADE;
  DROP TABLE "footer_service_links" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."crop";
  DROP TYPE "public"."enum_site_pages_blocks_image_sequence_layout";
  DROP TYPE "public"."enum_site_pages_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum_site_pages_blocks_link_list_links_rel";
  DROP TYPE "public"."enum_site_pages_page_type";
  DROP TYPE "public"."enum_site_pages_seo_search_intent";
  DROP TYPE "public"."enum_site_pages_legacy_migration_status";
  DROP TYPE "public"."enum_site_pages_legacy_render_source";
  DROP TYPE "public"."enum_site_pages_status";
  DROP TYPE "public"."enum__site_pages_v_blocks_image_sequence_layout";
  DROP TYPE "public"."enum__site_pages_v_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum__site_pages_v_blocks_link_list_links_rel";
  DROP TYPE "public"."enum__site_pages_v_version_page_type";
  DROP TYPE "public"."enum__site_pages_v_version_seo_search_intent";
  DROP TYPE "public"."enum__site_pages_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__site_pages_v_version_legacy_render_source";
  DROP TYPE "public"."enum__site_pages_v_version_status";
  DROP TYPE "public"."enum_service_pages_blocks_image_sequence_layout";
  DROP TYPE "public"."enum_service_pages_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum_service_pages_blocks_link_list_links_rel";
  DROP TYPE "public"."enum_service_pages_related_pages_seo_purpose";
  DROP TYPE "public"."enum_service_pages_related_pages_rel";
  DROP TYPE "public"."enum_service_pages_service_type";
  DROP TYPE "public"."enum_service_pages_seo_search_intent";
  DROP TYPE "public"."enum_service_pages_legacy_migration_status";
  DROP TYPE "public"."enum_service_pages_legacy_render_source";
  DROP TYPE "public"."enum_service_pages_status";
  DROP TYPE "public"."enum__service_pages_v_blocks_image_sequence_layout";
  DROP TYPE "public"."enum__service_pages_v_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum__service_pages_v_blocks_link_list_links_rel";
  DROP TYPE "public"."enum__service_pages_v_version_related_pages_seo_purpose";
  DROP TYPE "public"."enum__service_pages_v_version_related_pages_rel";
  DROP TYPE "public"."enum__service_pages_v_version_service_type";
  DROP TYPE "public"."enum__service_pages_v_version_seo_search_intent";
  DROP TYPE "public"."enum__service_pages_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__service_pages_v_version_legacy_render_source";
  DROP TYPE "public"."enum__service_pages_v_version_status";
  DROP TYPE "public"."enum_portfolio_projects_gallery_role";
  DROP TYPE "public"."enum_portfolio_projects_blocks_image_sequence_layout";
  DROP TYPE "public"."enum_portfolio_projects_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum_portfolio_projects_blocks_link_list_links_rel";
  DROP TYPE "public"."enum_portfolio_projects_presentation_mode";
  DROP TYPE "public"."enum_portfolio_projects_seo_search_intent";
  DROP TYPE "public"."enum_portfolio_projects_legacy_migration_status";
  DROP TYPE "public"."enum_portfolio_projects_legacy_render_source";
  DROP TYPE "public"."enum_portfolio_projects_status";
  DROP TYPE "public"."enum__portfolio_projects_v_version_gallery_role";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_image_sequence_layout";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum__portfolio_projects_v_blocks_link_list_links_rel";
  DROP TYPE "public"."enum__portfolio_projects_v_version_presentation_mode";
  DROP TYPE "public"."enum__portfolio_projects_v_version_seo_search_intent";
  DROP TYPE "public"."enum__portfolio_projects_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__portfolio_projects_v_version_legacy_render_source";
  DROP TYPE "public"."enum__portfolio_projects_v_version_status";
  DROP TYPE "public"."enum_portfolio_categories_seo_search_intent";
  DROP TYPE "public"."enum_portfolio_categories_legacy_migration_status";
  DROP TYPE "public"."enum_portfolio_categories_legacy_render_source";
  DROP TYPE "public"."enum_portfolio_categories_status";
  DROP TYPE "public"."enum__portfolio_categories_v_version_seo_search_intent";
  DROP TYPE "public"."enum__portfolio_categories_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__portfolio_categories_v_version_legacy_render_source";
  DROP TYPE "public"."enum__portfolio_categories_v_version_status";
  DROP TYPE "public"."enum_journal_posts_related_pages_seo_purpose";
  DROP TYPE "public"."enum_journal_posts_related_pages_rel";
  DROP TYPE "public"."enum_journal_posts_blocks_image_sequence_layout";
  DROP TYPE "public"."enum_journal_posts_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum_journal_posts_blocks_link_list_links_rel";
  DROP TYPE "public"."enum_journal_posts_category";
  DROP TYPE "public"."enum_journal_posts_seo_search_intent";
  DROP TYPE "public"."enum_journal_posts_legacy_migration_status";
  DROP TYPE "public"."enum_journal_posts_legacy_render_source";
  DROP TYPE "public"."enum_journal_posts_status";
  DROP TYPE "public"."enum__journal_posts_v_version_related_pages_seo_purpose";
  DROP TYPE "public"."enum__journal_posts_v_version_related_pages_rel";
  DROP TYPE "public"."enum__journal_posts_v_blocks_image_sequence_layout";
  DROP TYPE "public"."enum__journal_posts_v_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum__journal_posts_v_blocks_link_list_links_rel";
  DROP TYPE "public"."enum__journal_posts_v_version_category";
  DROP TYPE "public"."enum__journal_posts_v_version_seo_search_intent";
  DROP TYPE "public"."enum__journal_posts_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__journal_posts_v_version_legacy_render_source";
  DROP TYPE "public"."enum__journal_posts_v_version_status";
  DROP TYPE "public"."enum_local_seo_pages_blocks_image_sequence_layout";
  DROP TYPE "public"."enum_local_seo_pages_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum_local_seo_pages_blocks_link_list_links_rel";
  DROP TYPE "public"."enum_local_seo_pages_priority";
  DROP TYPE "public"."enum_local_seo_pages_seo_search_intent";
  DROP TYPE "public"."enum_local_seo_pages_legacy_migration_status";
  DROP TYPE "public"."enum_local_seo_pages_legacy_render_source";
  DROP TYPE "public"."enum_local_seo_pages_status";
  DROP TYPE "public"."enum__local_seo_pages_v_blocks_image_sequence_layout";
  DROP TYPE "public"."enum__local_seo_pages_v_blocks_link_list_links_seo_purpose";
  DROP TYPE "public"."enum__local_seo_pages_v_blocks_link_list_links_rel";
  DROP TYPE "public"."enum__local_seo_pages_v_version_priority";
  DROP TYPE "public"."enum__local_seo_pages_v_version_seo_search_intent";
  DROP TYPE "public"."enum__local_seo_pages_v_version_legacy_migration_status";
  DROP TYPE "public"."enum__local_seo_pages_v_version_legacy_render_source";
  DROP TYPE "public"."enum__local_seo_pages_v_version_status";
  DROP TYPE "public"."enum_media_image_type";
  DROP TYPE "public"."enum_media_visual_tone";
  DROP TYPE "public"."enum_media_usage_purpose";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_media_orientation";
  DROP TYPE "public"."enum_navigation_primary_seo_purpose";
  DROP TYPE "public"."enum_navigation_primary_rel";
  DROP TYPE "public"."enum_navigation_photography_links_seo_purpose";
  DROP TYPE "public"."enum_navigation_photography_links_rel";
  DROP TYPE "public"."enum_navigation_footer_links_seo_purpose";
  DROP TYPE "public"."enum_navigation_footer_links_rel";
  DROP TYPE "public"."enum_navigation_legal_links_seo_purpose";
  DROP TYPE "public"."enum_navigation_legal_links_rel";
  DROP TYPE "public"."enum_footer_columns_links_seo_purpose";
  DROP TYPE "public"."enum_footer_columns_links_rel";
  DROP TYPE "public"."enum_footer_primary_links_seo_purpose";
  DROP TYPE "public"."enum_footer_primary_links_rel";
  DROP TYPE "public"."enum_footer_service_links_seo_purpose";
  DROP TYPE "public"."enum_footer_service_links_rel";
  DROP TYPE "public"."enum_footer_social_links_seo_purpose";
  DROP TYPE "public"."enum_footer_social_links_rel";
  DROP TYPE "public"."enum_footer_social_links_platform";
  DROP TYPE "public"."enum_footer_legal_links_seo_purpose";
  DROP TYPE "public"."enum_footer_legal_links_rel";
  DROP TYPE "public"."enum_footer_about_link_seo_purpose";
  DROP TYPE "public"."enum_footer_about_link_rel";`)
}
