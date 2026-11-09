# TB Medsolutions website

## Mappen
- `index.html` + `assets/` + `brochures/`: de bron (één pagina-app met echte URL's).
- `dist/` (apart zip-bestand): de gebouwde site. Deze map sleep je in Netlify (Deploys > drag and drop). Elke pagina is daarin als los HTML-bestand voorgebouwd, met eigen title, description, canonical en OG-tags, plus sitemap.xml, robots.txt en _redirects.

## Instellen voor livegang
Bovenaan het script in `index.html` staat `SITE_CONFIG`:
- `gtmId`: Google Tag Manager-container (bijv. GTM-XXXXXXX). Leeg = geen tracking. Tracking laadt pas na "Accepteren" in de cookiebanner (Consent Mode v2). Meta-pixel en GA4 zet je in GTM. Events die de site stuurt: page_view, cta_click, lead_form_open, lead_form_submit, phone_click, whatsapp_click, email_click, resultatenboek_download, lead (op /bedankt).
- `ghlFormUrl`: embed-URL van de GoHighLevel Survey. Zodra ingevuld vervangt de embed het eigen formulier in de modal en op /kennismaking.
- `ghlCalendarUrl`: embed-URL van de GHL-agenda voor /kennismaking/agenda.
- `kvk`, `btw`: komen in de footer en op de contactpagina.
- `callbackTerm`: bijv. "1 werkdag" voor "We bellen je binnen 1 werkdag."
- `googleReviewScore`: bijv. "4,9".

## Formulieren zonder GHL
Zolang `ghlFormUrl` leeg is, gaan alle formulieren naar Netlify Forms (formulier "lead"). Zet in Netlify bij Site configuration > Forms de form detection aan en stel een e-mailnotificatie in. Na verzenden gaat de bezoeker naar /bedankt.

## Opnieuw bouwen na een wijziging in index.html
```
node tools/server.js /pad/naar/site 8787 &
NODE_PATH=$(npm root -g) node tools/build.js
```
Vereist Node en Playwright met Chromium. Of: stuur de nieuwe index.html naar Claude, die bouwt dist opnieuw.


## Gevonden en verwerkt (8 nov 2026)
- KvK 97366676 (TB Medsolutions B.V.) staat in `SITE_CONFIG.kvk`. Btw-nummer nog leeg.
- Google-score 4,9 / 33 reviews (profiel "Bloomea Nederland") in `SITE_CONFIG.googleReviewScore/Count`, met link naar Google Maps.
- Agenda: Calendly van Tamara (`SITE_CONFIG.calendlyBase` + `calendlyEvent` per merk). `/kennismaking/agenda?brand=bloomea|winback` laadt de juiste agenda na een klik (cookies pas na klik). Een GHL-URL in `ghlCalendarUrl` gaat voor.
- Evenementen komen uit `EVENTS` met Calendly-links; events zonder vaste datum hebben `tbd:true` en een `url`.
- Garantie: 2 jaar op fabricagefouten (uit de algemene voorwaarden) als standaard in het zekerheidsblok; per product te overschrijven met `garantie`.

## Google Tag Manager
`tools/gtm-container.json` importeren via GTM > Beheer > Container importeren (samenvoegen). Daarna bij Variabelen `GA4 Measurement ID` en `Meta Pixel ID` invullen, publiceren, en het GTM-ID in `SITE_CONFIG.gtmId` zetten. Tags vuren alleen na cookie-toestemming (Consent Mode v2).
