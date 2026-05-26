// Initialize main interactions (hero slider, menu) after includes are loaded.
function initMain() {
  const slides = document.querySelectorAll('.slide');
  const prev = document.getElementById('prevSlide');
  const next = document.getElementById('nextSlide');
  let current = 0;

  const show = (i) => {
    if (!slides.length) return;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    current = i;
  };

  if (slides.length) {
    show(0);
    prev?.addEventListener('click', () => show((current - 1 + slides.length) % slides.length));
    next?.addEventListener('click', () => show((current + 1) % slides.length));
    setInterval(() => show((current + 1) % slides.length), 4500);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('pageMenu');

  menuToggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.menu a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// If the page uses HTML includes, wait for them to finish loading.
if (document.querySelector('[data-include]')) {
  document.addEventListener('includes:loaded', initMain);
} else {
  document.addEventListener('DOMContentLoaded', initMain);
}