-- Clean up orphan entry_event for user that no longer exists in auth.users
DELETE FROM public.entry_events 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Also clean up orphan user_organisation_sessions
DELETE FROM public.user_organisation_sessions
WHERE user_id NOT IN (SELECT id FROM auth.users);