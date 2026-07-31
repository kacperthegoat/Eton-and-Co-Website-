# Standfast Fencing — Website

Static site for **Standfast Fencing** (Nick Holywell-Walker) — fencing, decking and garden
timbercraft across Norwich and the surrounding villages in Norfolk.

Built from the JB Outdoor Services template and fully rebranded. See
[STANDFAST_REBUILD.md](STANDFAST_REBUILD.md) for the rebuild plan and the outstanding items.

---

## Stack

Plain HTML + Tailwind (browser CDN build) + a small `global.js`. No build step, no dependencies.
Deployed to Vercel.

`global.js` fetches `components/header.html` and `components/footer.html` at runtime and injects
them into the `#header-placeholder` / `#footer-placeholder` divs on every page — so **the nav is
edited in one place only**.

Because the components are fetched over HTTP, opening a page with `file://` renders it without the
header and footer. Serve locally instead:

```
npx serve .
```

---

## Structure

```
index.html                  Home
style.css                   Shared styles (buttons, reveal animations, underlines)
global.js                   Component injection, mobile nav, scroll reveal, header scroll
components/
  header.html               Top bar, logo, mega menu, mobile drawer
  footer.html               Contact block, quick links, credits
pages/
  about.html                Nick's story, commitments, the Standfast standard
  services.html             Service catalogue grid
  gallery.html              Filterable project gallery
  reviews.html              Client reviews (see note below)
  contact.html              Enquiry form, service-area map, FAQ
  privacy-policy.html
  thank-you.html            Form success page (noindex via robots.txt)
  process_form.html
  services/                 One page per service (9)
assets/imgs/
  service_imgs/<Service>/   Per-service photo folders
  hero_slider/              Home hero slideshow images
```

---

## Brand

| Token | Value |
|---|---|
| Primary / dark | `#000000` |
| Accent (timber) | `#C98756` |
| Secondary (green) | `#0D7F15` |
| Light background | `#F5F3EE` |
| Headings | Playfair Display |
| Body | DM Sans |

Colours are declared in a Tailwind `@theme` block that is **duplicated inline in every HTML file**
(`--color-brand-dark`, `--color-brand-bronze`, `--color-brand-green`, …). Change one, change all —
a scripted find/replace is the practical way to do it.

---

## Contact form

Both `index.html` and `pages/contact.html` POST to a Google Apps Script web app via a `GAS_URL`
constant.

**`GAS_URL` is currently the placeholder `REPLACE_WITH_NEW_APPS_SCRIPT_EXEC_URL`.** The form will
not submit until a new Google Sheet + Apps Script web app is created on Nick's Google account and
its `/exec` URL is pasted into both files. The old JB endpoint has been removed so enquiries cannot
reach the previous client.

Apps Script to deploy (Extensions → Apps Script on a new Sheet):

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  sheet.appendRow([
    new Date(),
    data.name    || '',
    data.email   || '',
    data.phone   || '',
    data.service || '',
    data.message || '',
    data.source  || ''
  ]);
  return ContentService.createTextOutput('OK');
}
```

Deploy → New deployment → Web app → Execute as **Me**, Who has access **Anyone**. Copy the `/exec`
URL into `GAS_URL` in both files.

The CSP in `vercel.json` already allows `script.google.com` for `connect-src` and `form-action`.

---

## Reviews

`pages/reviews.html` ships with **no testimonials**. The previous site's reviews belonged to JB
Outdoor Services and were removed rather than re-attributed. The page contains a commented
`review-card` template — paste one block per genuine review, then delete the `#no-reviews-yet`
block.

---

## Images

All photography currently in `assets/imgs/` is placeholder material from the previous site. Every
image needs replacing with Nick's own photos, along with the favicons (`favicon*.png`,
`apple-touch-icon.png`, `android-chrome-*.png`), `assets/imgs/logo.png`, `logo-hovered.png` and
`assets/imgs/og-image.jpg` (1200×630).

Service pages point at `assets/imgs/service_imgs/<Service>/` — drop new photos into the matching
folder and update the `<img src>` list in each page.

---

## Deployment

Vercel, static, no build command. `vercel.json` sets the security headers and CSP; `sitemap.xml`
and `robots.txt` reference `https://www.standfastfence.com`.
