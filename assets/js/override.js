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
