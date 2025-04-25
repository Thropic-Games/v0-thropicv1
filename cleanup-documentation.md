# Project Cleanup Documentation

This document explains the files that were removed during the cleanup process and the rationale behind each removal.

## 1. Debug and Testing Files

These files were only used for debugging and weren't needed in production:

| File | Purpose | Reason for Removal |
|------|---------|-------------------|
| `app/debug/page.tsx` | General debug page | Debug-only, not needed in production |
| `app/debug/supabase/page.tsx` | Supabase debug page | Debug-only, not needed in production |
| `app/debug/supabase-client/page.tsx` | Supabase client debug page | Debug-only, not needed in production |
| `app/debug/env/page.tsx` | Environment variables debug page | Debug-only, not needed in production |
| `app/debug/environment/page.tsx` | Duplicate environment debug page | Duplicate functionality |
| `app/debug/auth-reset/page.tsx` | Auth reset debug page | Debug-only, not needed in production |
| `app/debug/cleanup/page.tsx` | Cleanup debug page | Debug-only, not needed in production |
| `app/debug/cleanup-firebase/page.tsx` | Firebase cleanup page | No longer needed after Firebase removal |
| `app/debug/donations/page.tsx` | Donations debug page | Debug-only, not needed in production |
| `app/env-debug/page.tsx` | Another environment debug page | Duplicate functionality |
| `components/database-debug.tsx` | Database debugging component | Debug-only, not needed in production |
| `components/donations-debug.tsx` | Donations debugging component | Debug-only, not needed in production |
| `components/env-checker.tsx` | Environment checker component | Debug-only, not needed in production |

## 2. Deprecated or Replaced Components

These components were replaced or are no longer used:

| File | Purpose | Reason for Removal |
|------|---------|-------------------|
| `lib/firebase.ts` | Contains only a dummy auth object | Firebase has been replaced with Supabase |
| `components/auth/auth-form.tsx` | Old authentication form | Replaced by magic link authentication |
| `components/auth/register-form.tsx` | Old registration form | Replaced by magic link signup |
| `components/auth/register-form-simple.tsx` | Duplicate registration form | Redundant with magic link signup |

## 3. Duplicate or Redundant Files

These files had duplicate functionality:

| File | Purpose | Reason for Removal |
|------|---------|-------------------|
| `components/database-donations.tsx` | Donations display component | Replaced by server-donations.tsx |
| `components/cycling-donations.tsx` | Cycling donations display | Duplicate of animated-cycling-donations.tsx |
| `app/api/check-env/route.ts` | Environment check API | Duplicate of supabase-health-check API route |

## 4. Unused Utility Files

These utility files weren't used:

| File | Purpose | Reason for Removal |
|------|---------|-------------------|
| `hooks/use-debounce.ts` | Debounce hook | Not imported in any component |

## Restoration Instructions

If you need to restore any of these files, they have been backed up to the `backup-unused-files-[TIMESTAMP]` directory. Simply copy the files back to their original locations.

## Next Steps

After this cleanup:

1. Test your application thoroughly to ensure nothing was broken
2. Consider consolidating similar components like `featured-games-table.tsx` and `featured-games-mobile.tsx`
3. Review your API routes for further optimization
4. Update any imports that might reference the removed files
\`\`\`

Now, let's create a JavaScript version of the cleanup script for those who prefer to use Node.js:
