import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Strukturierte Themen-Sektionen für ServicePages (Hero-Panels, Statement, Aufnahme-Stile,
// Galerie/Portfolio-Kacheln, Für-wen-Karten). Rein additiv: nur neue Tabellen + Spalten auf
// service_pages / _service_pages_v. Keine Änderungen an bestehenden Tabellen/Enums.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "service_pages_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );

  CREATE TABLE "service_pages_statement_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );

  CREATE TABLE "service_pages_shooting_styles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" varchar
  );

  CREATE TABLE "service_pages_portfolio_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar
  );

  CREATE TABLE "service_pages_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"number" varchar,
  	"title" varchar,
  	"text" varchar
  );

  CREATE TABLE "_service_pages_v_version_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE "_service_pages_v_version_statement_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_service_pages_v_version_shooting_styles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_service_pages_v_version_portfolio_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_service_pages_v_version_audience_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"number" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );

  ALTER TABLE "service_pages" ADD COLUMN "hero_line2" varchar;
  ALTER TABLE "service_pages" ADD COLUMN "statement_headline" varchar;
  ALTER TABLE "service_pages" ADD COLUMN "statement_emphasis" varchar;
  ALTER TABLE "_service_pages_v" ADD COLUMN "version_hero_line2" varchar;
  ALTER TABLE "_service_pages_v" ADD COLUMN "version_statement_headline" varchar;
  ALTER TABLE "_service_pages_v" ADD COLUMN "version_statement_emphasis" varchar;

  ALTER TABLE "service_pages_hero_panels" ADD CONSTRAINT "service_pages_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_hero_panels" ADD CONSTRAINT "service_pages_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_statement_body" ADD CONSTRAINT "service_pages_statement_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_shooting_styles" ADD CONSTRAINT "service_pages_shooting_styles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_shooting_styles" ADD CONSTRAINT "service_pages_shooting_styles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_portfolio_tiles" ADD CONSTRAINT "service_pages_portfolio_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_portfolio_tiles" ADD CONSTRAINT "service_pages_portfolio_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_audience_cards" ADD CONSTRAINT "service_pages_audience_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_audience_cards" ADD CONSTRAINT "service_pages_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_hero_panels" ADD CONSTRAINT "_service_pages_v_version_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_hero_panels" ADD CONSTRAINT "_service_pages_v_version_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_statement_body" ADD CONSTRAINT "_service_pages_v_version_statement_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_shooting_styles" ADD CONSTRAINT "_service_pages_v_version_shooting_styles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_shooting_styles" ADD CONSTRAINT "_service_pages_v_version_shooting_styles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_portfolio_tiles" ADD CONSTRAINT "_service_pages_v_version_portfolio_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_portfolio_tiles" ADD CONSTRAINT "_service_pages_v_version_portfolio_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_audience_cards" ADD CONSTRAINT "_service_pages_v_version_audience_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_pages_v_version_audience_cards" ADD CONSTRAINT "_service_pages_v_version_audience_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_pages_v"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "service_pages_hero_panels_order_idx" ON "service_pages_hero_panels" USING btree ("_order");
  CREATE INDEX "service_pages_hero_panels_parent_id_idx" ON "service_pages_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "service_pages_hero_panels_image_idx" ON "service_pages_hero_panels" USING btree ("image_id");
  CREATE INDEX "service_pages_statement_body_order_idx" ON "service_pages_statement_body" USING btree ("_order");
  CREATE INDEX "service_pages_statement_body_parent_id_idx" ON "service_pages_statement_body" USING btree ("_parent_id");
  CREATE INDEX "service_pages_shooting_styles_order_idx" ON "service_pages_shooting_styles" USING btree ("_order");
  CREATE INDEX "service_pages_shooting_styles_parent_id_idx" ON "service_pages_shooting_styles" USING btree ("_parent_id");
  CREATE INDEX "service_pages_shooting_styles_image_idx" ON "service_pages_shooting_styles" USING btree ("image_id");
  CREATE INDEX "service_pages_portfolio_tiles_order_idx" ON "service_pages_portfolio_tiles" USING btree ("_order");
  CREATE INDEX "service_pages_portfolio_tiles_parent_id_idx" ON "service_pages_portfolio_tiles" USING btree ("_parent_id");
  CREATE INDEX "service_pages_portfolio_tiles_image_idx" ON "service_pages_portfolio_tiles" USING btree ("image_id");
  CREATE INDEX "service_pages_audience_cards_order_idx" ON "service_pages_audience_cards" USING btree ("_order");
  CREATE INDEX "service_pages_audience_cards_parent_id_idx" ON "service_pages_audience_cards" USING btree ("_parent_id");
  CREATE INDEX "service_pages_audience_cards_image_idx" ON "service_pages_audience_cards" USING btree ("image_id");
  CREATE INDEX "_service_pages_v_version_hero_panels_order_idx" ON "_service_pages_v_version_hero_panels" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_hero_panels_parent_id_idx" ON "_service_pages_v_version_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_hero_panels_image_idx" ON "_service_pages_v_version_hero_panels" USING btree ("image_id");
  CREATE INDEX "_service_pages_v_version_statement_body_order_idx" ON "_service_pages_v_version_statement_body" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_statement_body_parent_id_idx" ON "_service_pages_v_version_statement_body" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_shooting_styles_order_idx" ON "_service_pages_v_version_shooting_styles" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_shooting_styles_parent_id_idx" ON "_service_pages_v_version_shooting_styles" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_shooting_styles_image_idx" ON "_service_pages_v_version_shooting_styles" USING btree ("image_id");
  CREATE INDEX "_service_pages_v_version_portfolio_tiles_order_idx" ON "_service_pages_v_version_portfolio_tiles" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_portfolio_tiles_parent_id_idx" ON "_service_pages_v_version_portfolio_tiles" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_portfolio_tiles_image_idx" ON "_service_pages_v_version_portfolio_tiles" USING btree ("image_id");
  CREATE INDEX "_service_pages_v_version_audience_cards_order_idx" ON "_service_pages_v_version_audience_cards" USING btree ("_order");
  CREATE INDEX "_service_pages_v_version_audience_cards_parent_id_idx" ON "_service_pages_v_version_audience_cards" USING btree ("_parent_id");
  CREATE INDEX "_service_pages_v_version_audience_cards_image_idx" ON "_service_pages_v_version_audience_cards" USING btree ("image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "service_pages_hero_panels" CASCADE;
  DROP TABLE "service_pages_statement_body" CASCADE;
  DROP TABLE "service_pages_shooting_styles" CASCADE;
  DROP TABLE "service_pages_portfolio_tiles" CASCADE;
  DROP TABLE "service_pages_audience_cards" CASCADE;
  DROP TABLE "_service_pages_v_version_hero_panels" CASCADE;
  DROP TABLE "_service_pages_v_version_statement_body" CASCADE;
  DROP TABLE "_service_pages_v_version_shooting_styles" CASCADE;
  DROP TABLE "_service_pages_v_version_portfolio_tiles" CASCADE;
  DROP TABLE "_service_pages_v_version_audience_cards" CASCADE;
  ALTER TABLE "service_pages" DROP COLUMN "hero_line2";
  ALTER TABLE "service_pages" DROP COLUMN "statement_headline";
  ALTER TABLE "service_pages" DROP COLUMN "statement_emphasis";
  ALTER TABLE "_service_pages_v" DROP COLUMN "version_hero_line2";
  ALTER TABLE "_service_pages_v" DROP COLUMN "version_statement_headline";
  ALTER TABLE "_service_pages_v" DROP COLUMN "version_statement_emphasis";`)
}
