/*
  # Create storage buckets for app assets
  
  1. New Buckets
    - `app_logos`: Stores application logo images
    - `app_screenshots`: Stores application screenshot images
    
  2. Security
    - Enable public access for reading images
    - Restrict uploads to authenticated users only
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('app_logos', 'app_logos', true),
  ('app_screenshots', 'app_screenshots', true);

-- Set up security policies for app_logos bucket
CREATE POLICY "Public can view app logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app_logos');

CREATE POLICY "Authenticated users can upload app logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'app_logos');

CREATE POLICY "Users can update own app logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner);

CREATE POLICY "Users can delete own app logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner);

-- Set up security policies for app_screenshots bucket
CREATE POLICY "Public can view app screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app_screenshots');

CREATE POLICY "Authenticated users can upload app screenshots"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'app_screenshots');

CREATE POLICY "Users can update own app screenshots"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner);

CREATE POLICY "Users can delete own app screenshots"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner);