-- =========================
-- ENABLE RLS
-- =========================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- =========================
-- PROFILES
-- =========================

DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- =========================
-- ADMIN CHECK FUNCTION (IMPORTANT)
-- =========================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- PROJECTS (ADMIN ONLY WRITE)
-- =========================

DROP POLICY IF EXISTS "Projects read" ON projects;
DROP POLICY IF EXISTS "Projects admin write" ON projects;

CREATE POLICY "Projects public read"
ON projects
FOR SELECT
USING (true);

CREATE POLICY "Projects admin write"
ON projects
FOR INSERT, UPDATE, DELETE
USING (is_admin())
WITH CHECK (is_admin());

-- =========================
-- SITE CONTENT
-- =========================

CREATE POLICY "Site content public read"
ON site_content
FOR SELECT
USING (true);

CREATE POLICY "Site content admin write"
ON site_content
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- =========================
-- SERVICES
-- =========================

CREATE POLICY "Services public read"
ON services
FOR SELECT
USING (true);

CREATE POLICY "Services admin write"
ON services
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- =========================
-- TESTIMONIALS
-- =========================

CREATE POLICY "Testimonials public read"
ON testimonials
FOR SELECT
USING (true);

CREATE POLICY "Testimonials admin write"
ON testimonials
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- =========================
-- CONTACT SETTINGS
-- =========================

CREATE POLICY "Contact public read"
ON contact_settings
FOR SELECT
USING (true);

CREATE POLICY "Contact admin write"
ON contact_settings
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
