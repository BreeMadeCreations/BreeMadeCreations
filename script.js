const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const closeBtn = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('.image-card[data-image], .featured-card[data-image], .stacked-photo[data-image], .hero-mini-photo[data-image], .fresh-drop-photo[data-image]').forEach(card => {
  card.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const img = card.querySelector('img');
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = img?.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
}
closeBtn?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Scroll reveals
const revealItems = document.querySelectorAll('.reveal-up, .reveal-scale');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -6% 0px' });

  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-visible'));
}

// Subtle scroll-linked movement, not overdone.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion) {
  let ticking = false;

  const animateOnScroll = () => {
    const vh = window.innerHeight;

    document.querySelectorAll('.banner-section img, .feature-image img, .hero-logo-card').forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const delta = (center - vh / 2) / vh;
      const shift = Math.max(-10, Math.min(10, delta * -14));
      el.style.transform = `translateY(${shift}px)`;
    });

    document.querySelectorAll('.scroll-section').forEach(section => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (rect.top - vh / 2) / vh));
      section.style.setProperty('--orb-shift', `${progress * -22}px`);
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(animateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  animateOnScroll();
}


// Slow layered background parallax: decorations move slower than page content.
if (!reducedMotion) {
  let bgTicking = false;

  const updateBackgroundParallax = () => {
    const y = window.scrollY || window.pageYOffset;

    document.body.style.setProperty('--bg1', `${y * -0.035}px`);
    document.body.style.setProperty('--bg2', `${y * -0.055}px`);
    document.body.style.setProperty('--bg3', `${y * -0.025}px`);
    document.body.style.setProperty('--bg4', `${y * -0.045}px`);

    const doodles = document.querySelectorAll('.background-doodles span');
    const speeds = [0.045, 0.025, 0.06, 0.035, 0.02];
    doodles.forEach((el, i) => {
      el.style.transform = `translate3d(0, ${y * speeds[i]}px, 0)`;
    });

    bgTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!bgTicking) {
      requestAnimationFrame(updateBackgroundParallax);
      bgTicking = true;
    }
  }, { passive: true });

  updateBackgroundParallax();
}
