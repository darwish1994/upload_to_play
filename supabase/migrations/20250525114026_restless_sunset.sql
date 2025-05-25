/*
  # Create app submissions table

  1. New Tables
    - `app_submissions`
      - `id` (uuid, primary key)
      - `app_name_en` (text, required)
      - `app_name_ar` (text, required)
      - `privacy_link` (text, required)
      - `short_description` (text, required, max 80 chars)
      - `long_description` (text, required, max 300 chars)
      - `logo_url` (text, required)
      - `screenshot_urls` (text[], required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `app_submissions` table
    - Add policies for authenticated users to:
      - Read their own submissions
      - Create new submissions
      - Update their own submissions
      - Delete their own submissions
*/

CREATE TABLE app_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name_en text NOT NULL,
  app_name_ar text NOT NULL,
  privacy_link text NOT NULL,
  short_description text NOT NULL CHECK (char_length(short_description) <= 80),
  long_description text NOT NULL CHECK (char_length(long_description) <= 300),
  logo_url text NOT NULL,
  screenshot_urls text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

ALTER TABLE app_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for reading own submissions
CREATE POLICY "Users can read own submissions"
  ON app_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for creating submissions
CREATE POLICY "Users can create submissions"
  ON app_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating own submissions
CREATE POLICY "Users can update own submissions"
  ON app_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting own submissions
CREATE POLICY "Users can delete own submissions"
  ON app_submissions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_submissions_updated_at
  BEFORE UPDATE
  ON app_submissions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();