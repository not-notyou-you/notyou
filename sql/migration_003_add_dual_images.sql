-- sql/migration_003_add_dual_images.sql
alter table education add column if not exists logo_url text;
alter table experience add column if not exists image_url text;
alter table leadership add column if not exists image_url text;