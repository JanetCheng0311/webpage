// Small runtime fixes for Framer export
document.addEventListener('DOMContentLoaded', function () {
  try {
    const isGrey = (bg) => bg === 'rgb(219, 219, 219)' || bg === 'rgba(219, 219, 219, 1)';
    document.querySelectorAll('*').forEach(el => {
      const style = getComputedStyle(el);
      if (!style) return;
      const bg = style.backgroundColor;
      const h = parseFloat(style.height) || 0;
      if (isGrey(bg) && h > 0 && h < 80) {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  } catch (e) {
    // fail silently
  }
});

// Ensure the intro text stays 'Multimedia' even after Framer hydration
(function enforceMultimedia() {
  const findAndReplace = (root=document) => {
    try {
      // replace exact strings and partial occurrences inside framer text nodes
      const targets = Array.from(root.querySelectorAll('.framer-text'));
      targets.forEach(el => {
        if (!el || !el.childNodes) return;
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.textContent;
            if (!txt) return;
            const replaced = txt.replace(/Communication designer/gi, 'Multimedia designer')
                                 .replace(/I am a Communication/gi, 'I am a Multimedia');
            if (replaced !== txt) node.textContent = replaced;
          }
        });
      });
    } catch (e) {
      // silent
    }
  };

  // run immediately and a few times to catch async hydration
  findAndReplace(document);
  setTimeout(() => findAndReplace(document), 100);
  setTimeout(() => findAndReplace(document), 500);
  setTimeout(() => findAndReplace(document), 1500);

  // observe future changes (e.g., Framer re-render) and re-apply replacement
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(n => {
          if (n.nodeType === Node.ELEMENT_NODE) findAndReplace(n);
        });
      }
      if (m.type === 'characterData' && m.target) {
        // small throttle: handle character data changes
        findAndReplace(document);
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
