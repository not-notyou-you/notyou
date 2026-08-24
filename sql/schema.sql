-- ============================================================================
-- Portfolio Admin — Supabase schema
-- Run this whole file in the Supabase SQL Editor on a fresh project.
-- Source of truth: BACKEND_SETUP_GUIDE.md. This version fills in the RLS
-- policies for every table (the guide showed one as an example and said
-- "repeat for all tables") and seeds real data from identity.json,
-- intellect.json and passion.json instead of a two-row placeholder.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists pgcrypto; -- gen_random_uuid()

-- ============================================================================
-- AUTHENTICATION & ADMIN
-- ============================================================================
-- Not wired into the frontend yet (any authenticated Supabase Auth user is
-- treated as an admin — see ProtectedRoute.tsx). Kept here for when you want
-- real role-based access later: link a row to auth.users(id) after creating
-- the user in Supabase Auth, then extend ProtectedRoute to check it.
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text default 'admin' check (role in ('admin', 'editor')),
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- PROFILE (Global, single row)
-- ============================================================================
create table profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_bio text,
  full_description text,
  email text,
  phone text,
  location text,
  photo_url text,
  updated_at timestamp default now()
);

create table socials (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  unique(platform)
);

-- ============================================================================
-- IDENTITY PAGE
-- ============================================================================
create table education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text,
  field text not null,
  start_year integer,
  end_year integer,
  gpa text,
  honors text,
  details text,
  image_url text,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  start_date text,
  end_date text,
  duration text,
  location text,
  description text,
  institution_details text,
  logo_url text,
  position_order integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null check (level in ('Native', 'Fluent', 'Intermediate', 'Beginner')),
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  unique(name)
);

-- ============================================================================
-- SHARED: PAGE CONTENT (greeting / quote / subtitle per page)
-- ============================================================================
create table page_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null unique,
  greeting_text text,
  quote_text text,
  subtitle_text text,
  image_url text,
  custom_content jsonb,
  is_published boolean default false,
  updated_at timestamp default now(),
  check (page_slug in ('identity', 'intellect', 'passion'))
);

-- ============================================================================
-- INTELLECT PAGE
-- ============================================================================
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text,
  long_description text,
  image_url text,
  additional_images jsonb,
  live_demo_url text,
  github_url text,
  blog_url text,
  year integer,
  category text,
  is_featured boolean default false,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  tech_name text not null,
  position integer default 0,
  created_at timestamp default now(),
  unique(project_id, tech_name)
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Programming Languages', 'Frameworks', 'Tools')),
  skill_name text not null,
  image_url text,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  unique(skill_name, category)
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  skills text,
  certification_url text,
  image_url text,
  year integer,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table academic_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  course text,
  description text,
  technologies jsonb,
  project_url text,
  year integer,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- PASSION PAGE
-- ============================================================================
create table leadership (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  position text not null,
  start_date text,
  end_date text,
  period text,
  description text not null,
  achievements jsonb,
  icon_type text,
  position_order integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table creative_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('digital', 'traditional', 'stickers')),
  image_url text,
  project_link text,
  year integer,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table carousel_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  event_or_context text,
  position integer default 0,
  is_visible boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_education_position on education(position);
create index idx_education_visible on education(is_visible);
create index idx_experience_position on experience(position_order);
create index idx_experience_visible on experience(is_visible);
create index idx_languages_position on languages(position);
create index idx_projects_featured on projects(is_featured);
create index idx_projects_visible on projects(is_visible);
create index idx_projects_position on projects(position);
create index idx_project_technologies_project on project_technologies(project_id);
create index idx_skills_category on skills(category);
create index idx_certifications_year on certifications(year);
create index idx_academic_projects_position on academic_projects(position);
create index idx_leadership_organization on leadership(organization);
create index idx_leadership_position on leadership(position_order);
create index idx_creative_works_category on creative_works(category);
create index idx_carousel_position on carousel_photos(position);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Pattern used everywhere except admin_users: anyone can read visible/
-- published rows (this is what the public portfolio site queries with the
-- anon key); only an authenticated Supabase Auth user (the admin) can
-- write. Tighten `admin write` policies later with a real role check
-- against admin_users if you add multiple accounts.
-- ============================================================================

alter table admin_users enable row level security;
alter table profile enable row level security;
alter table socials enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table languages enable row level security;
alter table page_content enable row level security;
alter table projects enable row level security;
alter table project_technologies enable row level security;
alter table skills enable row level security;
alter table certifications enable row level security;
alter table academic_projects enable row level security;
alter table leadership enable row level security;
alter table creative_works enable row level security;
alter table carousel_photos enable row level security;

-- admin_users: locked down — no public access at all, only authenticated.
create policy "Authenticated read admin_users" on admin_users for select using (auth.role() = 'authenticated');
create policy "Authenticated write admin_users" on admin_users for all using (auth.role() = 'authenticated');

-- profile: single row, always publicly readable, admin-writable.
create policy "Public read profile" on profile for select using (true);
create policy "Admin write profile" on profile for all using (auth.role() = 'authenticated');

create policy "Public read socials" on socials for select using (is_visible = true);
create policy "Admin write socials" on socials for all using (auth.role() = 'authenticated');

create policy "Public read education" on education for select using (is_visible = true);
create policy "Admin write education" on education for all using (auth.role() = 'authenticated');

create policy "Public read experience" on experience for select using (is_visible = true);
create policy "Admin write experience" on experience for all using (auth.role() = 'authenticated');

create policy "Public read languages" on languages for select using (is_visible = true);
create policy "Admin write languages" on languages for all using (auth.role() = 'authenticated');

create policy "Public read page_content" on page_content for select using (is_published = true);
create policy "Admin write page_content" on page_content for all using (auth.role() = 'authenticated');

create policy "Public read projects" on projects for select using (is_visible = true);
create policy "Admin write projects" on projects for all using (auth.role() = 'authenticated');

-- Technology tags aren't sensitive; readable whenever their parent project is.
create policy "Public read project_technologies" on project_technologies for select using (true);
create policy "Admin write project_technologies" on project_technologies for all using (auth.role() = 'authenticated');

create policy "Public read skills" on skills for select using (is_visible = true);
create policy "Admin write skills" on skills for all using (auth.role() = 'authenticated');

create policy "Public read certifications" on certifications for select using (is_visible = true);
create policy "Admin write certifications" on certifications for all using (auth.role() = 'authenticated');

create policy "Public read academic_projects" on academic_projects for select using (is_visible = true);
create policy "Admin write academic_projects" on academic_projects for all using (auth.role() = 'authenticated');

create policy "Public read leadership" on leadership for select using (is_visible = true);
create policy "Admin write leadership" on leadership for all using (auth.role() = 'authenticated');

create policy "Public read creative_works" on creative_works for select using (is_visible = true);
create policy "Admin write creative_works" on creative_works for all using (auth.role() = 'authenticated');

create policy "Public read carousel_photos" on carousel_photos for select using (is_visible = true);
create policy "Admin write carousel_photos" on carousel_photos for all using (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_admin_users_updated_at before update on admin_users
  for each row execute function update_updated_at_column();
create trigger update_profile_updated_at before update on profile
  for each row execute function update_updated_at_column();
create trigger update_education_updated_at before update on education
  for each row execute function update_updated_at_column();
create trigger update_experience_updated_at before update on experience
  for each row execute function update_updated_at_column();
create trigger update_projects_updated_at before update on projects
  for each row execute function update_updated_at_column();
create trigger update_certifications_updated_at before update on certifications
  for each row execute function update_updated_at_column();
create trigger update_academic_projects_updated_at before update on academic_projects
  for each row execute function update_updated_at_column();
create trigger update_page_content_updated_at before update on page_content
  for each row execute function update_updated_at_column();
create trigger update_leadership_updated_at before update on leadership
  for each row execute function update_updated_at_column();
create trigger update_creative_works_updated_at before update on creative_works
  for each row execute function update_updated_at_column();
create trigger update_carousel_photos_updated_at before update on carousel_photos
  for each row execute function update_updated_at_column();

-- ============================================================================
-- SEED DATA — real content from identity.json / intellect.json / passion.json
-- (Safe to delete and re-seed from the admin panel once it's live.)
-- ============================================================================

-- ---------- Profile ----------
insert into profile (name, short_bio, full_description, email, phone, location) values (
  'Muhammad Faiq Hakim Ulinnuha',
  'Information Systems student at UMN with expertise in full-stack development and data analysis. Passionate about creating digital solutions that make an impact.',
  'Active Information Systems student at Multimedia Nusantara University (class of 2023) with a strong foundation in Object Oriented Programming, web development, database administration, data analysis, and machine learning. Proficient in Java, R, PL/SQL, C#, Python, HTML, CSS (Tailwind), JavaScript, and PHP, with hands-on experience in developing web applications using Vue.js and Laravel frameworks.',
  'm.faiq.h.u@gmail.com',
  '089520568879',
  'Tangerang Selatan, Indonesia'
);

-- ---------- Socials ----------
insert into socials (platform, url, position) values
  ('instagram', 'https://instagram.com/m_nafaiq', 1),
  ('linkedin', 'https://www.linkedin.com/in/muhammad-faiq-hakim-ulinnuha/', 2),
  ('github', 'https://github.com/notyou-alt', 3),
  ('telegram', '089520568879', 4),
  ('whatsapp', '089520568879', 5),
  ('idline', 'hakimulinnuha', 6);

-- ---------- Page content ----------
insert into page_content (page_slug, greeting_text, quote_text, subtitle_text, is_published) values
  ('identity', null, null, null, true),
  ('intellect', 'Say Hello to my workspace', 'Where logic meets chaos, and somehow, it works.', null, true),
  ('passion', null, 'STEP INTO THE BEAUTIFUL MADNESS', 'Where colors argue and lines disobey. Somewhere between instinct and accident, art happens.', true);

-- ---------- Education ----------
insert into education (institution, degree, field, start_year, end_year, details, position, is_visible) values
  ('Universitas Multimedia Nusantara', null, 'Information Systems', 2023, null,
   'Currently pursuing a degree in Information Systems, actively engaging in comprehensive coursework covering software development, database management, and data analytics.', 1, true),
  ('PMDG Pusat Ponorogo', 'High School Diploma', 'General', 2019, 2022,
   'Completed high school education with distinction, serving as a school health officer and certified Scout Instructor. Held leadership positions including Chief of Language Manager.', 2, true);

-- ---------- Experience ----------
insert into experience (company, positio--n, start_date, end_date, duration, location, description, institution_details, position_order, is_visible) values
  ('Universitas Multimedia Nusantara', 'Web Design & Development Course Instructor', 'Jun 2025', 'Nov 2025', '6 months', 'Gading Serpong, Tangerang, Banten',
   'Taught HTML, CSS, JavaScript, PHP, Bootstrap, and Laravel fundamentals to 10 students across four structured sessions. Guided students in creating responsive, interactive websites with essential UI/UX principles.',
   'A distinguished private university in Indonesia, focusing on Information and Communication Technology (ICT) and entrepreneurship.', 1, true),
  ('Universitas Multimedia Nusantara', 'Probability & Statistics Lab Assistant', 'Feb 2025', 'Jul 2025', '6 months', 'Gading Serpong, Tangerang, Banten',
   'Taught 38 undergraduate students R programming and data analysis techniques using RStudio. Guided students in data visualization, descriptive statistics, correlation tests, and data processing.',
   'A distinguished private university in Indonesia, focusing on Information and Communication Technology (ICT) and entrepreneurship.', 2, true),
  ('UMN Medical Center', 'Project Lead of Website Development', 'Nov 2024', 'Dec 2025', '1 year 1 month', 'Gading Serpong, Tangerang, Banten',
   'Led a competitively selected 3-developer team to improve UMN Medical Center''s official website. Managed a platform serving 20+ monthly requests and 50–80 outgoing emails daily.',
   'A semi-autonomous UMN health organization providing first aid, medication, health education, and interactive campaigns.', 3, true),
  ('MI Al Busyra Gontor', 'Homeroom Teacher & Subject Instructor', 'May 2022', 'Jul 2023', '1 year 3 months', 'Konawe Regency, Southeast Sulawesi Province',
   'Taught over 80 elementary students Grade 6 thematic subjects aligned with the Kurikulum Merdeka framework. Delivered lessons in Arabic, English, and basic computer literacy.',
   'An Islamic Elementary School affiliated with the Gontor educational network.', 4, true);

-- ---------- Languages ----------
insert into languages (name, level, position) values
  ('Indonesian', 'Native', 1),
  ('Arabic', 'Fluent', 2),
  ('English', 'Intermediate', 3);

-- ---------- Projects + technologies (CTE keeps this a single statement pair) ----------
with inserted_projects as (
  insert into projects (title, short_description, long_description, image_url, live_demo_url, category, is_featured, position) values
    ('UMN Medical Center Official Website',
     'Comprehensive medical center platform for service requests, equipment management, and automated communications.',
     'A full-stack web application for UMN Medical Center LSO featuring real-time medical service requests, equipment rental system, automated email notifications, and dynamic event galleries.',
     '/assets/int/mdc.jpg', 'https://medic.umn.ac.id', 'Web Development', true, 0),
    ('NitroSense: Soil Nitrogen Prediction',
     'AI-powered soil analysis system for precision agriculture and nitrogen level optimization.',
     'Advanced machine learning application utilizing Random Forest algorithm to analyze soil composition and predict nitrogen levels with 92% accuracy.',
     '/assets/int/sid.jpg', 'https://notyou-randomforest.streamlit.app/', 'Web Development', true, 1),
    ('PumpSight: Water Pump Status Prediction',
     'Machine learning-based predictive system for water pump operational status classification using 15 technical features.',
     'PumpSight utilizes a trained Random Forest model to classify water pumps into three categories: functional, non-functional, and needs repair.',
     '/assets/int/wpsp.jpg', 'https://pumpsight.streamlit.app/', 'Web Development', false, 2),
    ('TukangPRO: connecting professional handymen with clients',
     'End-to-end professional handyman platform with project tracking and financial reporting.',
     'Complete service platform connecting professional handymen with clients, featuring project management, PMP reporting, Earned Value Management analytics, and a client communication portal.',
     '/assets/int/tkp.jpg',
     'https://www.figma.com/proto/mJaOmOOyxVds59whZTOwpQ/arsyancs34-s-team-library',
     'UI/UX', true, 3),
    ('LI-BRO: Library Management System',
     'Digital library solution with automated operations and resource management.',
     'Comprehensive library management system built on Oracle APEX featuring automated book cataloging, real-time inventory tracking, member management, and fine calculation.',
     '/assets/int/libr.jpg',
     'https://drive.google.com/file/d/17qYNq0umjBO81hYyKk2RZZ-wee-02T8v/view',
     'Data & Database', false, 4),
    ('Bantoo: Community service platform',
     'Community service platform connecting helpers with vulnerable groups.',
     'Mobile application designed to bridge service providers with elderly citizens and housewives requiring assistance, with accessibility-first design.',
     '/assets/int/bnt.jpg',
     'https://www.figma.com/proto/sTDqq8bvxPaK540acQtKft/Techno',
     'UI/UX', false, 5)
  returning id, title
)
insert into project_technologies (project_id, tech_name, position)
select ip.id, t.tech, t.ord
from inserted_projects ip
join (values
  ('UMN Medical Center Official Website', 'Laravel', 0),
  ('UMN Medical Center Official Website', 'React', 1),
  ('UMN Medical Center Official Website', 'MySQL', 2),
  ('UMN Medical Center Official Website', 'Tailwind', 3),
  ('UMN Medical Center Official Website', 'EmailJS', 4),
  ('NitroSense: Soil Nitrogen Prediction', 'Python', 0),
  ('NitroSense: Soil Nitrogen Prediction', 'Random Forest', 1),
  ('NitroSense: Soil Nitrogen Prediction', 'Streamlit', 2),
  ('NitroSense: Soil Nitrogen Prediction', 'Machine Learning', 3),
  ('NitroSense: Soil Nitrogen Prediction', 'Scikit-learn', 4),
  ('PumpSight: Water Pump Status Prediction', 'Python', 0),
  ('PumpSight: Water Pump Status Prediction', 'Random Forest', 1),
  ('PumpSight: Water Pump Status Prediction', 'Streamlit', 2),
  ('PumpSight: Water Pump Status Prediction', 'Machine Learning', 3),
  ('PumpSight: Water Pump Status Prediction', 'Scikit-learn', 4),
  ('TukangPRO: connecting professional handymen with clients', 'Figma', 0),
  ('TukangPRO: connecting professional handymen with clients', 'UI/UX Design', 1),
  ('TukangPRO: connecting professional handymen with clients', 'Prototyping', 2),
  ('TukangPRO: connecting professional handymen with clients', 'User Research', 3),
  ('LI-BRO: Library Management System', 'Oracle APEX', 0),
  ('LI-BRO: Library Management System', 'PL/SQL', 1),
  ('LI-BRO: Library Management System', 'Database Design', 2),
  ('LI-BRO: Library Management System', 'Oracle Database', 3),
  ('Bantoo: Community service platform', 'Figma', 0),
  ('Bantoo: Community service platform', 'UI/UX', 1),
  ('Bantoo: Community service platform', 'Mobile App Design', 2),
  ('Bantoo: Community service platform', 'User Experience', 3)
) as t(title, tech, ord) on ip.title = t.title;

-- ---------- Skills ----------
insert into skills (category, skill_name, position) values
  ('Programming Languages', 'Java', 0), ('Programming Languages', 'C#', 1), ('Programming Languages', 'R', 2),
  ('Programming Languages', 'HTML', 3), ('Programming Languages', 'CSS', 4), ('Programming Languages', 'JavaScript', 5),
  ('Programming Languages', 'PHP', 6), ('Programming Languages', 'Python', 7), ('Programming Languages', 'MySQL', 8),
  ('Programming Languages', 'PL/SQL', 9),
  ('Frameworks', 'TailwindCSS', 0), ('Frameworks', 'Laravel', 1), ('Frameworks', 'React', 2), ('Frameworks', 'Vue', 3),
  ('Tools', 'Oracle Database 21c XE', 0), ('Tools', 'SQL Server', 1), ('Tools', 'Oracle APEX', 2),
  ('Tools', 'GitHub Desktop', 3), ('Tools', 'VM VirtualBox', 4), ('Tools', 'Cisco Packet Tracer', 5),
  ('Tools', 'Wireshark', 6), ('Tools', 'XAMPP', 7), ('Tools', 'Visual Studio 2019', 8), ('Tools', 'VS Code', 9),
  ('Tools', 'RStudio', 10), ('Tools', 'Jupyter Notebook', 11), ('Tools', 'Google Colab', 12),
  ('Tools', 'Pentaho', 13), ('Tools', 'Figma', 14), ('Tools', 'Penpot', 15);

-- ---------- Certifications ----------
insert into certifications (title, issuer, skills, certification_url, position) values
  ('Data Classification and Summarization Using IBM Granite', 'IBM',
   'klasifikasi & ringkasan data dengan AI-driven tools, prompt engineering, model parameter optimization',
   'https://www.credly.com/badges/d3df0084-37e7-4aba-a469-72b34dc2fee6/linked_in_profile', 0),
  ('Code Generation and Optimization Using IBM Granite', 'IBM',
   'pengembangan & optimalisasi kode lintas bahasa dengan AI',
   'https://www.credly.com/badges/75586366-898e-4b88-a545-79ee9edc45fd/linked_in_profile', 1),
  ('Database Foundations Certified Junior Associate', 'Oracle',
   'MySQL HeatWave, OCI Data Lakehouse, JSON/Graph/Spatial Database, Data Mesh architecture',
   'https://catalog-education.oracle.com/ords/certview/sharebadge?id=975E7432B311D424C60E21625705C675EDD5917A0F3348C1D96D71A9159BB89D', 2);

-- ---------- Academic projects ----------
insert into academic_projects (title, project_url, position) values
  ('The Influence of Online Gambling Propaganda on Indonesian Multimedia University Students',
   'https://drive.google.com/file/d/1dRVYkppkTPHrDT-jtG3vuO3JL9iAt-29/view', 0),
  ('Laptop Selection Optimization Using WP and SAW Methods in DSS',
   'https://drive.google.com/file/d/1hjLSNmWjlc17jHF-NgsRWlSijuZ4uNDc/view', 1),
  ('Advantages and Benefits of Using Big Data in an Institution and Organization — A Systematic Literature Review',
   'https://drive.google.com/file/d/1jKhSE-iYsppUTkx1JqNzniZj5iR4JHpu/view', 2),
  ('Implementasi Database dalam Meningkatkan Kualitas Pendidikan MI Al Busyra Gontor',
   'https://drive.google.com/file/d/1SqK5yrRZFGBALi2fI5nQHmUJiyLlH4EM/view', 3),
  ('Peningkatan Akurasi Model Pembelajaran Mesin Random Forest Regression dalam Mendeteksi Nitrogen Tanah',
   'https://drive.google.com/file/d/1Z6o7g9rG63wOT0n7IVwhb82t569sxHjO/view', 4),
  ('Pengaplikasian Metodologi Agile Terhadap Perancangan UX Aplikasi Kesehatan ''HealthPal''',
   'https://drive.google.com/file/d/1CQwK8uknxfAr-6MZvZt__g5LCS_2A_vw/view', 5),
  ('RANCANG BANGUN SISTEM INFORMASI APOTEK PHARMA-SYST DENGAN MENGGUNAKAN VISUAL C#',
   'https://drive.google.com/file/d/1mq_1UdDJX6URknTaw4XJ56Vu6sbpo_eI/view', 6),
  ('PROJECT MANAGEMENT PLAN-RANCANG BANGUN WEBSITE TUKANGPRO',
   'https://drive.google.com/file/d/1NrxW_BqWmvW3Gac5KUbe6BcV5dZcDdFK/view', 7),
  ('PROJECT CLOSURE-RANCANG BANGUN WEBSITE TUKANGPRO',
   'https://drive.google.com/file/d/1HlhaA1UaM9CwvVCvvxiRIxKWOtIyAedp/view', 8),
  ('Improving risk governance and management processes at PT WWW using the COBIT 2019',
   'https://drive.google.com/file/d/1ggcw0FO2cCv1fkjgr6vl-1kNng2KiAx4/view', 9);

-- ---------- Leadership ----------
insert into leadership (organization, position, period, description, icon_type, position_order) values
  ('SIM (Social Is Me)', 'Documentation & Visual Division Member', '10/2025 - Present',
   'Responsible for documenting events and creating visual content for social media platforms.', 'Award', 0),
  ('ALIVE 11.0', 'Sponsorship Division Member', '01/2025 - Present',
   'Identified and engaged potential sponsors for event support. Acted as communication bridge between sponsors and committee.', 'Users', 1),
  ('UMN Medical Center Gen 11', 'Website Development Coordinator', '07/2025 - Present',
   'Recruited and led website development team. Enhanced website with new features and maintained existing functionality.', 'ExternalLink', 2),
  ('DISCO 12 (Information System Community Outbound)', 'Chairperson', '01/2025 - Present',
   'Planned and executed pre-event, main event, and post-event activities. Ensured smooth operations and stakeholder satisfaction.', 'Users', 3),
  ('SADINA OMB UMN 2025', 'Medical Division Member', '11/2024 - Present',
   'Assisted in preparing medical team and provided medical support during orientation events.', 'Heart', 4),
  ('TWL (Teamwork and Leadership) UMN 2025', 'Mentor & Master of Ceremonies', '03/2025 - 06/2025',
   'Served as MC and mentored groups to understand materials and complete projects.', 'Mic', 5),
  ('FTI UMN - Probability and Statistics', 'Laboratory Assistant', '02/2025 - 06/2025',
   'Taught R programming and data analysis. Guided students on data visualization and statistical techniques.', 'Award', 6),
  ('UMN Career Building 2025', 'Master of Ceremonies', '02/2025 - 03/2025',
   'Hosted events for Information Systems and Accounting departments with prepared scripts.', 'Mic', 7),
  ('Information Literacy UMN 2024', 'Mentor', '08/2024 - 02/2025',
   'Monitored event flow and acted as liaison to help participants access necessary information.', 'Users', 8),
  ('UMN Career Preparation 2024', 'Master of Ceremonies', '07/2024 - 09/2024',
   'Hosted events for Information Systems and Architecture departments.', 'Mic', 9),
  ('ALIVE 10.0', 'Event Production Coordinator', '06/2024 - 11/2024',
   'Recruited and supervised event division members. Served as MC for key sessions.', 'Play', 10),
  ('DISCO 11', 'Security & Transportation Coordinator', '03/2024 - 11/2024',
   'Recruited and trained security team. Collaborated with transportation vendors.', 'Shield', 11),
  ('SARAYA OMB UMN 2024', 'Medical Division Member', '02/2024 - 08/2024',
   'Provided medical assistance and managed medical supplies during orientation.', 'Heart', 12),
  ('UMN Medical Center Gen 10', 'Medical Team Member', '02/2024 - 11/2024',
   'Trained in first aid and assisted at health clinic. Achieved highest service points.', 'Heart', 13),
  ('STARLIGHT UMN 2023', 'Logistics & Accommodation Division Member', '09/2023 - 11/2023',
   'Fulfilled logistical needs and assisted operators during all event stages.', 'Truck', 14);

-- ---------- Creative works ----------
insert into creative_works (title, description, category, image_url, position)
select 'Digital Art ' || n, 'Fun, colorful cartoon style characters with expressive faces and unique poses', 'digital',
       '/assets/dgt/dgt' || n || '.jpg', n - 1
from generate_series(1, 10) as n;

insert into creative_works (title, description, category, image_url, position)
select 'Traditional Art ' || n, 'Dark, high-contrast pen illustrations with detailed linework and gradual shading', 'traditional',
       '/assets/trd/trd' || n || '.jpg', n - 1
from generate_series(1, 10) as n;

insert into creative_works (title, description, category, image_url, position)
select 'LINE Sticker ' || n, 'Designed and published on LINE Official Store', 'stickers',
       '/assets/stkr/stkr' || n || '.jpg', n - 1
from generate_series(1, 24) as n;

-- ---------- Carousel photos ----------
insert into carousel_photos (image_url, caption, event_or_context, position)
select '/assets/m/m' || n || '.jpg', 'Activity moment ' || n, 'Committee & Events', n - 1
from generate_series(1, 10) as n;
