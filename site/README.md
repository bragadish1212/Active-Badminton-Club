# ABC Frankfurt website

One-page, bilingual (EN/DE) site. Upload the whole `site` folder to the web host; `index.html` is the start page.

## Files
- `index.html` – all page content. Every text appears twice: `<span class="l-en">…</span><span class="l-de">…</span>`.
- `styles.css` – design. Fonts are self-hosted from `fonts/` (Archivo, SIL Open Font License, see `fonts/OFL.txt`).
- `script.js` – language switch, schedule switch, "Tonight at ABC", ABC Open countdown, trial form.
- `img/` – logo, photos, gallery, and `img/instagram/` for the Instagram tiles.

## Common updates
- **Trial form:** set `FORM_ENDPOINT` near the top of the form section in `script.js` (e.g. your Formspree link). While empty, the form opens the visitor's email app.
- **ABC Open dates:** change `data-start` / `data-end` on `#open-count` in `index.html`, plus the two date lines under it.
- **Winter/summer switch dates:** `abcSeason()` in `script.js` (currently April–September = summer).
- **Playing times:** edit the `<li>` rows in the schedule. `data-when` = all/winter/summer, `data-days` = weekday numbers (0 = Sunday … 6 = Saturday). "Tonight at ABC" reads these rows automatically.
- **Instagram tiles:** save the new post image into `img/instagram/`, then update the tile's link, image, date and caption in `index.html`.
- **Language links:** `?lang=de` or `?lang=en` on the URL opens the page in that language.
