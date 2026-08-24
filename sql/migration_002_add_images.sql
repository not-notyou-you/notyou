-- ============================================================================
-- Migration 002 — add image fields
-- Run this in the Supabase SQL Editor on top of your existing database
-- (the one that already ran sql/schema.sql). Safe to re-run — every
-- statement is guarded with IF NOT EXISTS.
--
-- Adds:
--   profile.photo_url            — profile photo
--   education.image_url          — institution photo/logo
--   experience.logo_url          — institution/company logo
--   page_content.image_url       — the greeting/quote image (Intellect & Passion)
--   projects.additional_images   — up to 3 extra gallery images (jsonb array)
--   skills.image_url             — language/framework/tool logo
--   certifications.image_url     — certificate photo
-- ============================================================================

alter table profile add column if not exists photo_url text;
alter table education add column if not exists image_url text;
alter table experience add column if not exists logo_url text;
alter table page_content add column if not exists image_url text;
alter table projects add column if not exists additional_images jsonb;
alter table skills add column if not exists image_url text;
alter table certifications add column if not exists image_url text;
