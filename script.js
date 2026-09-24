
// Reliable shirt image loader: fetches a text-encoded image so GitHub Pages serves it consistently.
let tylerHqDataUri = "";
fetch("assets/gallery/tyler-jesus-hq.b64?v=1", { cache: "force-cache" })
  .then(r => {
    if (!r.ok) throw new Error("shirt image data failed to load");
    return r.text();
  })
  .then(b64 => {
    tylerHqDataUri = "data:image/webp;base64," + b64.trim();
    document.querySelectorAll("img[data-tyler-hq]").forEach(img => {
      img.src = tylerHqDataUri;
      img.classList.add("hq-loaded");
    });
    document.querySelectorAll('[data-image="tyler-hq"]').forEach(card => {
      card.dataset.resolvedImage = tylerHqDataUri;
    });
  })
  .catch(() => {
    document.querySelectorAll("img[data-tyler-hq]").forEach(img => {
      img.src = "assets/gallery/shirts-grace-growth.webp?v=3";
    });
  });

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

document.querySelectorAll('.image-card[data-image], .featured-card[data-image], .stacked-photo[data-image], .hero-mini-photo[data-image], .fresh-drop-photo[data-image], .fresh-mini-polaroid[data-image]').forEach(card => {
  card.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const img = card.querySelector('img');
    lightboxImage.src = card.dataset.resolvedImage || (card.dataset.image === 'tyler-hq' ? tylerHqDataUri : card.dataset.image);
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

const reveals = document.querySelectorAll('.reveal-up, .reveal-scale');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .10, rootMargin: '0px 0px -5% 0px' });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (min, value, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;

if (!reducedMotion) {
  let rafPending = false;

  const progressBar = document.querySelector('.scroll-progress span');
  const heroCopy = document.querySelector('.hero-copy');
  const heroVisual = document.querySelector('.hero-visual-collage');
  const marquee = document.querySelector('.love-marquee-track');
  const story = document.querySelector('#scroll-showcase');
  const storyCopy = document.querySelector('.motion-copy');
  const storyStep = document.querySelector('.motion-step span');
  const giantWord = document.querySelector('.motion-giant-word');
  const motionCards = [...document.querySelectorAll('.motion-card')];
  const bannerImage = document.querySelector('.banner-section img');
  const freshCard = document.querySelector('.fresh-drop-card');
  const freshImage = document.querySelector('.fresh-drop-photo');
  const freshMini = document.querySelector('.fresh-mini-polaroid');
  const doodles = [...document.querySelectorAll('.background-doodles span')];

  const setCard = (card, x, y, r, s, z, opacity = 1, clip = 0) => {
    if (!card) return;
    card.style.setProperty('--mx', x.toFixed(1) + 'px');
    card.style.setProperty('--my', y.toFixed(1) + 'px');
    card.style.setProperty('--mr', r.toFixed(2) + 'deg');
    card.style.setProperty('--ms', s.toFixed(3));
    card.style.setProperty('--mz', z.toFixed(1) + 'px');
    card.style.setProperty('--mo', opacity.toFixed(3));
    card.style.setProperty('--clip', clip.toFixed(1) + '%');
  };

  const update = () => {
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 800;
    const pageMax = Math.max(1, document.documentElement.scrollHeight - vh);
    const pageP = clamp(0, y / pageMax, 1);

    if (progressBar) progressBar.style.transform = 'scaleX(' + pageP + ')';

    // Header marquee is tied to scroll instead of an independent loop.
    if (marquee) {
      const marqueeX = -((y * .28) % 760);
      marquee.style.transform = 'translate3d(' + marqueeX.toFixed(1) + 'px,0,0)';
    }

    // Hero moves apart as the user leaves it.
    const heroP = clamp(0, y / (vh * .78), 1);
    if (heroCopy) {
      heroCopy.style.setProperty('--hero-copy-y', lerp(0, -72, heroP).toFixed(1) + 'px');
      heroCopy.style.setProperty('--hero-copy-opacity', lerp(1, .52, heroP).toFixed(3));
    }
    if (heroVisual) {
      heroVisual.style.setProperty('--hero-visual-y', lerp(0, 74, heroP).toFixed(1) + 'px');
      heroVisual.style.setProperty('--hero-visual-scale', lerp(1, .91, heroP).toFixed(3));
    }

    // Background decorations lag behind the page.
    const bgSpeeds = [.018, .031, .013, .026, .021];
    doodles.forEach((el, i) => {
      el.style.transform = 'translate3d(0,' + (y * bgSpeeds[i]).toFixed(1) + 'px,0)';
    });

    // Banner opens like a panel as it enters view.
    if (bannerImage) {
      const r = bannerImage.getBoundingClientRect();
      const p = clamp(0, 1 - Math.abs((r.top + r.height / 2) - vh / 2) / (vh * .82), 1);
      bannerImage.style.setProperty('--banner-scale', lerp(.93, 1, p).toFixed(3));
      bannerImage.style.setProperty('--banner-y', lerp(34, 0, p).toFixed(1) + 'px');
      bannerImage.style.setProperty('--banner-tilt', lerp(3.5, 0, p).toFixed(2) + 'deg');
      bannerImage.style.setProperty('--banner-clip', lerp(7, 0, p).toFixed(2) + '%');
    }

    // MAIN FEATURE: sticky scroll-story.
    if (story) {
      const rect = story.getBoundingClientRect();
      const available = Math.max(1, story.offsetHeight - vh);
      const p = clamp(0, -rect.top / available, 1);
      const eased = p * p * (3 - 2 * p);

      if (storyCopy) {
        storyCopy.style.setProperty('--story-copy-y', lerp(26, -34, eased).toFixed(1) + 'px');
        storyCopy.style.setProperty('--story-copy-opacity', lerp(.9, 1, Math.min(1, p * 2)).toFixed(3));
      }
      if (giantWord) {
        giantWord.style.setProperty('--giant-x', lerp(80, -420, eased).toFixed(1) + 'px');
      }
      if (storyStep) {
        const step = Math.min(4, Math.max(1, Math.floor(p * 4) + 1));
        storyStep.textContent = String(step).padStart(2, '0');
      }

      // Start as a deck, then explode into an editorial composition.
      setCard(motionCards[0],
        lerp(0, -210, eased),
        lerp(0, -92, eased),
        lerp(0, -10, eased),
        lerp(1.04, .94, eased),
        lerp(90, 0, eased),
        1,
        lerp(5, 0, eased)
      );

      setCard(motionCards[1],
        lerp(14, 195, eased),
        lerp(12, -118, eased),
        lerp(2, 11, eased),
        lerp(.99, .88, eased),
        lerp(54, -20, eased),
        lerp(.92, 1, eased),
        lerp(8, 0, eased)
      );

      setCard(motionCards[2],
        lerp(-8, -142, eased),
        lerp(18, 188, eased),
        lerp(-2, -8, eased),
        lerp(.96, .83, eased),
        lerp(30, -36, eased),
        lerp(.82, 1, eased),
        lerp(11, 0, eased)
      );

      setCard(motionCards[3],
        lerp(20, 205, eased),
        lerp(24, 176, eased),
        lerp(3, 9, eased),
        lerp(.93, .80, eased),
        lerp(8, -52, eased),
        lerp(.70, 1, eased),
        lerp(14, 0, eased)
      );
    }

    // Featured apparel spread drifts in opposite directions.
    if (freshCard) {
      const r = freshCard.getBoundingClientRect();
      const n = clamp(-1, (r.top + r.height / 2 - vh / 2) / vh, 1);
      freshCard.style.setProperty('--fresh-y', (n * -22).toFixed(1) + 'px');
      freshCard.style.setProperty('--fresh-r', (n * -.5).toFixed(2) + 'deg');
    }
    if (freshImage) {
      const r = freshImage.getBoundingClientRect();
      const n = clamp(-1, (r.top + r.height / 2 - vh / 2) / vh, 1);
      freshImage.style.setProperty('--fresh-img-y', (n * 24).toFixed(1) + 'px');
      freshImage.style.setProperty('--fresh-img-scale', (1 + (1 - Math.abs(n)) * .028).toFixed(3));
    }
    if (freshMini) {
      const r = freshMini.getBoundingClientRect();
      const n = clamp(-1, (r.top + r.height / 2 - vh / 2) / vh, 1);
      freshMini.style.setProperty('--mini-y', (n * -34).toFixed(1) + 'px');
    }

    // Gallery becomes a layered scroll collage.
    document.querySelectorAll('.editorial-gallery .featured-card').forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const n = clamp(-1, (r.top + r.height / 2 - vh / 2) / vh, 1);
      const strength = 13 + (i % 5) * 5;
      card.style.setProperty('--gallery-y', (n * strength).toFixed(1) + 'px');
      card.style.setProperty('--gallery-r', (n * ((i % 2 ? 1 : -1) * .55)).toFixed(2) + 'deg');
      card.style.setProperty('--gallery-s', (1 + (1 - Math.abs(n)) * .012).toFixed(3));
      card.style.setProperty('--gallery-o', lerp(.84, 1, 1 - Math.abs(n) * .6).toFixed(3));
    });

    // Headings and cards get smaller slow-parallax so the entire site feels alive.
    document.querySelectorAll('.section-heading').forEach(el => {
      const r = el.getBoundingClientRect();
      const n = clamp(-1, (r.top - vh * .42) / vh, 1);
      el.style.setProperty('--heading-y', (n * -13).toFixed(1) + 'px');
    });

    document.querySelectorAll('.product-card, .quick-link-card, .image-card, .mini-action, .support-card, .contact-card').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const n = clamp(-1, (r.top + r.height / 2 - vh / 2) / vh, 1);
      const strength = 5 + (i % 3) * 3;
      el.style.setProperty('--drift-y', (n * strength).toFixed(1) + 'px');
      el.style.setProperty('--drift-r', (n * ((i % 2 ? 1 : -1) * .12)).toFixed(2) + 'deg');
    });

    rafPending = false;
  };

  const requestUpdate = () => {
    if (!rafPending) {
      requestAnimationFrame(update);
      rafPending = true;
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
}


// Extra cinematic scroll layers v17
if (!reducedMotion) {
  let extraFrame = false;

  const updateExtraMotion = () => {
    const vh = window.innerHeight || 800;

    // Pinned horizontal product rail
    const shop = document.querySelector(".horizontal-shop");
    const track = document.querySelector(".product-track");
    const viewport = document.querySelector(".product-viewport");
    const counter = document.querySelector(".shop-scroll-count span");
    const giant = document.querySelector(".shop-giant-word");

    if (shop && track && viewport) {
      const r = shop.getBoundingClientRect();
      const available = Math.max(1, shop.offsetHeight - vh);
      const p = clamp(0, -r.top / available, 1);
      const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth + 120);
      track.style.transform = "translate3d(" + (-maxX * p).toFixed(1) + "px,0,0)";
      if (giant) giant.style.transform = "translate3d(" + lerp(80, -520, p).toFixed(1) + "px,0,0)";
      if (counter) {
        const step = Math.min(6, Math.max(1, Math.floor(p * 6) + 1));
        counter.textContent = String(step).padStart(2, "0");
      }

      document.querySelectorAll(".shop-card").forEach((card, i) => {
        const local = clamp(0, 1 - Math.abs((i / 5) - p) * 1.75, 1);
        card.style.setProperty("--shop-card-scale", (0.92 + local * 0.08).toFixed(3));
        card.style.setProperty("--shop-card-tilt", ((i % 2 ? 1 : -1) * (1 - local) * 2.4).toFixed(2) + "deg");
        card.style.setProperty("--shop-card-glow", local.toFixed(3));
      });
    }

    // Kinetic divider moves in opposite directions
    document.querySelectorAll(".kinetic-divider").forEach(div => {
      const r = div.getBoundingClientRect();
      const p = clamp(-1, (r.top - vh * 0.5) / vh, 1);
      const a = div.querySelector(".kinetic-line-a");
      const b = div.querySelector(".kinetic-line-b");
      if (a) a.style.transform = "translate3d(" + (p * -160).toFixed(1) + "px,0,0)";
      if (b) b.style.transform = "translate3d(" + (p * 190).toFixed(1) + "px,0,0)";
    });

    // Scroll-reveal masks for large images
    document.querySelectorAll(".scroll-image-panel").forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const centerDistance = Math.abs((r.top + r.height / 2) - vh / 2);
      const proximity = 1 - clamp(0, centerDistance / (vh * .85), 1);
      panel.style.setProperty("--panel-reveal", (14 - proximity * 14).toFixed(2) + "%");
      panel.style.setProperty("--panel-scale", (0.965 + proximity * .035).toFixed(4));
      panel.style.setProperty("--panel-y", ((1 - proximity) * (i % 2 ? 28 : -28)).toFixed(1) + "px");
    });

    // Gallery gets a curtain reveal in addition to drift
    document.querySelectorAll(".editorial-gallery .featured-card").forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const centerDistance = Math.abs((r.top + r.height / 2) - vh / 2);
      const proximity = 1 - clamp(0, centerDistance / (vh * .9), 1);
      card.style.setProperty("--gallery-clip", (10 - proximity * 10).toFixed(2) + "%");
      card.style.setProperty("--gallery-shadow", proximity.toFixed(3));
    });

    // CTA scales up as it enters
    const contact = document.querySelector(".contact-card");
    if (contact) {
      const r = contact.getBoundingClientRect();
      const p = clamp(0, 1 - Math.abs((r.top + r.height / 2) - vh / 2) / vh, 1);
      contact.style.setProperty("--cta-scale", (0.94 + p * 0.06).toFixed(3));
      contact.style.setProperty("--cta-rotate", ((1 - p) * -1.4).toFixed(2) + "deg");
    }

    extraFrame = false;
  };

  const requestExtraMotion = () => {
    if (!extraFrame) {
      requestAnimationFrame(updateExtraMotion);
      extraFrame = true;
    }
  };

  window.addEventListener("scroll", requestExtraMotion, { passive: true });
  window.addEventListener("resize", requestExtraMotion, { passive: true });
  requestExtraMotion();
}
