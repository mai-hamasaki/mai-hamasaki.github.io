(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      nav.classList.toggle('open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  // works filter
  const cards = document.querySelectorAll('.work-card');
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.category !== f));
    });
  });

  // work cards pop in on scroll
  cards.forEach((c) => c.classList.add('reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add('in'));
  }

  // lightbox (multi-image works)
  const dlg = document.querySelector('.lightbox');
  if (dlg && dlg.showModal) {
    const img = dlg.querySelector('img');
    const count = dlg.querySelector('.lb-count');
    const pdf = dlg.querySelector('.lb-pdf');
    const prev = dlg.querySelector('.lb-prev');
    const next = dlg.querySelector('.lb-next');
    let list = [], i = 0, title = '';
    const show = (n) => {
      i = (n + list.length) % list.length;
      img.src = list[i];
      img.alt = title + (list.length > 1 ? `（${i + 1}/${list.length}）` : '');
      count.textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
    };
    document.querySelectorAll('[data-gallery]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        list = a.dataset.gallery.split('|');
        title = a.querySelector('img')?.alt || '';
        pdf.hidden = !a.dataset.pdf;
        if (a.dataset.pdf) pdf.href = a.dataset.pdf;
        prev.hidden = next.hidden = list.length < 2;
        show(0);
        dlg.showModal();
      });
    });
    prev.addEventListener('click', () => show(i - 1));
    next.addEventListener('click', () => show(i + 1));
    dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (list.length < 2) return;
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  // hero stickers drift at different speeds while scrolling
  const stickers = document.querySelectorAll('[data-speed]');
  if (!reduce && stickers.length) {
    let ticking = false;
    const update = () => {
      const y = Math.min(scrollY, 900);
      stickers.forEach((s) => s.style.setProperty('--py', (y * parseFloat(s.dataset.speed)) + 'px'));
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }
})();
