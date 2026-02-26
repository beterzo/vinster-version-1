

## Security Fix: Prevent client-side `has_paid` manipulation

### The Vulnerability
The `profiles` table has an UPDATE RLS policy that allows authenticated users to update ANY column on their own row, including `has_paid`. This means any user can bypass the paywall by running a simple PATCH request from DevTools.

### The Fix
Use a **database trigger** that prevents any non-service-role user from changing `has_paid`. This is the safest approach because:
- Column-level GRANT/REVOKE can be tricky with Supabase migrations
- A trigger is explicit, easy to audit, and works regardless of how the update is made
- It preserves the existing UPDATE policy for safe columns (first_name, last_name, language, etc.)

### Changes

**1. Database migration: Add a protection trigger**

Create a trigger function that checks if `has_paid` is being changed. If the caller is not using the `service_role` (i.e., it's a regular authenticated user via the client), the trigger silently resets `has_paid` to the old value, preventing manipulation.

```sql
CREATE OR REPLACE FUNCTION public.protect_has_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If has_paid is being changed and the caller is NOT service_role,
  -- silently revert the change
  IF NEW.has_paid IS DISTINCT FROM OLD.has_paid THEN
    -- Check if current role is the service_role (used by Edge Functions)
    IF current_setting('role') != 'service_role' THEN
      NEW.has_paid := OLD.has_paid;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_has_paid_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_has_paid();
```

**No other file changes needed.** The existing Edge Functions (`verify-payment`, `stripe-webhook`) already use `SUPABASE_SERVICE_ROLE_KEY` to update `has_paid`, so they will continue to work. Only client-side attempts to change `has_paid` will be blocked.

### Before / After

| Scenario | Before | After |
|---|---|---|
| User runs `update({ has_paid: true })` from DevTools | Succeeds -- paywall bypassed | `has_paid` silently stays `false` |
| Edge Function sets `has_paid = true` via service role | Works | Works (unchanged) |
| User updates `first_name` or `language` | Works | Works (unchanged) |

### Also protected by this pattern
The same trigger also protects against future columns that might be sensitive on `profiles`. If needed, additional columns (like AI-generated fields) can be added to the trigger guard.

