import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import paper from '../paper.config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const text = value => escape(value).replace(/\n/g, '<br>');
const url = (value = '') => {
  if (!value) return '';
  if (/^(https?:\/\/|mailto:)/i.test(value)) return escape(value);
  if (!/^[a-z][a-z\d+.-]*:/i.test(value) && !/^[\\/]/.test(value)) return escape(value);
  throw new Error(`Use an HTTPS URL, a relative asset path, or an anchor: ${value}`);
};
const external = value => /^https?:\/\//i.test(value) ? ' target="_blank" rel="noopener noreferrer"' : '';
const icons = {
  paper: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16"/>',
  video: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/>',
  data: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.paper}</svg>`;
const paragraphs = values => (values || []).map(p => `<p>${text(p)}</p>`).join('\n');

function media(item) {
  let content;
  switch (item.type) {
    case 'image':
      if (!item.src || !item.alt) throw new Error('Every image needs src and alt.');
      content = `<img src="${url(item.src)}" alt="${escape(item.alt)}" loading="lazy" decoding="async">`;
      break;
    case 'video':
      if (!item.src) throw new Error('Every video needs src.');
      content = `<video controls playsinline preload="metadata"${item.poster ? ` poster="${url(item.poster)}"` : ''} aria-label="${escape(item.label || 'Research demonstration')}">
        <source src="${url(item.src)}" type="${escape(item.mime || 'video/mp4')}">
        ${(item.tracks || []).map(t => `<track kind="captions" src="${url(t.src)}" srclang="${escape(t.lang)}" label="${escape(t.label)}"${t.default ? ' default' : ''}>`).join('')}
        Your browser does not support embedded video. <a href="${url(item.src)}">Download the video.</a>
      </video>`;
      break;
    case 'youtube':
      if (!/^[\w-]{11}$/.test(item.videoId || '')) throw new Error('YouTube videoId must contain exactly 11 letters, numbers, underscores, or hyphens.');
      content = `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${item.videoId}" title="${escape(item.label || 'Project video')}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
      break;
    case 'placeholder':
      content = `<div class="media-placeholder aspect-${['video', 'wide', 'plot'].includes(item.aspect) ? item.aspect : 'video'}">
        <span class="placeholder-label">${escape(item.label || 'Research figure')}</span>
        ${item.hint ? `<span class="placeholder-hint">${escape(item.hint)}</span>` : ''}
        <span class="placeholder-tag">MEDIA PLACEHOLDER</span>
      </div>`;
      break;
    default: throw new Error(`Unknown media type: ${item.type}`);
  }
  return `<figure>${content}${item.caption ? `<figcaption>${text(item.caption)}</figcaption>` : ''}</figure>`;
}
function mediaGroup(items = [], columns = 1) {
  return items.length ? `<div class="media-group${columns === 2 ? ' two-columns' : ''}">${items.map(media).join('\n')}</div>` : '';
}
function section(s) {
  return `<section class="content-section" id="${escape(s.id)}" aria-labelledby="${escape(s.id)}-title">
    <h2 id="${escape(s.id)}-title">${escape(s.title)}</h2>
    ${paragraphs(s.paragraphs)}
    ${mediaGroup(s.media, s.columns)}
    ${(s.experiments || []).map(e => `<div class="experiment"><h3>${escape(e.title)}</h3>${paragraphs(e.paragraphs)}${mediaGroup(e.media, e.columns)}</div>`).join('\n')}
  </section>`;
}

const activeSections = paper.sections.filter(s => s.visible !== false);
const ids = new Set(['main', 'top', 'video', 'abstract', 'takeaways', 'bibtex']);
for (const s of activeSections) {
  if (!/^[a-z][a-z0-9-]*$/.test(s.id) || ids.has(s.id)) throw new Error(`Section id must be unique and lowercase: ${s.id}`);
  ids.add(s.id);
}
for (const a of paper.authors) {
  for (const id of a.affiliations || []) {
    if (!paper.institutions.some(i => i.id === id)) throw new Error(`Unknown affiliation ${id} for ${a.name}`);
  }
}
const title = paper.title.replace(/\n/g, ' ');
const jsonLd = { '@context': 'https://schema.org', '@type': 'ScholarlyArticle', headline: title, description: paper.description, author: paper.authors.map(a => ({ '@type': 'Person', name: a.name, ...(a.url ? { url: a.url } : {}) })), ...(paper.siteUrl ? { url: paper.siteUrl } : {}) };
const resources = paper.resources.map(r => r.href
  ? `<a class="resource-link" href="${url(r.href)}"${external(r.href)}>${icon(r.icon)}${escape(r.label)}</a>`
  : `<span class="resource-link unavailable" aria-disabled="true" title="${escape(r.label)} — coming soon">${icon(r.icon)}${escape(r.label)}<span class="resource-status">Soon</span></span>`).join('\n');
const authors = paper.authors.map(a => `<span class="author">${a.url ? `<a href="${url(a.url)}"${external(a.url)}>${escape(a.name)}</a>` : escape(a.name)}<sup>${escape((a.affiliations || []).join(','))}${escape(a.marker || '')}</sup></span>`).join('<span class="author-comma" aria-hidden="true">, </span>');
const logos = paper.institutions.map(i => `<a class="institution" href="${url(i.url)}"${external(i.url)} aria-label="${escape(i.name)}">
  <img src="${url(i.logo)}" alt="${escape(i.name)}" style="--logo-width: ${Number(i.width) || 260}px" decoding="async">
  <span><sup>${escape(i.id)}</sup> ${escape(i.shortName)}</span>
</a>`).join('\n');

const html = `<!doctype html>
<!-- Generated by scripts/build.mjs. Edit paper.config.mjs, then regenerate. -->
<html lang="${escape(paper.lang || 'en')}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#003366">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(paper.description)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:site_name" content="${escape(paper.shortTitle || title)}">
  <meta property="og:description" content="${escape(paper.description)}">
  ${paper.siteUrl ? `<link rel="canonical" href="${url(paper.siteUrl)}"><meta property="og:url" content="${url(paper.siteUrl)}">` : ''}
  ${paper.socialImage ? `<meta property="og:image" content="${url(paper.socialImage)}">` : ''}
  <meta name="twitter:card" content="${paper.socialImage ? 'summary_large_image' : 'summary'}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <script src="main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="hero" id="top">
    <div class="wrap">
      ${paper.venue ? `<p class="venue">${escape(paper.venue)}</p>` : ''}
      <h1>${paper.title.split('\n').map((line, i) => `<span${i === 0 ? ' class="title-accent"' : ''}>${escape(line)}</span>`).join(' ')}</h1>
      <p class="authors">${authors}</p>
      ${paper.authorNote ? `<p class="author-note">${escape(paper.authorNote)}</p>` : ''}
      <div class="institution-logos">${logos}</div>
    </div>
  </header>
  <main id="main" class="wrap">
    <div class="resource-links" aria-label="Paper resources">${resources}</div>
    ${paper.teaser ? `<section class="spotlight" id="video" aria-label="Project overview">${media(paper.teaser)}</section>` : ''}
    <section class="content-section" id="abstract" aria-labelledby="abstract-title"><h2 id="abstract-title">Abstract</h2><p class="abstract">${text(paper.abstract)}</p></section>
    ${activeSections.map(section).join('\n')}
    ${paper.takeaways?.length ? `<section class="content-section" id="takeaways" aria-labelledby="takeaways-title"><h2 id="takeaways-title">Takeaways</h2><ul class="takeaway-list">${paper.takeaways.map(t => `<li>${text(t)}</li>`).join('')}</ul></section>` : ''}
    ${paper.bibtex ? `<section class="content-section" id="bibtex" aria-labelledby="bibtex-title"><div class="bib-header"><h2 id="bibtex-title">BibTeX</h2><div class="bib-actions"><a href="citation.bib" download>Download .bib</a><button type="button" id="copy-bib" aria-label="Copy BibTeX to clipboard" hidden>${icon('copy')}<span>Copy</span></button></div></div><pre class="bib" tabindex="0" aria-label="BibTeX citation"><code id="bibtex-content">${escape(paper.bibtex)}</code></pre><p class="copy-status" id="copy-status" role="status" aria-live="polite"></p></section>` : ''}
  </main>
  <footer class="footer"><div class="wrap"><p>Layout inspired by <a href="https://embodiment-adaptation.github.io/">Rapid Embodiment Adaptation</a>.</p><p><a href="https://github.com/Lgx521/paper-website-template">Paper website template</a><span aria-hidden="true"> · </span><a href="#top">Back to top</a></p></div></footer>
</body>
</html>
`;
const check = process.argv.includes('--check');
for (const [file, contents] of [['index.html', html], ['citation.bib', `${paper.bibtex || ''}\n`]]) {
  const dest = path.join(root, file);
  if (check) {
    if (await readFile(dest, 'utf8') !== contents) throw new Error(`${file} is stale. Run node scripts/build.mjs.`);
  } else await writeFile(dest, contents);
}
console.log(check ? 'Generated files are up to date.' : 'Generated index.html and citation.bib.');
