// QueryVision v3 — comportements partagés
(function () {
  // Nav : densification au scroll
  const nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });

  // Mise à l'échelle des iframes produit + thème par visuel
  document.querySelectorAll('.shot-viewport').forEach(v => {
    const f = v.querySelector('iframe');
    if (!f) return;
    const W = +v.dataset.w || 1440, H = +v.dataset.h || 880;
    f.style.width = W + 'px'; f.style.height = H + 'px';
    const fit = () => {
      const s = v.clientWidth / W;
      f.style.transform = `scale(${s})`;
      v.style.height = (H * s) + 'px';
    };
    new ResizeObserver(fit).observe(v);
    fit();
    const applyTheme = () => {
      try {
        const d = f.contentDocument && f.contentDocument.documentElement;
        if (!d) return;
        if (v.dataset.theme === 'light') d.classList.add('light');
        else d.classList.remove('light');
      } catch (e) {}
    };
    f.addEventListener('load', applyTheme);
    applyTheme();
  });

  // Onglets métiers (home)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('pane-' + btn.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });

  // Reveal on scroll — robuste aux sauts de scroll
  let pending = [...document.querySelectorAll('.rv')];
  function reveal() {
    if (!pending.length) return;
    const vh = innerHeight || document.documentElement.clientHeight || 900;
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add('in'); return false; }
      return true;
    });
  }
  addEventListener('scroll', reveal, { passive: true });
  addEventListener('resize', reveal, { passive: true });
  reveal();
})();
