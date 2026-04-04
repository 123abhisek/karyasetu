-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role user_role DEFAULT 'user',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT NOT NULL,
  features_required TEXT,
  tech_stack TEXT,
  budget NUMERIC,
  deadline DATE,
  phone TEXT,
  email TEXT,
  file_url TEXT,
  reference_links TEXT,
  status submission_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all submissions" ON submissions FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update submissions" ON submissions FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Set up Storage Bucket for files
INSERT INTO storage.buckets (id, name, public) VALUES ('project_files', 'project_files', true);
CREATE POLICY "Anyone can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project_files' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can read files" ON storage.objects FOR SELECT USING (bucket_id = 'project_files');