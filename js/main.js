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
      // Collapse all open sub-menus
      var expandBtns = mobileMenu.querySelectorAll('.nav__mobile-expand');
      expandBtns.forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
        var ch = btn.closest('.nav__mobile-group').querySelector('.nav__mobile-children');
        if (ch) ch.hidden = true;
      });
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
  // 2b. Compact Scroll Header
  // Shows compact bar when scrolled past the main nav.
  // -------------------------------------------------
  var mainNav = document.querySelector('.nav');
  var scrollNav = document.querySelector('.nav-scroll');

  if (mainNav && scrollNav) {
    var navHeight = mainNav.offsetHeight;
    var scrollToggle = scrollNav.querySelector('.nav-scroll__toggle');

    // Compact bar hamburger opens the main mobile menu
    if (scrollToggle && toggle && mobileMenu) {
      scrollToggle.addEventListener('click', function () {
        var isOpen = toggle.classList.toggle('nav__toggle--open');
        mobileMenu.classList.toggle('nav__mobile--open', isOpen);
        mobileMenu.classList.toggle('nav__mobile--from-scroll', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    window.addEventListener('scroll', function () {
      if (window.scrollY > navHeight) {
        scrollNav.classList.add('nav-scroll--visible');
      } else {
        scrollNav.classList.remove('nav-scroll--visible');
      }
    }, { passive: true });
  }

  // -------------------------------------------------
  // 3. Mobile Sub-menu Accordion (editor-generated nav)
  // -------------------------------------------------
  if (mobileMenu) {
    var expandBtns = mobileMenu.querySelectorAll('.nav__mobile-expand');

    expandBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var children = btn.closest('.nav__mobile-group').querySelector('.nav__mobile-children');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        children.hidden = isOpen;
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

  // -------------------------------------------------
  // 7. Contact Form Submission
  // -------------------------------------------------
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            contactForm.innerHTML =
              '<div class="form__success">' +
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' +
              '<h3>Message Sent</h3>' +
              '<p>' + (data.data && data.data.message ? data.data.message : 'Thank you for getting in touch. I’ll respond within two working days.') + '</p>' +
              '</div>';
          } else {
            throw new Error(data.error || 'Something went wrong.');
          }
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          var errorDiv = contactForm.querySelector('.form__error');
          if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form__error';
            submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
          }
          errorDiv.textContent = err.message || 'Something went wrong. Please try again.';
        });
    });
  }
});