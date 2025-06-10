/*
  # Create user management functions and triggers

  1. Functions
    - `update_updated_at_column()` - Updates the updated_at timestamp
    - `handle_new_user()` - Creates a public.users record when auth.users is created

  2. Triggers
    - Trigger on auth.users to automatically create public.users record
    - Triggers on public tables to update updated_at timestamps

  3. Security
    - Ensures proper user creation flow
    - Maintains data consistency between auth.users and public.users
*/

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'writer'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure updated_at triggers exist on public tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_submissions_updated_at ON public.app_submissions;
CREATE TRIGGER update_app_submissions_updated_at
  BEFORE UPDATE ON public.app_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();