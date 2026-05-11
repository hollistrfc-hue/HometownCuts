/* ============================================================
   REDUCED MOTION & DEVICE DETECTION
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const SMS_HREF = 'sms:+14053385003&body=Hi%20Gunnar%2C%20I%27m%20interested%20in%20a%20free%20lawn%20care%20quote%20for%20my%20property.';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     NAV — active link
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__overlay a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     NAV — mobile menu
     ============================================================ */
  const toggle  = document.querySelector('.nav__toggle');
  const overlay = document.querySelector('.nav__overlay');
  const closeBtn = document.querySelector('.nav__overlay-close');

  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    });

    const closeOverlay = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeOverlay));
  }

  /* ============================================================
     PAGE TRANSITIONS
     ============================================================ */
  document.body.classList.add('loaded');

  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        !href.startsWith('sms') &&
        href.endsWith('.html')
      ) {
        link.addEventListener('click', e => {
          e.preventDefault();
          document.body.classList.remove('loaded');
          document.body.classList.add('fade-out');
          setTimeout(() => { window.location.href = href; }, 300);
        });
      }
    });
  }

  /* ============================================================
     PHONE MODAL — CLICK-TO-CALL / CLICK-TO-TEXT
     ============================================================ */

  // Normalise all tel: links to +1 format and flag them
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.href = 'tel:+14053385003';
    link.classList.add('js-phone-trigger');
  });

  // Inject modal into DOM
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'phone-modal-overlay';
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalOverlay.innerHTML = `
    <div class="phone-modal" role="dialog" aria-modal="true" aria-label="Contact options">
      <p class="phone-modal__label">How would you like to reach us?</p>
      <a href="tel:+14053385003" class="phone-modal__btn phone-modal__btn--call">📞 Call 405-338-5003</a>
      <a href="${SMS_HREF}" class="phone-modal__btn phone-modal__btn--text">💬 Text 405-338-5003</a>
      <button class="phone-modal__cancel">✕ Cancel</button>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const openPhoneModal = () => {
    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closePhoneModal = () => {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close on backdrop click
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closePhoneModal();
  });

  // Close on cancel button
  modalOverlay.querySelector('.phone-modal__cancel').addEventListener('click', closePhoneModal);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closePhoneModal();
  });

  // Wire up all phone triggers
  document.querySelectorAll('.js-phone-trigger').forEach(link => {
    link.addEventListener('click', e => {
      if (isMobile) {
        e.preventDefault();
        openPhoneModal();
      }
      // Desktop: let tel: href fire normally
    });
  });

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) progressBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });

  /* ============================================================
     NAV — scroll behavior
     ============================================================ */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onNavScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ============================================================
     ADD ANIMATION CLASSES TO DOM ELEMENTS
     ============================================================ */
  if (!prefersReducedMotion) {

    // Section labels + headings
    document.querySelectorAll('.section-label').forEach(el => el.classList.add('fade-up'));
    document.querySelectorAll(
      '.section h2, .section--white h2, .section--cream h2, ' +
      '.page-header h1, .page-header .subhead, .cta-band h2, .cta-band p'
    ).forEach(el => el.classList.add('fade-up'));

    // Services list rows — staggered
    document.querySelectorAll('.services-list .services-list__item').forEach((item, i) => {
      item.classList.add('fade-up');
      item.style.transitionDelay = (i * 0.08) + 's';
    });

    // Photo grid — clip reveal on images, fade-up on captions
    document.querySelectorAll('.photo-item img').forEach((img, i) => {
      img.classList.add('clip-reveal');
      img.style.transitionDelay = (i * 0.15) + 's';
    });
    document.querySelectorAll('.photo-item__caption').forEach((cap, i) => {
      cap.classList.add('fade-up');
      cap.style.transitionDelay = (i * 0.15 + 0.35) + 's';
    });

    // About teaser — two-column fade
    const teaserText  = document.querySelector('.about-teaser__text');
    const teaserFlyer = document.querySelector('.about-teaser__flyer');
    if (teaserText)  teaserText.classList.add('fade-left');
    if (teaserFlyer) teaserFlyer.classList.add('fade-right');

    // CTA band button
    document.querySelectorAll('.cta-band .btn').forEach(el => {
      el.classList.add('fade-up');
      el.style.transitionDelay = '0.18s';
    });

    // Location blocks
    document.querySelectorAll('.location-block').forEach((block, i) => {
      block.classList.add('fade-up');
      block.style.transitionDelay = (i * 0.12) + 's';
    });
    document.querySelectorAll('.service-area-note').forEach(el => el.classList.add('fade-up'));

    // Services page rows
    document.querySelectorAll('.service-row').forEach((row, i) => {
      row.classList.add('fade-up');
      row.style.transitionDelay = (i * 0.07) + 's';
    });

    // Schedule items
    document.querySelectorAll('.schedule-item').forEach((item, i) => {
      item.classList.add('fade-up');
      item.style.transitionDelay = (i * 0.1) + 's';
    });

    // About page
    document.querySelectorAll('.pull-quote').forEach(el => el.classList.add('fade-left'));
    document.querySelectorAll('.values-list__item').forEach((item, i) => {
      item.classList.add('fade-up');
      item.style.transitionDelay = (i * 0.07) + 's';
    });

    // Contact page
    document.querySelectorAll('.contact-method').forEach((item, i) => {
      item.classList.add('fade-up');
      item.style.transitionDelay = (i * 0.1) + 's';
    });
    document.querySelectorAll('.faq-item').forEach((item, i) => {
      item.classList.add('fade-up');
      item.style.transitionDelay = (i * 0.06) + 's';
    });

    // Quote page
    const quoteLeft  = document.querySelector('.quote-layout > :first-child');
    const quoteRight = document.querySelector('.quote-layout > :last-child');
    if (quoteLeft)  quoteLeft.classList.add('fade-left');
    if (quoteRight) quoteRight.classList.add('fade-right');

    // Footer
    document.querySelectorAll('.footer__top, .footer__bottom').forEach(el => el.classList.add('fade-in'));
  }

  /* ============================================================
     INTERSECTION OBSERVER — all fade/clip classes
     ============================================================ */
  const animClasses = ['.fade-up', '.fade-left', '.fade-right', '.fade-in', '.clip-reveal'];
  const animEls = document.querySelectorAll(animClasses.join(', '));

  if (!prefersReducedMotion && animEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animEls.forEach(el => observer.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ============================================================
     EXISTING .reveal SYSTEM (keep for backward compat)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     SMOOTH SCROLL — anchor links with nav offset
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     QUOTE FORM — success state
     ============================================================ */
  const quoteForm   = document.querySelector('.quote-form');
  const formSuccess = document.querySelector('.form-success');

  if (quoteForm && formSuccess) {
    quoteForm.addEventListener('submit', e => {
      e.preventDefault();
      quoteForm.style.display = 'none';
      formSuccess.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}); // end DOMContentLoaded
