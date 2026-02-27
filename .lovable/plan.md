# Definitieve Refactor – Admin Dashboard Vinster

## Entry Events als Single Source of Truth

---

# 🎯 Doel

Het admin-dashboard wordt volledig herbouwd zodat **alle toegangsstatistieken uitsluitend gebaseerd zijn op `entry_events`**.

Toegang = iemand heeft betaald of een toegangscode gebruikt.  

Niet langer gebaseerd op `profiles.has_paid` of sessie-joins.

Na deze refactor:

- Elke toegang wordt exact 1x geteld

- Stripe vs promo vs organisatie is onderscheidbaar

- Geen hybride logica meer

- Facturatie wordt audit-proof

- Alle widgets gebruiken dezelfde bron

---

# 🔍 Stap 1 — Analyseer en fix orphan profiles

Voer eerst deze controle uit:

```sql

SELECT [u.id](http://u.id)

FROM auth.users u

LEFT JOIN profiles p ON [p.id](http://p.id) = [u.id](http://u.id)

WHERE [p.id](http://p.id) IS NULL;  
  
Als er orphan users bestaan:

&nbsp;

1. Fix structureel de handle_new_user trigger.
2. Maak een veilige backfill voor ALLE missende profiles.
3. Logica bij backfill:
  &nbsp;
  - Als user entry_event heeft → has_paid = true
  - Anders → has_paid = false
  &nbsp;
4. Gebruik metadata uit auth.users waar beschikbaar.

&nbsp;

&nbsp;

⚠️ Geen handmatige losse insert zonder eerst volledige analyse.

&nbsp;

---

&nbsp;

&nbsp;

# **🧱 Stap 2 — Entry Events wordt leidende tabel**

&nbsp;

&nbsp;

Toegang wordt voortaan uitsluitend bepaald door:

&nbsp;

- entry_events.user_id
- entry_events.entry_method
- entry_events.redeemed_at
- entry_[events.org](http://events.org)_id

&nbsp;

&nbsp;

NIET meer gebruiken:

&nbsp;

- profiles.has_paid
- user_organisation_sessions voor toegang
- OR-constructies (has_paid OR code)
- in-memory Sets voor toegang

&nbsp;

&nbsp;

---

&nbsp;

&nbsp;

# **📊 Stap 3 — Nieuwe uniforme KPI-definitie**

&nbsp;

&nbsp;

&nbsp;

## **Uniforme maand-query**

SELECT

  COUNT(DISTINCT e.user_id) AS total_with_access,

  COUNT(DISTINCT e.user_id) FILTER (WHERE e.entry_method = 'stripe_payment') AS via_stripe,

  COUNT(DISTINCT e.user_id) FILTER (WHERE e.entry_method = 'promo_code') AS via_promo,

  COUNT(DISTINCT e.user_id) FILTER (WHERE e.entry_method = 'organisation_access_code') AS via_org

FROM entry_events e

WHERE e.redeemed_at >= :month_start

  AND e.redeemed_at < :month_end;

  


## **Nieuwe accounts in maand**

SELECT COUNT(DISTINCT e.user_id)

FROM entry_events e

JOIN profiles p ON [p.id](http://p.id) = e.user_id

WHERE e.redeemed_at >= :month_start

  AND e.redeemed_at < :month_end

  AND p.created_at >= :month_start

  AND p.created_at < :month_end;

&nbsp;

&nbsp;

# **🧮 Stap 4 — Widgetstructuur (Nieuwe Architectuur)**

&nbsp;

&nbsp;

&nbsp;

## **Widget 1 — Toegang per Maand**

&nbsp;

&nbsp;

Bron: entry_events

&nbsp;

Per maand tonen:

&nbsp;

- Totaal met toegang
- Via Stripe
- Via promo-code
- Via organisatiecode
- Nieuwe profielen (registraties)
- Nieuwe profielen met toegang

&nbsp;

&nbsp;

Unit: DISTINCT user_id

&nbsp;

---

&nbsp;

&nbsp;

## **Widget 2 — Algemeen Vinster Gebruik**

&nbsp;

&nbsp;

Bron: entry_events

&nbsp;

- Totaal gebruikers = DISTINCT users
- Via organisatie = entry_method = ‘organisation_access_code’
- Normaal = stripe_payment + promo_code

&nbsp;

&nbsp;

Geen profiles.has_paid meer.

&nbsp;

---

&nbsp;

&nbsp;

## **Widget 3 — Gebruik per branche / organisatie**

&nbsp;

&nbsp;

Bron: entry_events

&nbsp;

Filter:

WHERE entry_method = 'organisation_access_code'

Groeperen op: 

org_id  
  
per maand: 

COUNT(DISTINCT user_id)

&nbsp;

Unit: **unieke gebruikers**

Niet sessies.

&nbsp;

Header aanpassen naar:

&nbsp;

> Gebruik per branche (unieke gebruikers)

&nbsp;

Parent-type aggregatie blijft via organisation_types hiërarchie.

&nbsp;

---

&nbsp;

&nbsp;

## **Widget 4 — Toegangscodes**

&nbsp;

&nbsp;

Bronnen:

&nbsp;

- entry_events → unieke gebruikers per code
- organisation_access_codes → max_uses, is_active, metadata

&nbsp;

&nbsp;

Unieke gebruikers:

SELECT COUNT(DISTINCT user_id)

FROM entry_events

WHERE entry_method = 'organisation_access_code'

  AND org_id = :org_id

  AND redeemed_at BETWEEN :month_start AND :month_end;

⚠️ Geen gebruik van sessions meer voor toegang.

&nbsp;

Sessions mogen alleen nog gebruikt worden voor gedragsanalyse, niet voor facturatie of toegang.

&nbsp;

---

&nbsp;

&nbsp;

# **🧠 Stap 5 — Gedeelde Helperfunctie**

&nbsp;

&nbsp;

Maak één centrale server-side functie:

&nbsp;

getMonthlyAccessStats(month_start, month_end)

Alle widgets moeten deze functie gebruiken.

&nbsp;

Geen losse filters meer per widget.

&nbsp;

---

&nbsp;

&nbsp;

# **🗑 Stap 6 — Oude logica volledig verwijderen**

&nbsp;

&nbsp;

Verwijderen uit edge function:

&nbsp;

- profiles.has_paid checks
- user_organisation_sessions joins voor toegang
- paidUserIds sets
- usersWithCode sets
- account_kpis response
- entry_kpis aparte blokken
- OR-constructies

&nbsp;

&nbsp;

Frontend:

&nbsp;

- Oude “Nieuwe Accounts” widget
- Oude “Entry Events” widget
- Dubbele state-variabelen

&nbsp;

&nbsp;

---

&nbsp;

&nbsp;

# **📌 Stap 7 — Historische beperking accepteren**

&nbsp;

&nbsp;

Historische data:

&nbsp;

- Oude promo-codes zijn niet onderscheidbaar
- Oude backfill markeert alles als stripe_payment

&nbsp;

&nbsp;

Vanaf refactor-moment:

&nbsp;

- Alle entry_methods worden correct gelogd
- Promo-code en org-code zijn exact te onderscheiden

&nbsp;

&nbsp;

Dit wordt gedocumenteerd als:

&nbsp;

> Pre-refactor periode

&nbsp;

---

&nbsp;

&nbsp;

# **✅ Stap 8 — Validatiechecks na implementatie**

&nbsp;

&nbsp;

Na deploy moet het systeem deze checks doorstaan:

&nbsp;

1. Som van org_stats = general_[stats.org](http://stats.org)
2. general_[stats.total](http://stats.total) = access_[stats.total](http://stats.total)_with_access
3. Geen entry_event zonder profile:

SELECT e.user_id

FROM entry_events e

LEFT JOIN profiles p ON [p.id](http://p.id) = e.user_id

WHERE [p.id](http://p.id) IS NULL;

moet 0 rijen opleveren