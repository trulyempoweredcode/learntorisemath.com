/* =============================================
   MAIN JS — Learn to Rise Maths Tutoring
   Mobile nav, scroll state, dropdowns,
   FAQ accordion, insights shuffle
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // -------------------------------------------------
  // 1. Mobile Navigation Toggle
  // -------------------------------------------------
  var toggle = document.querySelector('.nav__toggle');
  var mobileMenu = document.querySelector('.nav__mobile');
  var body = document.body;

  if (toggle && mobileMenu) {
    function closeMenu() {
      toggle.classList.remove('nav__toggle--open');
      mobileMenu.classList.remove('nav__mobile--open');
      body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('nav__toggle--open');
      mobileMenu.classList.toggle('nav__mobile--open', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('nav__mobile--open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when viewport passes 768px
    var mql = window.matchMedia('(min-width: 768px)');
    mql.addEventListener('change', function (e) {
      if (e.matches && mobileMenu.classList.contains('nav__mobile--open')) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------
  // 2. Sticky Nav Scroll State
  // -------------------------------------------------
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  // -------------------------------------------------
  // 3. Dropdown Navigation
  // -------------------------------------------------
  var dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');

  if (dropdownToggles.length) {
    var isMobile = function () {
      return window.innerWidth < 768;
    };

    dropdownToggles.forEach(function (btn) {
      var parent = btn.parentElement;
      var menu = parent.querySelector('.nav__dropdown-menu');
      if (!menu) return;

      // Desktop: hover open / close
      parent.addEventListener('mouseenter', function () {
        if (!isMobile()) menu.classList.add('nav__dropdown-menu--open');
      });
      parent.addEventListener('mouseleave', function () {
        if (!isMobile()) menu.classList.remove('nav__dropdown-menu--open');
      });

      // Mobile: click toggle
      btn.addEventListener('click', function (e) {
        if (isMobile()) {
          e.preventDefault();
          menu.classList.toggle('nav__dropdown-menu--open');
        }
      });
    });
  }

  // -------------------------------------------------
  // 4. FAQ Accordion
  // -------------------------------------------------
  var faqQuestions = document.querySelectorAll('.faq-item__question');

  if (faqQuestions.length) {
    faqQuestions.forEach(function (question) {
      question.addEventListener('click', function () {
        var item = question.closest('.faq-item');
        if (!item) return;

        var section = item.closest('.faq-section');
        var answer = item.querySelector('.faq-item__answer');
        var isOpen = item.classList.contains('faq-item--open');

        // Close other items in the same section
        if (section) {
          section.querySelectorAll('.faq-item--open').forEach(function (openItem) {
            if (openItem !== item) {
              collapseAnswer(openItem);
            }
          });
        }

        // Toggle current item
        if (isOpen) {
          collapseAnswer(item);
        } else {
          expandAnswer(item, answer);
        }
      });
    });

    function expandAnswer(item, answer) {
      if (!answer) return;
      item.classList.add('faq-item--open');
      answer.style.height = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 0.3s ease';

      // Read the natural height then animate to it
      var scrollH = answer.scrollHeight;
      requestAnimationFrame(function () {
        answer.style.height = scrollH + 'px';
      });

      // Clean up after transition
      answer.addEventListener('transitionend', function handler() {
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
        answer.removeEventListener('transitionend', handler);
      });
    }

    function collapseAnswer(item) {
      var answer = item.querySelector('.faq-item__answer');
      if (!answer) return;

      // Set explicit height so we can transition from it
      answer.style.height = answer.scrollHeight + 'px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 0.3s ease';

      requestAnimationFrame(function () {
        answer.style.height = '0';
      });

      answer.addEventListener('transitionend', function handler() {
        item.classList.remove('faq-item--open');
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
        answer.removeEventListener('transitionend', handler);
      });
    }
  }

  // -------------------------------------------------
  // 5. Scroll Reveal (IntersectionObserver)
  // -------------------------------------------------
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-40px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // -------------------------------------------------
  // 6. Insights Shuffle
  // -------------------------------------------------
  var shuffleBtns = document.querySelectorAll('.shuffle-btn');
  var insightsGrid = document.querySelector('.insights-grid');

  if (shuffleBtns.length && insightsGrid) {
    shuffleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cards = Array.from(insightsGrid.querySelectorAll('.insight-card'));
        if (cards.length < 2) return;

        // Fisher-Yates shuffle
        for (var i = cards.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = cards[i];
          cards[i] = cards[j];
          cards[j] = temp;
        }

        // Fade out, reorder, fade in
        insightsGrid.style.transition = 'opacity 0.2s ease';
        insightsGrid.style.opacity = '0';

        setTimeout(function () {
          cards.forEach(function (card) {
            insightsGrid.appendChild(card);
          });
          insightsGrid.style.opacity = '1';

          insightsGrid.addEventListener('transitionend', function handler() {
            insightsGrid.style.transition = '';
            insightsGrid.removeEventListener('transitionend', handler);
          });
        }, 200);
      });
    });
  }
});
