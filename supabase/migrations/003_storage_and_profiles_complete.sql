-- Add missing profile columns if profiles table already exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_path TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type TEXT;

-- Ensure INSERT policy exists for public.profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile.'
  ) THEN
    CREATE POLICY "Users can insert their own profile."
      ON public.profiles
      FOR INSERT
      WITH CHECK ( auth.uid() = id );
  END IF;
END $$;

-- Create private profile-pictures storage bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for profile-pictures bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can upload their own profile pictures'
  ) THEN
    CREATE POLICY "Users can upload their own profile pictures"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can view their own profile pictures'
  ) THEN
    CREATE POLICY "Users can view their own profile pictures"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can update their own profile pictures'
  ) THEN
    CREATE POLICY "Users can update their own profile pictures"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can delete their own profile pictures'
  ) THEN
    CREATE POLICY "Users can delete their own profile pictures"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
