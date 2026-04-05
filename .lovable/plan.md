

# Fix Profile Save, Mandatory Uploads, Photo Instructions, and Logo Everywhere

## Problem Analysis

### 1. Profile Save Still Failing
After tracing through ~10+ migrations touching `teacher_profiles` RLS policies, the table has accumulated **multiple overlapping and potentially conflicting policies** from different migration waves. Key findings:
- Migration `20250914225913` creates a `FOR ALL` policy with `WITH CHECK`
- Migration `20250914230448` creates ANOTHER `FOR ALL` policy (without `CREATE POLICY IF NOT EXISTS`)
- Multiple audit triggers (`audit_teacher_profiles`, `enhanced_audit_teacher_profiles`) both fire on INSERT
- The `trigger_security_audit` function and `log_security_audit` function are both attached, potentially causing conflicts

**Root cause**: Accumulated duplicate/conflicting RLS policies. PostgreSQL can behave unpredictably when multiple overlapping policies exist for the same role and operation.

### 2. Certificates/Photo Not Mandatory
Line 316 says "Certificates & Documents (Optional)" and line 206 `canSubmit` only checks `bio` and `videoUrl`.

### 3. No Logo in School OS Pages
- **TeacherTopNav**: Shows a `GraduationCap` icon + "School OS" text instead of the Engleuphoria logo
- **AdminSidebar**: Shows a generic emoji icon + "Control Tower" text
- **AdminHeader**: Shows "Admin Dashboard" text only
- **StudentSidebar**: No logo present
- **MinimalStudentHeader**: No logo present

---

## Plan

### Step 1: Database Migration -- Clean RLS Policies

Create a migration that:
- **Drops ALL existing** `teacher_profiles` policies by name (list every known policy name from all migrations)
- **Recreates exactly 3 clean policies**:
  - `"Teachers can manage own profile"` FOR ALL with `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())`
  - `"Authenticated users can view approved teachers"` FOR SELECT with proper conditions
  - `"Admins can manage all teacher profiles"` FOR ALL using `public.has_role(auth.uid(), 'admin')` (avoids querying `users` table which has its own RLS)

### Step 2: Fix ProfileOnboardingModal.tsx -- Robust Save + Mandatory Uploads

- **Better error logging**: Add `.select()` to the insert call and log the actual error object to help debug
- **Mandatory photo**: Add validation that `profileImageUrl` is set before submission
- **Mandatory certificates**: Add validation that `certificateUrls` has at least one entry
- **Update labels**: Change "Certificates & Documents (Optional)" to "Certificates & Documents *" (required)
- **Update `canSubmit`**: Add `formData.profileImageUrl` and `formData.certificateUrls.length > 0` checks
- **Photo instructions**: Add instruction text: "Upload a professional headshot with a plain white background"

### Step 3: Fix ProfileSetupTab.tsx -- Matching Mandatory Requirements

- Mirror the same mandatory photo/certificate checks
- Update the `requiredFieldsComplete` check to include photo and certificates

### Step 4: Update VideoInstructionsModal.tsx -- Photo Guidelines

- Add a new section for "Professional Photo Requirements" with instructions about white background, professional attire, good lighting

### Step 5: Add Engleuphoria Logo to All School OS Pages

Using the existing `Logo` component from `@/components/Logo`, update these files:

| File | Current | Change |
|------|---------|--------|
| `TeacherTopNav.tsx` | GraduationCap icon + "School OS" | Replace with `<Logo size="small" />` |
| `AdminSidebar.tsx` | Emoji + "Control Tower" | Replace header with `<Logo size="small" />` + "Control Tower" subtitle |
| `AdminHeader.tsx` | "Admin Dashboard" text | Add `<Logo size="small" />` before the title |
| `StudentSidebar.tsx` | No logo | Add `<Logo size="small" />` at the top of sidebar |
| `MinimalStudentHeader.tsx` | No logo | Add `<Logo size="small" />` before the avatar |
| `ScrollHeader.tsx` | Already has Logo | No change needed |
| `EnhancedTeacherSidebar.tsx` | Already has Logo | No change needed |
| `CleanWorkspaceHeader.tsx` | Already has Logo | No change needed |

---

## Technical Details

**Migration SQL (Step 1):**
```sql
-- Drop ALL known teacher_profiles policies
DROP POLICY IF EXISTS "teacher_profiles_public_read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_own_write" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Anyone can view approved teacher profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can view their own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can update their own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can update their own profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can create their profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can view their own full profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Public can view approved teacher basic info" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can manage own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Students can view approved teachers for booking" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Admins can manage all teacher profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Authenticated students can view approved teachers" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Public can view approved teacher profiles" ON public.teacher_profiles;

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Clean policy: teachers manage their own profile (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Teachers can manage own profile"
ON public.teacher_profiles FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Clean policy: authenticated users can view approved teachers
CREATE POLICY "Authenticated users can view approved teachers"
ON public.teacher_profiles FOR SELECT TO authenticated
USING (
  profile_complete = true AND can_teach = true AND profile_approved_by_admin = true
);

-- Clean policy: admins can manage all (uses has_role to avoid RLS recursion)
CREATE POLICY "Admins can manage all teacher profiles"
ON public.teacher_profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

**Validation changes (ProfileOnboardingModal.tsx):**
```typescript
const canSubmit = formData.bio.trim() 
  && formData.videoUrl.trim() 
  && isValidVideoUrl 
  && formData.profileImageUrl 
  && formData.certificateUrls.length > 0;
```

**Files to modify:**
1. New Supabase migration (RLS cleanup)
2. `src/components/teacher/dashboard/ProfileOnboardingModal.tsx`
3. `src/components/teacher/ProfileSetupTab.tsx`
4. `src/components/teacher/VideoInstructionsModal.tsx`
5. `src/components/teacher/dashboard/TeacherTopNav.tsx`
6. `src/components/admin/AdminSidebar.tsx`
7. `src/components/admin/AdminHeader.tsx`
8. `src/components/student/StudentSidebar.tsx`
9. `src/components/student/MinimalStudentHeader.tsx`

