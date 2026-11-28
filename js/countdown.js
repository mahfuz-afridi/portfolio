// Dr. Doom countdown: a floating trigger that opens a full-screen countdown overlay.
// The target is a fixed UTC instant, so every visitor sees the same remaining time in any timezone.
(function () {
  'use strict';

  // 12:00 AM on December 18, 2026 in Bangladesh (UTC+6) is 6:00 PM on December 17, 2026 in UTC.
  // To change the date, edit this one line.
  var TARGET_MS = Date.UTC(2026, 11, 18, 5, 0, 0);

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  var fab = document.getElementById('doom-fab');
  var overlay = document.getElementById('doom-countdown');
  var closeButton = document.getElementById('doom-close');
  if (!fab || !overlay || !closeButton) return;

  var doneMessage = overlay.querySelector('.doom-overlay__done');
  var numbers = {
    days: overlay.querySelector('[data-unit="days"]'),
    hours: overlay.querySelector('[data-unit="hours"]'),
    minutes: overlay.querySelector('[data-unit="minutes"]'),
    seconds: overlay.querySelector('[data-unit="seconds"]'),
  };

  var timerId = null;
  var isOpen = false;

  // Background music: only downloads and plays once the overlay is opened.
  var audio = new Audio('audio/Alan Silvestri - Whatever It Takes (From Avengers Endgame Audio Only).mp3');
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = 'none';

  // Tick sound: a very short clip played once every second while the overlay is open.
  var tickSound = new Audio('audio/tick.mp3');
  tickSound.volume = 0.4;
  tickSound.preload = 'auto'; // Tiny file, so load it early to avoid a delay on the first tick

  function pad(value) {
    return value < 10 ? '0' + value : String(value);
  }

  // Remaining time is always computed from the clock, never counted down from a stored value,
  // so reopening, refreshing or a backgrounded tab cannot make it drift or restart.
  function remainingMs() {
    return Math.max(0, TARGET_MS - Date.now());
  }

  function paint(remaining) {
    numbers.days.textContent = pad(Math.floor(remaining / DAY));
    numbers.hours.textContent = pad(Math.floor((remaining % DAY) / HOUR));
    numbers.minutes.textContent = pad(Math.floor((remaining % HOUR) / MINUTE));
    numbers.seconds.textContent = pad(Math.floor((remaining % MINUTE) / SECOND));
  }

  function tick() {
    var remaining = remainingMs();
    paint(remaining);
    doneMessage.hidden = remaining > 0;

    if (remaining === 0) {
      timerId = null; // Reached the target: stop the loop, the display stays at zero
      return;
    }

    tickSound.currentTime = 0; // Restart the clip so every second gets a fresh tick
    tickSound.play().catch(function () {}); // If the file is missing or blocked, the page still works

    // TARGET_MS falls on a whole second, so the digits change exactly when remaining % 1000 reaches 0
    timerId = window.setTimeout(tick, remaining % SECOND || SECOND);
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add('is-open');
    document.documentElement.classList.add('doom-open');
    fab.setAttribute('aria-expanded', 'true');
    stopTimer(); // Never run two loops at once
    audio.play().catch(function () {}); // Start music inside the click, so the browser allows it
    tick();
    closeButton.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    stopTimer(); // No timer runs while the overlay is closed
    audio.pause();
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('doom-open');
    fab.setAttribute('aria-expanded', 'false');
    fab.focus({ preventScroll: true });
  }

  fab.hidden = false; // Only offered when JavaScript can open it
  fab.addEventListener('click', open);
  closeButton.addEventListener('click', close);

  document.addEventListener('keydown', function (event) {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'Tab') {
      // Keep keyboard focus inside the overlay: its only control is the close button
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
