
# Exporteer betalende e-mailadressen als CSV

## Wat wordt gebouwd

Een "Export betalende gebruikers" knop op de Admin Portal pagina die:
1. Via de bestaande `admin-organisation-stats` edge function (of een directe query) de e-mailadressen ophaalt
2. Een CSV-bestand genereert met alle e-mailadressen van gebruikers met `has_paid = true`
3. Het bestand automatisch downloadt

## Aanpak

Omdat `profiles` en `auth.users` niet direct vanuit de frontend te joinen zijn (RLS beperkt tot eigen profiel), wordt een **nieuwe edge function** `export-paying-users` aangemaakt die met service role:
- `auth.admin.listUsers()` ophaalt
- Filtert op gebruikers wiens profiel `has_paid = true` heeft
- De e-mailadressen als JSON teruggeeft

De frontend bouwt hiervan een CSV en triggert de download.

## Bestanden

1. **Nieuw:** `supabase/functions/export-paying-users/index.ts` -- edge function die met service role de e-mails ophaalt
2. **Wijzig:** `supabase/config.toml` -- registreer de nieuwe edge function
3. **Wijzig:** `src/pages/AdminPortal.tsx` -- voeg een "Export e-mails" knop toe

## Technische details

### Edge function (`export-paying-users`)
- Gebruikt service role om `profiles` te queryen waar `has_paid = true`
- Jooint met `auth.users` via `supabase.auth.admin.listUsers()` om e-mails op te halen
- Retourneert JSON array met e-mailadressen

### Frontend (AdminPortal.tsx)
- Nieuwe knop "Export betalende e-mails (CSV)"
- Bij klik: roept edge function aan, ontvangt e-mail lijst, genereert CSV blob, triggert download
- Toont loading state tijdens ophalen
