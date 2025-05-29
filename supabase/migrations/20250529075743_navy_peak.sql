/*
  # Fix users table RLS policies

  1. Changes
    - Add new RLS policy to allow new user creation during signup
    - This policy allows inserting new users when the inserted ID matches the authenticated user's ID

  2. Security
    - Maintains existing RLS policies for admin access and user data reading
    - Adds secure policy for user creation during signup
*/

-- Add policy to allow users to create their own profile during signup
CREATE POLICY "Users can create their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);