
# Fix: Organisatiecodes correct loggen in entry_events

## Root Cause

De `validate-organisation-code` edge function probeert een entry_event te loggen, maar de gebruiker is **niet ingelogd** op het moment van code-invoer (de `/organisaties/:slug` pagina is publiek). Hierdoor is `entryUserId` altijd `null` en wordt de insert overgeslagen.

De `user_organisation_session` wordt pas aangemaakt in `LoginPage.tsx` na inloggen, maar daar wordt geen `entry_event` gelogd. En in `SignupPage.tsx` ontbreekt alle organisatie-logica volledig.

**Resultaat:** `uses_count` stijgt (dat gebeurt in de edge function voor auth-check), maar entry_events krijgt nooit een `organisation_access_code` record.

## Datastroom (huidige situatie)

```text
1. User gaat naar /organisaties/erasmusmc (NIET ingelogd)
2. Voert code in -> validate-organisation-code wordt aangeroepen
3. Edge function: uses_count++ (werkt)
4. Edge function: auth header check -> null -> SKIP entry_event insert
5. Org context wordt opgeslagen in localStorage
6. User navigeert naar /signup of /login
7. LoginPage: user_organisation_sessions.insert (werkt)
8. LoginPage: GEEN entry_event insert (ontbreekt)
9. SignupPage: GEEN org-logica (ontbreekt volledig)
```

## Fix-plan

### Fix 1: entry_event loggen in LoginPage.tsx (na succesvolle login)

Na de bestaande `user_organisation_sessions.insert` op regel 69-73, voeg een `entry_events` insert toe:

```typescript
// Na succesvolle org session insert:
await supabase.from('user_organisation_sessions').insert({ ... });

// Nieuw: log entry_event voor dashboard KPIs
const orgContext = JSON.parse(localStorage.getItem('vinster_organisation_context') || '{}');
await supabase.rpc('insert_entry_event_if_not_exists', {
  // of direct via edge function / service role
});
```

Omdat de `entry_events` tabel geen RLS INSERT policy heeft, moet de insert via een edge function of service-role call gebeuren. De eenvoudigste oplossing: maak de insert direct in de `validate-organisation-code` edge function betrouwbaar, OF voeg een aparte edge function toe.

**Gekozen aanpak:** Voeg de entry_event insert toe aan `LoginPage.tsx` en `SignupPage.tsx` via een nieuwe edge function `log-entry-event` die met service role insert.

### Fix 2: entry_event loggen in SignupPage.tsx (na succesvolle registratie)

SignupPage mist alle organisatie-logica. Toevoegen:
- Na succesvolle signup + org context: `user_organisation_sessions` insert
- Aansluitend: `entry_event` insert via edge function

### Fix 3: Nieuwe edge function `log-entry-event`

Simpele edge function die:
- Auth header valideert (user moet ingelogd zijn)
- Service role gebruikt om in `entry_events` te inserten
- Deduplicatie: checkt of er al een entry_event bestaat voor deze user + org_id + entry_method in dezelfde maand
- Vereiste velden: `user_id`, `entry_method`, `org_id`, `code`

```typescript
// Pseudo-code
const { entry_method, org_id, code } = await req.json();
const user = await getUserFromAuthHeader(req);

// Deduplicatie: niet dubbel loggen in dezelfde maand
const existing = await supabase.from('entry_events')
  .select('id')
  .eq('user_id', user.id)
  .eq('entry_method', entry_method)
  .eq('org_id', org_id)
  .gte('redeemed_at', startOfMonth)
  .lt('redeemed_at', startOfNextMonth)
  .maybeSingle();

if (!existing) {
  await supabase.from('entry_events').insert({
    user_id: user.id,
    entry_method: 'organisation_access_code',  // exact deze string
    org_id,
    code,
    source: 'organisation',
  });
}
```

### Fix 4: validate-organisation-code opschonen

Verwijder de entry_event insert-poging uit de validate-organisation-code edge function (regels 107-128). De uses_count increment blijft, maar het loggen van entry_events wordt verplaatst naar het moment na authenticatie. Dit voorkomt verwarring over waar de insert hoort te gebeuren.

### Fix 5: Backfill bestaande org-sessies

Voor bestaande `user_organisation_sessions` die geen entry_event hebben, voer een eenmalige backfill uit:

```sql
INSERT INTO entry_events (user_id, entry_method, org_id, redeemed_at, source)
SELECT s.user_id, 'organisation_access_code', s.organisation_type_id, s.created_at, 'backfill'
FROM user_organisation_sessions s
LEFT JOIN entry_events e ON e.user_id = s.user_id 
  AND e.entry_method = 'organisation_access_code'
WHERE e.id IS NULL
  AND s.user_id IN (SELECT id FROM profiles);
```

(Momenteel zijn er 0 sessions, maar dit vangt toekomstige inconsistenties op.)

## Bestanden die worden aangepast

1. **Nieuw:** `supabase/functions/log-entry-event/index.ts` - nieuwe edge function
2. **Wijzig:** `src/pages/LoginPage.tsx` - entry_event loggen na org login
3. **Wijzig:** `src/pages/SignupPage.tsx` - org session + entry_event loggen na org signup
4. **Wijzig:** `supabase/functions/validate-organisation-code/index.ts` - entry_event insert verwijderen (verplaatst naar post-auth)
5. **Wijzig:** `supabase/config.toml` - verify_jwt=false voor log-entry-event

## Resultaat na fix

- Elke org-code redemptie door een ingelogde user leidt tot exact 1 entry_event
- Dashboard toont correcte "Via organisatiecode" waarden
- "Gebruik per branche" toont correcte org-specifieke aantallen
- "Toegangscodes > Unieke users" klopt
- Deduplicatie voorkomt dubbele entry_events bij herhaald inloggen
