// QueryVision v3 — comportements partagés
(function () {
  // Clé Web3Forms (publique par conception, comme sur le site en prod :
  // même clé que le secret VITE_WEB3FORMS_KEY des GitHub Actions du site actuel).
  // Vide = repli gracieux : le formulaire compose un email via mailto.
  const WEB3FORMS_KEY = 'b4af91e4-b552-4087-8746-c5328507ebed';
  const CONTACT_EMAIL = 'contact@query.vision';
  const LANGS = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' };
  const FORM_MSG = {
    fr: { invalid: 'Vérifiez votre nom et votre adresse e-mail.', sending: 'Envoi en cours…', sent: 'Message envoyé — nous revenons vers vous sous 48 h.', failed: "L'envoi a échoué. Écrivez-nous à " },
    en: { invalid: 'Please check your name and email address.', sending: 'Sending…', sent: 'Message sent — we will get back to you within 48 hours.', failed: 'Sending failed. Please email us at ' },
    es: { invalid: 'Compruebe su nombre y su dirección de correo.', sending: 'Enviando…', sent: 'Mensaje enviado — le responderemos en un plazo de 48 h.', failed: 'El envío ha fallado. Escríbanos a ' },
    de: { invalid: 'Bitte prüfen Sie Ihren Namen und Ihre E-Mail-Adresse.', sending: 'Wird gesendet…', sent: 'Nachricht gesendet — wir melden uns innerhalb von 48 Stunden.', failed: 'Senden fehlgeschlagen. Schreiben Sie uns an ' }
  };

  // Préfixe vers la racine du site (déduit du lien site.css) + langue courante
  const cssLink = document.querySelector('link[href$="site.css"]');
  const rootPrefix = cssLink ? cssLink.getAttribute('href').replace('site.css', '') : '';
  const curLang = (document.documentElement.lang || 'fr').slice(0, 2);

  // ── Sélecteur de langue ──
  function treePath() {
    if (location.pathname.endsWith('/')) return 'index.html';
    const depth = (rootPrefix.match(/\.\.\//g) || []).length;
    const segs = location.pathname.split('/').filter(Boolean);
    let path = segs.slice(-(depth + 1));
    if (path.length && LANGS[path[0]]) path = path.slice(1);
    return path.join('/') || 'index.html';
  }
  // Slugs localisés : on s'appuie d'abord sur les <link rel="alternate" hreflang> de la page
  const alternates = {};
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(l => {
    alternates[l.getAttribute('hreflang')] = l.getAttribute('href');
  });
  function langHref(code) {
    if (alternates[code]) return alternates[code];
    return rootPrefix + code + '/' + treePath();
  }
  const navInner = document.querySelector('.nav-inner');
  if (navInner) {
    const ld = document.createElement('div');
    ld.className = 'lang-drop';
    ld.innerHTML = '<button type="button" aria-label="Choisir la langue">' + curLang.toUpperCase() + '</button>' +
      '<div class="lang-drop-menu">' +
      Object.keys(LANGS).map(c => '<a href="' + langHref(c) + '"' + (c === curLang ? ' class="active"' : '') + ' hreflang="' + c + '">' + LANGS[c] + '</a>').join('') +
      '</div>';
    const cta = navInner.querySelector('.nav-cta');
    if (cta) navInner.insertBefore(ld, cta); else navInner.appendChild(ld);
  }

  // ── Formulaire de contact (Web3Forms, comme la prod) ──
  const form = document.getElementById('contact-form');
  const msg = FORM_MSG[curLang] || FORM_MSG.fr;
  if (form) {
    // pré-remplissage du motif via ?motif=
    const motif = new URLSearchParams(location.search).get('motif');
    if (motif === 'partenariat') {
      const r = form.querySelector('input[name="intent"][value="partner"]');
      if (r) r.checked = true;
    }
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.querySelector('[name="botcheck"]').value) return; // honeypot
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.botcheck;
      if (!data.name || !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
        status.textContent = msg.invalid;
        status.className = 'form-status err';
        return;
      }
      if (!WEB3FORMS_KEY) {
        // Repli sans clé : composition d'un email
        const body = encodeURIComponent(
          'Nom : ' + data.name + '\nSociété : ' + (data.company || '—') + '\nFonction : ' + (data.role || '—') +
          '\nMotif : ' + (data.intent || 'demo') + '\n\n' + (data.message || ''));
        location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Contact site — ' + data.name) + '&body=' + body;
        return;
      }
      btn.disabled = true;
      status.textContent = msg.sending;
      status.className = 'form-status';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: 'Contact site QueryVision — ' + data.name, from_name: 'Site QueryVision', botcheck: '', ...data })
        });
        const out = await res.json().catch(() => null);
        if (res.ok && out && out.success) {
          form.reset();
          status.textContent = msg.sent;
          status.className = 'form-status ok';
        } else {
          status.textContent = msg.failed + CONTACT_EMAIL + '.';
          status.className = 'form-status err';
        }
      } catch (err) {
        status.textContent = msg.failed + CONTACT_EMAIL + '.';
        status.className = 'form-status err';
      }
      btn.disabled = false;
    });
  }
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
    const mmLangs = document.createElement('div');
    mmLangs.className = 'mm-langs';
    Object.keys(LANGS).forEach(c => {
      const a = document.createElement('a');
      a.href = langHref(c);
      a.textContent = c.toUpperCase();
      if (c === curLang) a.style.color = 'var(--green-dark)';
      mmLangs.appendChild(a);
    });
    menu.appendChild(mmLangs);
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
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
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
