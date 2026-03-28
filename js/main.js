/* ═══════════════════════════════════════════════════════════════════
   LOVELY ANGEL EVENTS — script.js
   Paillettes animées | Lightbox | Scroll reveal | Navigation
   ═══════════════════════════════════════════════════════════════════ */

"use strict";

/* ════════════════════════════════════
   1. GLITTER / PARTICULES PAILLETTES
════════════════════════════════════ */
(function initGlitter() {
  const canvas = document.getElementById('glitter-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], animId;

  /* Palette dorée */
  const COLORS = [
    'rgba(255,232,120,', // or brillant
    'rgba(201,168,76,',  // or classique
    'rgba(240,208,128,', // or clair
    'rgba(255,255,255,', // blanc (reflet)
    'rgba(255,215,0,',   // or vif
    'rgba(139,105,20,',  // or sombre
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.r     = Math.random() * 2.5 + 0.5;
      this.speed = Math.random() * 0.8 + 0.2;
      this.vx    = (Math.random() - 0.5) * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.06;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.fade  = Math.random() * 0.008 + 0.002;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.shape = Math.random() < 0.5 ? 'diamond' : 'star';
    }

    update() {
      this.y     -= this.speed;
      this.x     += this.vx + Math.sin(this.y * 0.02) * 0.3;
      this.angle += this.spin;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < -20) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = Math.max(0, this.alpha);

      if (this.shape === 'diamond') {
        const s = this.r * 2.2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      } else {
        // Étoile à 4 branches
        const outer = this.r * 2.5;
        const inner = this.r * 0.8;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const rad = (i * Math.PI) / 4;
          const dist = i % 2 === 0 ? outer : inner;
          if (i === 0) ctx.moveTo(Math.cos(rad) * dist, Math.sin(rad) * dist);
          else         ctx.lineTo(Math.cos(rad) * dist, Math.sin(rad) * dist);
        }
        ctx.closePath();
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }

      /* Reflet central */
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (this.alpha * 0.9) + ')';
      ctx.fill();

      ctx.restore();
    }
  }

  function spawnParticles() {
    const COUNT = Math.min(Math.floor(W * 0.04), 80);
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Ajoute occasionnellement de nouveaux éclats
    if (Math.random() < 0.12) {
      const p = new Particle();
      p.y = H + 5;
      particles.push(p);
      if (particles.length > 120) particles.shift();
    }
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    cancelAnimationFrame(animId);
    spawnParticles();
    loop();
  });

  /* Éclat supplémentaire au survol */
  document.addEventListener('mousemove', e => {
    if (Math.random() < 0.06) {
      const p = new Particle();
      p.x = e.clientX + (Math.random() - 0.5) * 30;
      p.y = e.clientY + (Math.random() - 0.5) * 30;
      p.speed = Math.random() * 1.5 + 0.5;
      p.alpha = 0.9;
      particles.push(p);
      if (particles.length > 150) particles.shift();
    }
  });

  resize();
  spawnParticles();
  loop();
})();


/* ════════════════════════════════════
   2. NAVIGATION — scroll + hamburger
════════════════════════════════════ */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  /* Classe "scrolled" */
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else                      navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger */
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Transforme les barres en X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  /* Ferme le menu au clic sur un lien */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  /* Ferme au clic en dehors */
  document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
})();


/* ════════════════════════════════════
   3. SCROLL REVEAL (Intersection Observer)
════════════════════════════════════ */
(function initReveal() {
  const revealTargets = [
    '.section-header',
    '.gallery-item',
    '.video-card',
    '.location-card',
    '.service-card',
    '.fondatrice-photo-wrapper',
    '.fondatrice-content',
    '.contact-form',
    '.strip-item',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Ajoute la classe reveal + délais échelonnés
  revealTargets.forEach(selector => {
    const els = document.querySelectorAll(selector);
    els.forEach((el, index) => {
      el.classList.add('reveal');
      // Délai échelonné pour les éléments de même type dans un grid
      el.dataset.delay = (index % 6) * 90;
      observer.observe(el);
    });
  });
})();


/* ════════════════════════════════════
   4. LIGHTBOX — zoom photo galerie
════════════════════════════════════ */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const backdrop    = document.getElementById('lightbox-backdrop');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  const counter     = document.getElementById('lightbox-counter');

  let images   = [];   // Array of {src, alt}
  let current  = 0;

  /* Collecte toutes les images de la galerie */
  function collectImages() {
    const items = document.querySelectorAll('.gallery-item .img-wrapper img');
    images = Array.from(items).map(img => ({ src: img.src, alt: img.alt }));
  }

  function openLightbox(index) {
    collectImages();
    if (!images.length) return;
    current = index;
    showImage(current);
    lightbox.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    // Réinitialise après transition
    setTimeout(() => {
      lightboxImg.src = '';
    }, 400);
  }

  function showImage(index) {
    const { src, alt } = images[index];
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Lovely Angel Events';
      lightboxImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      lightboxImg.style.opacity    = '1';
      lightboxImg.style.transform  = 'scale(1)';
    }, 100);
    counter.textContent = (index + 1) + ' / ' + images.length;
    prevBtn.style.display = images.length > 1 ? '' : 'none';
    nextBtn.style.display = images.length > 1 ? '' : 'none';
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  }

  function next() {
    current = (current + 1) % images.length;
    showImage(current);
  }

  /* Attache les événements aux éléments de galerie */
  function attachGalleryEvents() {
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openLightbox(index);
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Agrandir la photo');
    });
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click',  prev);
  nextBtn.addEventListener('click',  next);

  /* Navigation clavier */
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  /* Swipe sur mobile */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });

  attachGalleryEvents();

  /* Observer pour les futures images ajoutées dynamiquement */
  const mutObs = new MutationObserver(() => attachGalleryEvents());
  const gallery = document.getElementById('deco-gallery');
  if (gallery) mutObs.observe(gallery, { childList: true, subtree: true });
})();


/* ════════════════════════════════════
   5. FORMULAIRE CONTACT
════════════════════════════════════ */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validation simple
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      }
    });
    if (!valid) {
      const firstError = form.querySelector('[required]:not([value]),[required][value=""]');
      if (firstError) firstError.focus();
      return;
    }

    // Simulation d'envoi (remplacez par votre endpoint réel)
    const btn = form.querySelector('.btn-submit');
btn.disabled = true;
btn.querySelector('span:first-child').textContent = 'Envoi en cours…';

const data = new FormData(form);

fetch('https://formspree.io/f/xdapadvp', {  // ← colle TON lien ici
  method: 'POST',
  body: data,
  headers: { 'Accept': 'application/json' }
})
.then(res => {
  if (res.ok) {
    success.classList.remove('hidden');
    form.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => success.classList.add('hidden'), 8000);
  } else {
    alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
  }
})
.catch(() => {
  alert('Problème de connexion. Veuillez réessayer.');
})
.finally(() => {
  btn.disabled = false;
  btn.querySelector('span:first-child').textContent = 'Envoyer ma demande';
});
  });

  // Supprime les erreurs à la saisie
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.style.borderColor = '');
  });
})();


/* ════════════════════════════════════
   6. EFFET DE SURBRILLANCE DORÉE
   (halo lumineux qui suit le curseur sur les cartes)
════════════════════════════════════ */
(function initCardGlow() {
  const cards = document.querySelectorAll(
    '.service-card, .location-card, .video-card, .gallery-item'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--glow-x', x + '%');
      card.style.setProperty('--glow-y', y + '%');
      card.style.background = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(240,208,128,0.18) 0%,
          transparent 65%
        )
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ════════════════════════════════════
   7. TITRE HERO — effet shimmer au chargement
════════════════════════════════════ */
(function initHeroShimmer() {
  const line1 = document.querySelector('.hero-title .line1');
  if (!line1) return;

  // Ajoute un reflet animé après le chargement
  let pos = -100;
  const shimmerInterval = setInterval(() => {
    pos += 3;
    line1.style.backgroundImage = `
      linear-gradient(
        135deg,
        #8B6914 0%,
        #C9A84C ${pos - 20}%,
        #FFE878 ${pos}%,
        #F0D080 ${pos + 10}%,
        #C9A84C ${pos + 20}%,
        #8B6914 100%
      )
    `;
    if (pos > 200) {
      clearInterval(shimmerInterval);
      line1.style.backgroundImage = '';
    }
  }, 18);
})();


/* ════════════════════════════════════
   8. LAZY LOAD — images avec observer
════════════════════════════════════ */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;

  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Ajoute un effet de fondu à l'apparition
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        }, { once: true });
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => imgObserver.observe(img));
})();


/* ════════════════════════════════════
   9. SCROLL DOUX — ancres
════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const topPos = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  });
});


/* ════════════════════════════════════
   10. ACTIVE NAV LINK (highlight section active)
════════════════════════════════════ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  const navH      = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;

  function updateActive() {
    const scrollY = window.scrollY + navH() + 20;
    let activeId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) activeId = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + activeId);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // Style pour .nav-active
  const style = document.createElement('style');
  style.textContent = '.nav-links a.nav-active { color: var(--gold) !important; } .nav-links a.nav-active::after { width: 100% !important; }';
  document.head.appendChild(style);
})();


/* ════════════════════════════════════
   11. PAILLETTES BURST — clic sur les boutons
════════════════════════════════════ */
(function initButtonBurst() {
  document.querySelectorAll('.btn-gold, .btn-gold-sm').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      burst(
        rect.left + rect.width / 2,
        rect.top  + rect.height / 2
      );
    });
  });

  function burst(cx, cy) {
    const canvas = document.getElementById('glitter-canvas');
    if (!canvas) return;
    // Émet un flash doré
    const ctx = canvas.getContext('2d');
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        alpha: 1,
        r: Math.random() * 3 + 1,
        color: ['#FFE878','#F0D080','#C9A84C','#FFFFFF'][Math.floor(Math.random()*4)]
      });
    }

    function drawBurst() {
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.alpha -= 0.04;
      });
      if (alive) requestAnimationFrame(drawBurst);
    }
    drawBurst();
  }
})();

/* ════════════════════════════════════
   FIN — Lovely Angel Events ✦
════════════════════════════════════ */
/* ══ BACK TO TOP ══ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else                      btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();