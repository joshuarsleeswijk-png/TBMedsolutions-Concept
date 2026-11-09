# TB Medsolutions website

- `site/` bron: index.html (de hele app), assets, brochures, tools (build.js prerendert naar dist).
- `dist/` voorgerenderde site die Netlify publiceert (63 routes, sitemap, robots, _redirects, netlify.toml met cache-headers).

Wijziging maken: pas `site/index.html` aan, draai `node site/tools/server.js` en `node site/tools/build.js` (zie site/README.md), commit `dist/` mee.
