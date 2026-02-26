
## Organisation Code System on Branch Pages

This plan adds an optional code input field on branch landing pages, updates badge logic, and extends the admin panel for full organisation/code management.

### Current State

The system already has:
- `organisation_types` table (acts as both branches and specific orgs via `parent_type_id` and `is_unique`)
- `organisation_access_codes` table (codes linked to an org type)
- `user_organisation_sessions` table (tracks which users used which org)
- `validate-organisation-code` Edge Function
- Badge showing org name in `RondeDashboard` when `isOrganisationMode` is active
- Code input only on specific org pages (is_unique=true), NOT on branch pages

### What Changes

**1. Code input on branch pages (`OrganisatieLanding.tsx`)**

Add an optional code field below the "Start het traject" button on category/branch pages (is_unique=false):
- Label: "Heeft u een organisatiecode? Voer hem hier in"
- Placeholder: "bijv. molewaterplein"
- Helper: "Geen code? Sla dit over en ga gewoon door."
- "Bevestig code" button
- On valid code: store the linked organisation in context (with the org name for badge), then navigate to intro
- On invalid: inline error "Deze code is niet bekend."
- The existing "Start het traject" button remains as-is for users without a code

**2. Badge logic update**

The badge already exists in `RondeDashboard.tsx` (line 301-306). Currently it shows whenever `isOrganisationMode && organisationName`. The new logic:

| Situation | Badge |
|---|---|
| No code entered, started via "Start het traject" | Branch name (e.g. "Medisch Centrum") -- already works this way |
| Valid code for a general subscription org (is_unique=false) | Branch name |
| Valid code for a custom org (is_unique=true) | Organisation name (e.g. "ErasmusMC") |

This already works correctly because:
- Free start sets `name: orgType.name` (branch name)
- Code validation sets `name: data.organisation?.name` (the specific org name)

No badge logic changes needed -- it already shows the right name based on how context was set.

**3. `validate-organisation-code` Edge Function update**

Currently the function looks up codes and returns the linked `organisation_type`. It needs a small enhancement: also return the **parent branch info** so the frontend knows the branch context when a code links to a child org. Also, the function should also work when called from a branch page -- it must validate that the code belongs to the branch or one of its children.

Add an optional `branch_slug` parameter. When provided, validate the code belongs to that branch or a child of that branch.

**4. Admin Panel -- "Organisaties & Codes" section**

This is the biggest new piece. Add a new admin page `/admin/organisaties` with:

**4a. Organisation overview table:**
- Organisatienaam, Type (Custom/Algemeen), Branche, Aantal codes, Gebruik deze maand, Gebruik totaal

**4b. Per organisation detail (expandable row):**
- All codes linked to this org
- Per code: code string, total uses, uses this month, active/inactive
- "Code toevoegen" button

**4c. Add new organisation:**
- "Nieuwe organisatie toevoegen" button
- Form: name, type (Custom/Algemeen = is_unique true/false), branch (dropdown of parent types), first code (optional)

**4d. No user list changes** -- the existing admin page already shows user counts per org via the stats Edge Function.

### Technical Details

**Files to modify:**

1. **`src/pages/OrganisatieLanding.tsx`** -- Add optional code input section to the category view (is_unique=false block). Add state for code/error/validating. Add `handleCodeSubmit` that calls `validate-organisation-code` with the branch slug for validation. On success, set organisation context with the resolved org name and navigate to intro.

2. **`supabase/functions/validate-organisation-code/index.ts`** -- Accept optional `branch_slug` parameter. When provided, after finding the code, verify the code's `organisation_type_id` matches the branch or is a child of that branch. Also return `parent_branch` info in the response.

3. **`src/pages/AdminPortal.tsx`** -- Add a third card "Organisaties & Codes" linking to `/admin/organisaties`.

4. **New file: `src/pages/AdminOrganisaties.tsx`** -- Full CRUD page for organisations and codes:
   - Table listing all organisation_types that have a parent (i.e. specific orgs)
   - Expandable rows showing linked codes
   - "Nieuwe organisatie" form (creates a new organisation_type with is_unique + parent_type_id)
   - "Code toevoegen" per org (calls generate-organisation-code)
   - Usage stats per org (from existing admin-organisation-stats data)

5. **`src/components/AppRouter.tsx`** -- Add route for `/admin/organisaties`.

6. **No database migration needed** -- the existing tables already support this structure. `organisation_types` with `is_unique` and `parent_type_id` maps exactly to the spec's `is_custom` and `branch` fields. `organisation_access_codes` maps to `organisation_codes`.

7. **`supabase/functions/admin-organisation-stats/index.ts`** -- Minor update to also return per-org code details for the new admin page (or the new admin page can call the existing function + do its own queries).

### Existing ErasmusMC Compatibility

ErasmusMC already exists as `organisation_types` with `is_unique=true`, `parent_type_id` pointing to "Medisch Centrum", and code "MoleWaterPlein3015" in `organisation_access_codes`. No changes needed -- it will appear naturally in the new admin panel and the code will work on the Medisch Centrum branch page.
