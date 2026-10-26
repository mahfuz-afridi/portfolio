// Contact form: validation and submission feedback.
// A static site cannot send email on its own. Set formEndpoint in js/config.js to a form service,
// otherwise the form tells the visitor honestly that nothing was sent and offers an email-app fallback.
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var config = window.PORTFOLIO_CONFIG || {};
  var statusBox = document.getElementById('form-status');
  var submitButton = document.getElementById('contact-submit');
  var submitLabel = document.getElementById('contact-submit-label');

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var fields = {
    name: { input: document.getElementById('contact-name'), error: document.getElementById('contact-name-error') },
    email: { input: document.getElementById('contact-email-input'), error: document.getElementById('contact-email-input-error') },
    message: { input: document.getElementById('contact-message'), error: document.getElementById('contact-message-error') },
  };
  var honeypot = document.getElementById('contact-company');

  function validate() {
    var errors = {};
    var name = fields.name.input.value.trim();
    var email = fields.email.input.value.trim();
    var message = fields.message.input.value.trim();

    if (!name) errors.name = 'Please enter your name.';
    if (!email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';
    if (!message) errors.message = 'Please write a message.';
    else if (message.length < 10) errors.message = 'Your message should be at least 10 characters.';
    return errors;
  }

  function showErrors(errors) {
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      var text = errors[key] || '';
      field.error.textContent = text;
      field.input.setAttribute('aria-invalid', text ? 'true' : 'false');
    });
  }

  function clearStatus() {
    while (statusBox.firstChild) statusBox.removeChild(statusBox.firstChild);
  }

  function showStatus(kind, text, mailtoUrl) {
    clearStatus();
    var p = document.createElement('p');
    p.className = kind === 'ok' ? 'form-status__ok' : 'form-status__bad';
    p.textContent = text;
    if (mailtoUrl) {
      p.appendChild(document.createTextNode(' '));
      var link = document.createElement('a');
      link.href = mailtoUrl;
      link.textContent = 'Open in your email app';
      p.appendChild(link);
      p.appendChild(document.createTextNode('.'));
    }
    statusBox.appendChild(p);
  }

  function hasRealEmail() {
    return typeof config.email === 'string' && config.email.trim() !== '' && !/^YOUR_/.test(config.email.trim());
  }

  // Builds a mailto: link with the visitor's text, but only if the owner's email is set.
  function buildMailto() {
    if (!hasRealEmail()) return '';
    var subject = 'Message from ' + fields.name.input.value.trim();
    var body = fields.message.input.value.trim() + '\n\nFrom: ' + fields.email.input.value.trim();
    return 'mailto:' + encodeURIComponent(config.email.trim()) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitLabel.textContent = isLoading ? 'Sending...' : 'Send Message';
  }

  // Clear a field's error as soon as the visitor edits it
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('input', function () {
      fields[key].error.textContent = '';
      fields[key].input.setAttribute('aria-invalid', 'false');
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Honeypot: real visitors never fill this in. Quietly ignore bots.
    if (honeypot && honeypot.value) return;

    var errors = validate();
    showErrors(errors);
    clearStatus();
    var firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      fields[firstInvalid].input.focus();
      return;
    }

    var endpoint = typeof config.formEndpoint === 'string' ? config.formEndpoint.trim() : '';
    if (!endpoint) {
      showStatus(
        'bad',
        'This form is not connected to a delivery service yet, so nothing was sent.',
        buildMailto()
      );
      return;
    }

    setLoading(true);
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        message: fields.message.input.value.trim(),
      }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed with status ' + response.status);
        form.reset();
        showStatus('ok', 'Thanks! Your message was sent.');
      })
      .catch(function () {
        showStatus('bad', 'Something went wrong and your message was not sent. Please try again.', buildMailto());
      })
      .then(function () {
        setLoading(false);
      });
  });
})();
