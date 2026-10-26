// Mobile menu, active-section highlighting, and reveal-on-scroll.
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  var links = menu ? Array.prototype.slice.call(menu.querySelectorAll('.nav__link')) : [];

  // ----- Mobile menu -----
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    var use = toggle.querySelector('use');
    if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
  }

  if (toggle && menu) {
    toggle.hidden = false; // CSS only shows it on small screens
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });

    // Close after choosing a link
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });

    // Close with Escape and return focus to the button
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when the window grows past the mobile breakpoint
    var desktop = window.matchMedia('(min-width: 861px)');
    var onChange = function (event) {
      if (event.matches) setMenu(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange); // very old browsers
  }

  // ----- Active section indicator -----
  var sections = links
    .map(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // A band across the upper-middle of the screen decides which section is "current"
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
  setActive('home');

  // ----- Reveal on scroll -----
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    // Projects are added by main.js after this file runs, so observe them through a small public hook.
    window.PORTFOLIO_OBSERVE_REVEAL = function () {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
        revealObserver.observe(el);
      });
    };
  } else {
    // No IntersectionObserver: show everything immediately
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
    window.PORTFOLIO_OBSERVE_REVEAL = function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
    };
  }
})();
