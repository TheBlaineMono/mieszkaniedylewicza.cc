(async () => {
  // Load HTML partials found in the document and notify when done.
  const blocks = document.querySelectorAll('[data-include]');
  for (const block of blocks) {
    const src = block.getAttribute('data-include');
    if (!src) continue;
    try {
      const res = await fetch(src);
      block.innerHTML = await res.text();
    } catch (err) {
      // keep going on error
      console.error('Include failed', src, err);
    }
  }

  // Dispatch a custom event so other scripts can initialize after includes are in place
  document.dispatchEvent(new CustomEvent('includes:loaded'));
})();