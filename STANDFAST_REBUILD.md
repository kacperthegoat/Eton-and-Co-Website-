# Standfast Fencing — Rebuild Plan

Converting the duplicated **JB Outdoor Services** site into **Standfast Fencing**.

> **Status: rebuild done, awaiting assets.** All copy, colours, structure, nav, schema, sitemap
> and the service-page set have been rebuilt. What remains is listed under
> [§8 Outstanding](#8-outstanding-before-launch) — chiefly photos, logo/favicons, the form
> endpoint, and real reviews.

---

## 1. Client Information (source of truth)

| Field | Value |
|---|---|
| Business name | Standfast Fencing |
| Contact name | Nick Holywell-Walker |
| Email | standfastfence@gmail.com |
| Phone | 07976 222991 (`tel:+447976222991`) |
| Address | 10 West End Avenue, Brundall, Norwich |
| Opening hours | No set hours |
| Service area | Norwich and surrounding villages, Norfolk |
| Current site | www.standfastfence.com ("rough and ready" placeholder — to be replaced) |
| Facebook | https://www.facebook.com/profile.php?id=61582059986527 |

**Business description (client's own words):**
> We're a fencing + decking + garden timbercraft team, creating high quality, sustainably sourced installations — with a conscientious, friendly and reliable team — serving Norwich and surrounding villages. We can take care of tree + shrub clearance + preparing the garden for the job, and we are licensed waste carriers. We always aim to surpass expectations, leave a beautifully finished job and a clean + tidy site.

**Services offered:** Fencing · Picket fence · Dog + deer fence · Gates · Decking · Sheds · Pergolas · Arbors · Trellises · Raised beds · Sleeper construction

**Selling points to work into copy:** sustainably sourced timber · licensed waste carriers · tree + shrub clearance and garden prep included · clean and tidy site · conscientious, friendly, reliable.

---

## 2. Branding

| Item | Old (JB) | New (Standfast) |
|---|---|---|
| Primary dark | `#141229` | `#000000` |
| Accent | `#e8b01e` (gold) | `#C98756` (warm tan/timber) |
| Secondary | — | `#0D7F15` (green) |
| Light bg | `#F5F3EE` | keep `#F5F3EE` (works with warm palette) |
| Heading font | Playfair Display (serif) | **Modern sans** — see note |
| Vibe | Dark/premium | **Warm**, simple, clean |

Font note: the brief says "Modern" + the inspiration site (dgooch.co.uk) uses a clean humanist serif for headings with a light sans body. Recommendation: keep a two-font system but swap Playfair for something warmer and less formal — e.g. headings in a modern serif/grotesk, body stays DM Sans. Needs a quick decision before the global find/replace.

**Inspiration:** https://dgooch.co.uk/product-category/fencing/ — "Simple, clear, visually appealing." Key takeaways from the screenshots:
- Light/white background, minimal chrome, lots of whitespace.
- Slim white header: logo left, email + phone + hamburger right (no heavy dark bar).
- Hero = full-bleed photo, script/display headline, contact form card floated right in the hero itself.
- Horizontal scrolling image strip for the range/gallery.
- FAQ column on the left with a "Get In Touch" form beside it.

This is a **lighter, warmer** design than the current dark `#141229` site. Decision needed: do we re-skin to light/white (closer to inspiration, more work) or keep the current dark structure with new warm colours (faster)? My recommendation: **go light** — it's what he pointed at, and the current layout supports it.

---

## 3. Page structure

Client ticked: Home, About Us, Services/Products, Gallery, Contact, Testimonials/Reviews. **Booking is NOT needed.**

### Keep / rework
| Page | Action |
|---|---|
| `index.html` | Rework — hero, services grid, FAQ, reviews, contact CTA |
| `pages/about.html` | Rework — Nick's story, sustainability, licensed waste carrier |
| `pages/services.html` | Rework — new service list |
| `pages/gallery.html` | Rework — new photos |
| `pages/contact.html` | Rework — new details, new form endpoint |
| `pages/privacy-policy.html` | Update business name/contact |
| `pages/thank-you.html` | Update branding |
| `pages/process_form.html` | Update / verify against new form backend |

### New — Testimonials page
Client wants a Testimonials/Reviews page. Currently reviews only exist as inline sections on the home page. **Need from client:** actual reviews/testimonials, or a Google Business Profile link. If neither exists yet, we build the page shell and hold it back from the nav until he supplies content.

### Service pages — delete 18, build ~9
**Delete all of these** (`pages/services/`): general-landscaping, site-clearances, unseasoned-logs, firewood, professional-turfing, reduce-digging-levelling, patios, full-garden-transformation, seasoned-firewood, groundworks-footings, concrete-pads, gravel-driveways, retaining-walls, digger-hire, hedge-removals, drainage-solutions, wholesale-firewood. Keep `fencing.html` as the template to clone (rewrite content).

**Build these:**
1. `fencing.html` — main/closepost fence panels (hub page)
2. `picket-fencing.html`
3. `dog-deer-fencing.html`
4. `gates.html`
5. `decking.html`
6. `sheds.html`
7. `pergolas-arbours.html` (pergolas + arbors together)
8. `trellises.html`
9. `raised-beds-sleepers.html` (raised beds + sleeper construction)

Plus a short section (not a full page) on **garden prep / tree + shrub clearance + waste removal** — it's a supporting service, best placed on the About page and as a strip on the home page.

Note: `header.html` links to `/pages/services/decking.html` which does not currently exist — that broken link gets fixed by this rebuild.

---

## 4. Backend / technical work

The site is static HTML + Tailwind (CDN) + a small `global.js` that injects `components/header.html` and `components/footer.html`.

| # | Item | Detail |
|---|---|---|
| 1 | **Contact form endpoint** | `GAS_URL` (Google Apps Script) is hardcoded in `index.html:2293` and `pages/contact.html:188` and still posts to JB's script/sheet. Needs a **new Apps Script + new Google Sheet under Standfast's account**, then swap both URLs. This is the single most important backend item — until it's changed, every enquiry goes to the old client. |
| 2 | **Domain / canonicals** | 209 hardcoded `https://www.jboutdoorservices.co.uk` URLs across canonicals, og:url, og:image, sitemap. Global replace with the new domain (`standfastfence.com`? confirm — he owns it already). |
| 3 | **Schema.org JSON-LD** | Every page has a `LocalBusiness` block: name, url, logo, telephone, email, address (Wincanton/Somerset), **lat/long (51.0557, -2.4041)**, geoRadius, opening hours, `sameAs` Facebook. All need rewriting for Brundall/Norwich (approx lat 52.6203, long 1.4364) and "no set hours" (drop the openingHoursSpecification or use a generic by-appointment note). |
| 4 | **Favicons / manifest** | `favicon.ico`, `favicon-16/32`, `apple-touch-icon`, `android-chrome-192/512`, `site.webmanifest` — all still JB. Regenerate from Standfast logo. |
| 5 | **`sitemap.xml`** | 24 JB references; must be regenerated for the new page set (services pages change from 18 → 9, plus testimonials). |
| 6 | **`robots.txt`** | Update sitemap URL. |
| 7 | **`vercel.json`** | CSP is fine as-is; confirm `script-src`/`connect-src`/`form-action` still allow `script.google.com` after the new Apps Script URL. |
| 8 | **`_redirects` / `_headers`** | Review; add redirects from any old standfastfence.com URLs so existing links don't 404. |
| 9 | **Google review QR** | `assets/imgs/qrcode.png` points at JB's Google review link (also hardcoded in `header.html`). Either regenerate for Standfast's Google Business Profile or remove the section. |
| 10 | **Facebook links** | `web.facebook.com/jbw1999` → new profile URL (3 places + header/footer). |
| 11 | **OG image** | `assets/imgs/og-image.jpg` needs replacing (1200×630, Standfast branded). |
| 12 | **Tailwind theme block** | The `@theme` colour variables are duplicated inline in **every** HTML file. Recommend extracting to one shared block or scripting the replace so colours stay consistent. |
| 13 | **Stray files** | Root is littered with one-off scripts (`fix_ctas.py`, `fix_privacy*.py`, `generate_reviews.py`, `update_hero_slider.py`, `create_slider_imgs.py`, `groundworks and drainage.textClipping`, `scratch/`). Clean these out. |
| 14 | **Old images** | 34 files in `assets/imgs` plus `hero_slider/` and `service_imgs/` — all JB's landscaping/firewood work. All to be replaced with your new Standfast photos; delete anything unused so it doesn't ship. |
| 15 | **Deploy** | Confirm it goes back to Vercel and which project/domain, so DNS for standfastfence.com is pointed correctly at cutover. |

---

## 5. Content still needed from you / the client

- [ ] **Logo** — vector or high-res PNG (light + dark variants if possible), for header, footer, favicons, OG image
- [ ] **Photos** — you said you have these. Ideally: 1 hero shot, 2–3 per service page, 15–25 for the gallery. Landscape, high-res, ideally named per service
- [ ] **Testimonials** — real quotes with first name + area, or a Google Business Profile link
- [ ] **Domain confirmation** — is standfastfence.com staying, and who controls DNS
- [ ] **Google account** for the new form Sheet + Apps Script (and Google Business Profile if one exists)
- [ ] **Any accreditations** — licensed waste carrier registration number, insurance, trade memberships (good trust signals)
- [ ] **Copy checks** — does he want prices/"from £X" anywhere, or quote-only
- [ ] **Design direction sign-off** — light re-skin vs. keep dark (see §2)

---

## 6. Order of work

1. **Design decision** (light vs dark) + font pick — everything downstream depends on this.
2. **Global find/replace pass** — name, phone, email, address, domain, Facebook, colours, fonts. Scripted, one pass, all files.
3. **Header + footer rebuild** — nav restructured to the new page set (single source of truth, so do it early).
4. **Delete the 17 dead service pages**, clone `fencing.html` into the 9 new ones.
5. **Write copy** — home, about, each service page, FAQ, meta descriptions/titles.
6. **Backend swap** — new Apps Script + Sheet, update both `GAS_URL`s, test a real submission end to end.
7. **Images** — drop in new photos, replace favicons/OG, rebuild the hero slider and gallery.
8. **SEO pass** — schema, sitemap, robots, canonicals, alt text.
9. **QA** — every link, mobile, form submission, Lighthouse.
10. **Deploy + DNS cutover.**

---

## 7. Highest-risk items

1. `GAS_URL` still points at JB's sheet — enquiries would silently go to the wrong business.
2. `header.html`/`footer.html` are fetched at runtime; a path or nav mistake there breaks navigation site-wide.
3. Leftover JB text is easy to miss — do a final `grep -ri "jb\|outdoor services\|wincanton\|somerset\|jboutdoor"` before launch.
4. Old JB photos accidentally shipping in the gallery or service pages.

---

## 8. Outstanding before launch

Everything in §1–§6 above has been implemented. These are the items that could not be completed
without assets or accounts from you or Nick.

### Blocking

1. **Contact form endpoint.** `GAS_URL` in [index.html](index.html) and
   [pages/contact.html](pages/contact.html) is now the placeholder
   `REPLACE_WITH_NEW_APPS_SCRIPT_EXEC_URL`. JB's endpoint has been removed, so **the form does not
   submit at all right now**. Create a new Sheet + Apps Script web app on Nick's Google account
   (script is in the README) and paste the `/exec` URL into both files.
2. **Logo and favicons.** `assets/imgs/logo.png` and `logo-hovered.png` are still JB's, as are
   `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`,
   `android-chrome-192x192.png` and `android-chrome-512x512.png`.
3. **OG share image.** `assets/imgs/og-image.jpg` is still JB's. Needs a 1200×630 Standfast image.
4. **Domain / DNS.** Everything canonicalises to `https://www.standfastfence.com`. Confirm Nick
   controls it and point DNS at the Vercel project at cutover.

### Photos

All of JB's unused images were deleted (210 files). What remains is a small placeholder set:

- `service_imgs/Fencing/` — 12 images, used across the fencing pages and the gallery
- `service_imgs/Decking/` — 4 images, used across the decking/structures pages
- `hero_slider/` — 5 home hero images
- `c4`, `c6`, `c9`, `c13`, `footer1`, `footer2` — used in CTA bands

Empty folders with a README have been created for the services with no photos yet:
`Picket Fencing`, `Dog and Deer Fencing`, `Gates`, `Sheds`, `Pergolas and Arbours`, `Trellises`,
`Raised Beds and Sleepers`. Those pages currently reuse the fencing/decking placeholders. Drop new
photos in and update the `<img src>` list in each page under `pages/services/`.

The home page before/after slider is marked with a `TODO` comment — it needs a genuine
before/after pair.

### Reviews

JB's ten Google reviews were **removed, not rewritten** — they were real reviews from real named
customers of a different business, and re-attributing them to Standfast would have been fabricated
social proof. The same applies to the "5-Star Google Rated" badges, the review QR code and the
Google review CTA, all of which are gone.

In their place:
- The home page now has a "Why Standfast" panel built from Nick's own stated selling points.
- [pages/reviews.html](pages/reviews.html) is a working page with a commented `review-card`
  template and a "send us your feedback" prompt. Paste in real reviews and delete the
  `#no-reviews-yet` block.

Ask Nick whether he has a Google Business Profile — if so we can swap in a live reviews embed.

### Claims to verify with Nick

The old site made specific claims that have been softened rather than carried over, because they
were JB's, not Nick's:

- "8+ / 10+ years experience" — replaced with non-numeric statements. Put the real figure back if
  Nick has one.
- "Fully insured" — kept, on the assumption it is true. Confirm.
- "Licensed waste carrier" — Nick stated this himself, so it is used prominently. Worth adding the
  registration number as a trust signal.
- Service area — set to "Norwich and surrounding villages" (his words). The old "10-mile radius"
  framing and the Somerset village list are gone; the contact-page map now centres on Brundall with
  a Norfolk village ticker.

### Design note

The site kept its existing dark structure with the palette swapped to Nick's black `#000000` /
timber `#C98756` / green `#0D7F15`. The dgooch inspiration site is light and white-backgrounded —
if you want to go that way it is a separate re-skin pass, not a colour swap.
