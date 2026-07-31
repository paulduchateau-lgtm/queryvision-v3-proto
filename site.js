// QueryVision v3 — comportements partagés
(function () {
  // Nav : densification au scroll
  const nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 24), { passive: true });

  // Burger + menu mobile (généré depuis la nav existante)
  const inner = nav && nav.querySelector('.nav-inner');
  const links = nav && nav.querySelector('.nav-links');
  if (inner && links) {
    const burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    const menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    links.querySelectorAll('.nav-drop').forEach(d => {
      const label = document.createElement('div');
      label.className = 'mm-label';
      label.textContent = d.querySelector('button').textContent.trim();
      menu.appendChild(label);
      d.querySelectorAll('.nav-drop-menu a').forEach(a => {
        const na = document.createElement('a');
        na.href = a.getAttribute('href');
        na.textContent = a.childNodes[0].textContent.trim();
        menu.appendChild(na);
      });
    });
    links.querySelectorAll(':scope > a').forEach(a => {
      const na = document.createElement('a');
      na.href = a.getAttribute('href');
      na.textContent = a.textContent.trim();
      na.className = 'mm-solo';
      menu.appendChild(na);
    });
    const demo = nav.querySelector('.nav-cta .btn-primary');
    if (demo) {
      const cta = document.createElement('a');
      cta.className = 'mm-cta';
      cta.href = demo.getAttribute('href');
      cta.textContent = demo.textContent.trim();
      menu.appendChild(cta);
    }
    nav.appendChild(menu);
    inner.appendChild(burger);
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', e => {
      if (e.target.tagName === 'A') { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

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
        const doc = f.contentDocument;
        const d = doc && doc.documentElement;
        if (!d) return;
        if (v.dataset.theme === 'light') d.classList.add('light');
        else d.classList.remove('light');
        if (doc.head && !doc.getElementById('qv-noscroll')) {
          const st = doc.createElement('style');
          st.id = 'qv-noscroll';
          st.textContent = '*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}';
          doc.head.appendChild(st);
        }
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
