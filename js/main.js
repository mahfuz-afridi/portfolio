// Entry point: fills in personal details from js/config.js, draws social icons and project cards,
// sets the footer year, handles the CV button, and starts scroll reveal.
(function () {
  'use strict';

  var config = window.PORTFOLIO_CONFIG || {};

  function isFilled(value) {
    return typeof value === 'string' && value.trim() !== '' && !/^YOUR_/.test(value.trim());
  }

  // Marks the page as "JavaScript is running" so CSS may hide reveal items and collapse the mobile menu.
  document.documentElement.classList.add('js-ready');

  // ----- Text bindings: <span data-bind="name"> etc. -----
  // Config values replace the sample text. An empty value keeps the HTML sample text.
  function applyBindings() {
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var key = el.getAttribute('data-bind');
      var value = config[key];
      if (typeof value === 'string' && value.trim() !== '') el.textContent = value;
    });

    if (config.name && /^YOUR_/.test(config.name) === false) {
      document.title = config.name + ' | ' + (config.title || 'Portfolio');
    }
  }

  // ----- Contact details -----
  function applyContact() {
    var email = document.getElementById('contact-email');
    if (email) {
      if (isFilled(config.email)) {
        email.href = 'mailto:' + config.email.trim();
      } else {
        // No real email yet: show plain text, not a dead link
        var plain = document.createElement('span');
        plain.textContent = 'Email not added yet (set it in js/config.js)';
        email.replaceWith(plain);
      }
    }

    var phoneItem = document.getElementById('contact-phone-item');
    var phone = document.getElementById('contact-phone');
    if (phoneItem && phone && isFilled(config.phone)) {
      phone.textContent = config.phone;
      phone.href = 'tel:' + config.phone.replace(/[^\d+]/g, '');
      phoneItem.hidden = false;
    }

    var locationItem = document.getElementById('contact-location-item');
    if (locationItem && isFilled(config.location)) locationItem.hidden = false;
  }

  // ----- Social icons -----
  var NETWORKS = [
    { key: 'github', label: 'GitHub', icon: 'github' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
    { key: 'twitter', label: 'X (Twitter)', icon: 'twitter' },
    { key: 'facebook', label: 'Facebook', icon: 'facebook' },
    { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  ];
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function renderSocials() {
    var socials = config.socials || {};
    var containers = document.querySelectorAll('[data-socials]');

    containers.forEach(function (list) {
      NETWORKS.forEach(function (network) {
        var url = socials[network.key];
        if (!isFilled(url)) return;

        var item = document.createElement('li');
        var link = document.createElement('a');
        link.className = 'social-links__link';
        link.href = url.trim();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', network.label + ' (opens in a new tab)');

        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'icon');
        svg.setAttribute('aria-hidden', 'true');
        var use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', '#i-' + network.icon);
        svg.appendChild(use);

        link.appendChild(svg);
        item.appendChild(link);
        list.appendChild(item);
      });
    });
  }

  // ----- Footer year -----
  function setYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  // ----- CV button -----
  // Turns the disabled button into a real download link, but only when the PDF is known to exist.
  function enableCv() {
    var button = document.getElementById('cv-button');
    var hint = document.getElementById('cv-hint');
    if (!button || !config.cvPath) return;

    function activate() {
      var link = document.createElement('a');
      link.className = button.className;
      link.href = config.cvPath;
      link.setAttribute('download', config.cvFileName || 'resume.pdf');
      while (button.firstChild) link.appendChild(button.firstChild);
      // Replace the text node "CV not available yet" with the real label
      Array.prototype.slice.call(link.childNodes).forEach(function (node) {
        if (node.nodeType !== Node.TEXT_NODE) return;
        // Only the visible label gets replaced; whitespace-only nodes are left alone
        if (node.textContent.trim() !== '') node.textContent = ' Download CV';
      });
      button.replaceWith(link);
      if (hint) hint.hidden = true;
    }

    var onWebServer = window.location.protocol === 'http:' || window.location.protocol === 'https:';

    if (onWebServer && window.fetch) {
      // On a real server, check that the PDF really exists (and is a PDF)
      fetch(config.cvPath, { method: 'HEAD' })
        .then(function (response) {
          var type = response.headers.get('content-type') || '';
          if (response.ok && type.indexOf('pdf') !== -1) activate();
        })
        .catch(function () {
          // Leave the placeholder state in place
        });
    } else if (config.cvAvailable === true) {
      // Browsers cannot check files when a page is opened straight from disk, so trust the config flag
      activate();
    }
  }

  // ----- Back to top -----
  // The link already works through the #home anchor; this adds smooth focus handling.
  function setupBackToTop() {
    var link = document.getElementById('back-to-top');
    if (!link) return;
    link.addEventListener('click', function (event) {
      var target = document.getElementById('home');
      if (!target) return;
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  // ----- Intro screen -----
  // The animation itself is pure CSS (see animations.css). This only starts it once the font is
  // ready, locks scrolling while it plays, and removes the overlay afterwards so nothing is blocked.
  function setupIntro() {
    var intro = document.getElementById('intro');
    if (!intro) return;

    var root = document.documentElement;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      intro.remove();
      return;
    }

    var finished = false;
    var leaving = false;
    var started = false;

    root.classList.add('intro-active');

    function finish() {
      if (finished) return;
      finished = true;
      root.classList.remove('intro-active');
      intro.remove();
    }

    // Skip: click, tap or any key
    function leave() {
      if (leaving || finished) return;
      leaving = true;
      root.classList.remove('intro-active');
      intro.classList.add('is-leaving');
    }

    function play() {
      if (started || leaving) return;
      started = true;
      intro.classList.add('is-playing');
      window.setTimeout(finish, 4500); // safety net
    }

    // Unlock scrolling and start the hero animation as the fade-out begins
    intro.addEventListener('animationstart', function (event) {
      if (event.target === intro && event.animationName === 'intro-out') {
        root.classList.remove('intro-active');
      }
    });
    intro.addEventListener('animationend', function (event) {
      if (event.target === intro && event.animationName === 'intro-out') finish();
    });

    intro.addEventListener('click', leave);
    document.addEventListener('keydown', leave, { once: true });

    // Wait for Dancing Script (max 1.2s) so the name never flashes in a fallback font
    if (document.fonts && document.fonts.load) {
      var wait = new Promise(function (resolve) { window.setTimeout(resolve, 1200); });
      Promise.race([document.fonts.load('700 1em "Dancing Script"', config.name || 'Afridi'), wait]).then(play, play);
    } else {
      play();
    }
  }

  setupIntro();
  applyBindings();
  applyContact();
  renderSocials();
  setYear();
  enableCv();
  setupBackToTop();

  if (typeof window.PORTFOLIO_RENDER_PROJECTS === 'function') window.PORTFOLIO_RENDER_PROJECTS();
  if (typeof window.PORTFOLIO_OBSERVE_REVEAL === 'function') window.PORTFOLIO_OBSERVE_REVEAL();
})();
