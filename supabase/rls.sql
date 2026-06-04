-- Supabase RLS and admin role policies

-- Enable RLS for managed tables.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- A helper policy to identify admins using the profiles table.
CREATE POLICY "Admins may read their profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins may update their profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins may insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins may manage CMS content" ON projects
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public may read site content" ON site_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins may manage site content" ON site_content
  FOR INSERT, UPDATE, DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public may read services" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Admins may manage services" ON services
  FOR INSERT, UPDATE, DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public may read testimonials" ON testimonials
  FOR SELECT
  USING (true);

CREATE POLICY "Admins may manage testimonials" ON testimonials
  FOR INSERT, UPDATE, DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public may read contact settings" ON contact_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins may manage contact settings" ON contact_settings
  FOR INSERT, UPDATE, DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- OPTIONAL: Restrict auth signups to invited email domains if desired.
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Only verified invite email addresses may sign up" ON auth.users
--   FOR INSERT
--   WITH CHECK (email LIKE '%@yourdomain.com');
