// Light/dark theme toggle. The choice is remembered in localStorage.
(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-theme';
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');

  function readSaved() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (error) {
      // Storage can be blocked (private mode, some file:// setups). Use the default.
    }
    return 'dark';
  }

  function save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore: the theme still changes for this visit.
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (!button) return;
    var isDark = theme === 'dark';
    // The icon shows the theme you will switch TO.
    var use = button.querySelector('use');
    if (use) use.setAttribute('href', isDark ? '#i-sun' : '#i-moon');
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(readSaved());

  if (button) {
    button.hidden = false; // Only show the button when JavaScript can make it work
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      save(next);
    });
  }
})();
