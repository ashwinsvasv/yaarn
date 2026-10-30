# Yaarn landing page

Static site: `index.html`, `styles.css`, `script.js`, `favicon.svg`. No build step.

## Before deploying
1. Find-and-replace across this folder:
   - `Yaarn` → your brand name (index.html, script.js)
   - `91XXXXXXXXXX` → your WhatsApp number (script.js)
   - `SITE_URL` → your live domain, e.g. `mybrand.vercel.app` (index.html, after the first deploy)
2. Add `images/sample-1.png` and `images/sample-2.png` (keep each under ~300 KB so WhatsApp previews work).
3. Edit the two sample captions and the Instagram link in `index.html` (search for `EDIT:`).

## Preview locally
```
npx serve .
```
