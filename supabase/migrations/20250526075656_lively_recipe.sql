/*
  # Create users management tables and policies

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - References auth.users
      - `name` (text) - User's full name
      - `email` (text) - User's email address
      - `role` (text) - User's role (admin/writer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on users table
    - Add policies for admin access
    - Add policies for writer access
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'writer');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'writer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Admins have full access"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Insert initial admin user
INSERT INTO users (id, name, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin.test@example.com'),
  'Admin User',
  'admin.test@example.com',
  'admin'
) ON CONFLICT (id) DO NOTHING;