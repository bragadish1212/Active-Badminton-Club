# ABC Frankfurt website

One-page, bilingual (EN/DE) site. Upload the whole `site` folder to the web host; `index.html` is the start page.

## Files
- `index.html` – all page content. Every text appears twice: `<span class="l-en">…</span><span class="l-de">…</span>`.
- `styles.css` – design. Fonts are self-hosted from `fonts/` (Archivo, SIL Open Font License, see `fonts/OFL.txt`).
- `script.js` – language switch, schedule switch, "Tonight at ABC", ABC Open countdown, trial form.
- `img/` – logo, photos, gallery, and `img/instagram/` for the Instagram tiles.
- `impressum.html`, `datenschutz.html`, `satzung.html` – legal pages (German only), served as /impressum, /datenschutz and /satzung.
- `vercel.json` – clean URLs and redirects from the old WordPress addresses (e.g. /join-abc → /#join). Keep this file in the same folder as `index.html`.

## Common updates
- **Trial form:** sends to Formspree (`https://formspree.io/f/mbgopjgr`). The address is set in two places: `FORM_ENDPOINT` in `script.js` and the form's `action` in `index.html` (used only if JavaScript is off). Change both if you ever switch forms. The hidden `_gotcha` field is Formspree's spam trap; leave it empty and hidden.
- **ABC Open dates:** change `data-start` / `data-end` on `#open-count` in `index.html`, plus the two date lines under it.
- **Winter/summer switch dates:** `abcSeason()` in `script.js` (currently April–September = summer).
- **Playing times:** edit the `<li>` rows in the schedule. `data-when` = all/winter/summer, `data-days` = weekday numbers (0 = Sunday … 6 = Saturday). "Tonight at ABC" reads these rows automatically.
- **Instagram tiles:** save the new post image into `img/instagram/`, then update the tile's link, image, date and caption in `index.html`.
- **Language links:** `?lang=de` or `?lang=en` on the URL opens the page in that language.

## Editing text on GitHub
1. Open the file in the repo (e.g. `site/index.html`) and click the pencil icon.
2. Ctrl+F for the sentence. Each text appears twice: inside `<span class="l-en">…</span>` (English) and `<span class="l-de">…</span>` (German). Change only the words between the tags.
3. Click **Commit changes**. Vercel publishes the change in about a minute. To undo, open the file’s **History** and restore an earlier version.
