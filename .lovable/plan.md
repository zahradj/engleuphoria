

# Fix: Teacher Profile Submission, Photo Upload, and Certificate Removal

## Problems Identified

1. **Profile submission fails ("Failed to save profile")**: The `upsert` on `teacher_profiles` does an INSERT for new profiles. The `update_teacher_profile_completion` trigger references `OLD` which is NULL on INSERT, potentially causing errors. Additionally, the code sets `profile_complete: true` but the trigger overrides it by recalculating based on bio/video_url fields.

2. **Photo upload not displaying**: The `teacher-certificates` bucket is **private** (`public = false`), so `getPublicUrl()` returns a URL that is not accessible. The bucket also lacks an **UPDATE** storage policy, which the photo upload needs (it uses `upsert: true`).

3. **No option to remove certificates**: The UI has no remove button, and there is no **DELETE** storage policy on the bucket.

## Plan

### Step 1: Database Migration — Fix Storage and Profile Policies

A single migration to:
- Make the `teacher-certificates` bucket **public** so `getPublicUrl()` works for displaying photos and certificates
- Add an **UPDATE** storage policy so teachers can re-upload their profile photo (`upsert: true`)
- Add a **DELETE** storage policy so teachers can remove uploaded certificates
- Fix `update_teacher_profile_completion` trigger to handle INSERT (when `OLD` is NULL) gracefully

### Step 2: Fix ProfileOnboardingModal.tsx — Certificate Removal + Robust Submission

- Add a remove button (X) next to each uploaded certificate that:
  - Deletes the file from Supabase Storage
  - Removes the URL from the local state array
- Improve the `handleSubmit` to handle potential trigger conflicts by not setting `profile_complete` directly — let the trigger handle it, or use a two-step approach (insert first, then update)

### Step 3: Fix Photo Display

- Since making the bucket public resolves the URL issue, the existing `getPublicUrl()` logic will work correctly
- No code changes needed beyond the migration

## Technical Details

**Migration SQL:**
```sql
-- Make bucket public for getPublicUrl() to work
UPDATE storage.buckets SET public = true WHERE id = 'teacher-certificates';

-- Add UPDATE policy for photo re-upload (upsert)
CREATE POLICY "Teachers can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'teacher-certificates'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add DELETE policy for certificate removal
CREATE POLICY "Teachers can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'teacher-certificates'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix trigger to handle INSERT (OLD is NULL)
CREATE OR REPLACE FUNCTION public.update_teacher_profile_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.profile_complete = (
    NEW.bio IS NOT NULL AND NEW.bio != '' AND
    NEW.video_url IS NOT NULL AND NEW.video_url != ''
  );
  RETURN NEW;
END;
$function$;
```

**UI Changes (ProfileOnboardingModal.tsx):**
- Add an `X` button next to each certificate chip that calls `supabase.storage.from('teacher-certificates').remove([filePath])` and updates local state
- Extract the storage file path from the public URL for deletion

