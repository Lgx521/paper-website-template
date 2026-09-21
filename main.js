(() => {
  const button = document.querySelector('#copy-bib');
  const citation = document.querySelector('#bibtex-content');
  const status = document.querySelector('#copy-status');
  if (!button || !citation || !status) return;
  button.hidden = false;
  let reset;

  function fallbackCopy(value) {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    let success;
    try { success = document.execCommand('copy'); }
    finally { field.remove(); button.focus({ preventScroll: true }); }
    return success;
  }

  button.addEventListener('click', async () => {
    clearTimeout(reset);
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(citation.textContent);
        success = true;
      }
    } catch { /* Local files and denied clipboard permissions use the fallback. */ }
    if (!success) {
      try { success = fallbackCopy(citation.textContent); } catch { success = false; }
    }
    button.querySelector('span').textContent = success ? 'Copied!' : 'Copy';
    status.textContent = success ? 'BibTeX copied to clipboard.' : 'Copy unavailable. Select the citation text or use Download .bib.';
    reset = setTimeout(() => {
      button.querySelector('span').textContent = 'Copy';
      if (success) status.textContent = '';
    }, 2500);
  });
})();
