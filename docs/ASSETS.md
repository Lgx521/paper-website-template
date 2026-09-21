# Asset provenance

Retrieved / prepared on 2026-09-21.

## Layout

- Reference: https://embodiment-adaptation.github.io/
- Retained the centered academic header, institutional logo row, resource pills, leading video, abstract, problem, method, simulation / real-world results, takeaways, and citation structure.
- HTML, CSS, JavaScript, and the example pipeline diagram were implemented for this template. Original paper text, figures, videos, and commercial Graphik font files are not redistributed.

## Colors and typography

- Gold: `#C59114`, RGB 197 / 145 / 20, explicitly requested by the user to match the [reference project page](https://embodiment-adaptation.github.io/). This replaces the earlier HKUST official gold choice.
- Page titles, section / experiment headings, and figure-placeholder headings use this gold. Other page text uses `#000000`; university logo artwork retains its original colors.
- The font stack matches the user's personal website repository `Lgx521.github.io-main`, `assets/css/site-shell.css` (`--site-font`): `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Heading weights follow `assets/css/site-pages.css`: 600 for the main title, 500 for section and experiment headings. BibTeX keeps its monospace stack.
- The font comes from the reader's operating system; no font files or external font services are required.
- The generic favicon retains its navy background with the updated gold accent. It is not a university emblem.

## HKUST logo

- File: `assets/logos/hkust.svg`.
- Source page: [HKUST Brand Assets Unit](https://brand.hkust.edu.hk/).
- Exact source: https://brand.hkust.edu.hk/profiles/ust/modules/custom/hkust_signature_affiliate/assets/images/ust.svg
- The user requested this version, with the emblem and full English university name, rather than the abbreviated HKUST wordmark.
- The original header asset includes a separate 35th-anniversary group at left. As explicitly requested, that group was removed and the SVG viewBox cropped to `72 0 265.32 63.68`. The emblem, full English name, original vector paths, and original color remain unchanged.
- Both university logos are displayed at approximately 70% of the earlier size (HKUST width 182 px, SUSTech width 175 px, maximum height 49 px on desktop).

## SUSTech logo

- File: `assets/logos/sustech.svg`.
- Source: user-supplied `LOGO.ai`, from the “组合3：火炬+英文校名-上下” folder.
- The Illustrator file contains a PDF-compatible vector page. The page was rendered for inspection, cropped, and converted with Poppler `pdftocairo -svg`.
- As explicitly requested by the user, the right-hand small English full name was cropped away. Only the original orange torch and dark green “SUSTech” wordmark remain. Their original shapes and colors are preserved.
- The original AI file was not changed. The repository includes the derived vector logo only.

University marks remain the property of their respective institutions and are excluded from the template code’s MIT license. Use institution affiliations that accurately reflect each paper.
