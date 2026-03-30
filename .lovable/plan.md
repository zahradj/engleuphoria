

## Plan: Fix n8n-bridge Authorization for Content Creators

### Problem
The `n8n-bridge` edge function (line 42-53) checks `users.role === 'admin'` and returns 403 for any other role. The user `f.zahra.djaanine@gmail.com` has role `content_creator`, so the function rejects the request with "Admin access required", which surfaces as "Edge Function returned a non-2xx status code".

### Fix

**File: `supabase/functions/n8n-bridge/index.ts`** (lines 42-53)

Change the role check to allow both `admin` and `content_creator` roles:

```typescript
// Current (broken):
if (userError || !userData || userData.role !== "admin") {

// Fixed:
const allowedRoles = ["admin", "content_creator"];
if (userError || !userData || !allowedRoles.includes(userData.role)) {
```

This is a single-line change in the edge function. The function will be auto-deployed after the edit.

### Technical Details

| Item | Detail |
|---|---|
| Root cause | `n8n-bridge` line 48: strict `=== "admin"` check excludes `content_creator` |
| User's role | `content_creator` in both `users.role` and `user_roles` table |
| Fix | Allow `["admin", "content_creator"]` roles to access lesson generation |

