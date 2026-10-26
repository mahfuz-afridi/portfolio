// Project data AND the code that draws the project cards.
// Add, remove, or edit entries in the list below; the cards update automatically.
//
// These three are SAMPLE projects. None of them is deployed.
// Leave demoUrl or sourceUrl as '' if you do not have one; the card then shows a disabled button.
// Thumbnails live in assets/images/. Replace the files or change the `image` path.

(function () {
  'use strict';

  var projects = [
    {
      title: 'Weather App',
      description:
        'SAMPLE: A weather dashboard that shows current conditions and a short forecast for a searched city.',
      image: 'assets/images/weather-app.svg',
      imageAlt: 'Placeholder thumbnail for the Weather App sample project',
      tags: ['JavaScript', 'REST API', 'CSS'],
      demoUrl: '',
      sourceUrl: '',
    },
    {
      title: 'Personal Portfolio',
      description:
        'SAMPLE: A responsive portfolio website with a dark theme, project showcase, and contact form.',
      image: 'assets/images/portfolio-project.svg',
      imageAlt: 'Placeholder thumbnail for the Personal Portfolio sample project',
      tags: ['HTML', 'CSS', 'JavaScript'],
      demoUrl: '',
      sourceUrl: '',
    },
    {
      title: 'BAFSC web page',
      description:
        'SAMPLE: A simple responsive web page, where you can know everythin about the collage  ',
      image: 'assets/images/todo-app.svg',
      imageAlt: 'Placeholder thumbnail for the To-Do Application sample project',
      tags: ['JavaScript', 'localStorage', 'CSS'],
      demoUrl: 'https://mahfuz-afridi.github.io/clg1/',
      sourceUrl: '',
    },
  ];

  // ----- Rendering (you normally do not need to edit below this line) -----

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function isRealUrl(value) {
    if (typeof value !== 'string') return false;
    var trimmed = value.trim();
    return trimmed !== '' && !/^YOUR_/.test(trimmed);
  }

  function makeIcon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }

  // A real link when a URL exists, otherwise a disabled button (never a dead link).
  function makeAction(url, label, missingLabel, iconName, variant) {
    var el;
    if (isRealUrl(url)) {
      el = document.createElement('a');
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.textContent = label + ' ';
    } else {
      el = document.createElement('button');
      el.type = 'button';
      el.disabled = true;
      el.title = 'No link added yet';
      el.textContent = missingLabel + ' ';
    }
    el.className = 'btn btn--' + variant;
    el.appendChild(makeIcon(iconName));
    return el;
  }

  function buildCard(project) {
    var card = document.createElement('article');
    card.className = 'project-card reveal';

    var media = document.createElement('div');
    media.className = 'project-card__media';
    var img = document.createElement('img');
    img.src = project.image;
    img.alt = project.imageAlt;
    img.width = 640;
    img.height = 400;
    img.loading = 'lazy';
    media.appendChild(img);

    var body = document.createElement('div');
    body.className = 'project-card__body';

    var title = document.createElement('h3');
    title.className = 'project-card__title';
    title.textContent = project.title;

    var text = document.createElement('p');
    text.className = 'project-card__text';
    text.textContent = project.description;

    var tags = document.createElement('ul');
    tags.className = 'tag-list';
    tags.setAttribute('aria-label', 'Technologies used in ' + project.title);
    project.tags.forEach(function (tag) {
      var li = document.createElement('li');
      li.className = 'tag';
      li.textContent = tag;
      tags.appendChild(li);
    });

    var actions = document.createElement('div');
    actions.className = 'project-card__actions';
    actions.appendChild(makeAction(project.demoUrl, 'Live Demo', 'Demo not added', 'external', 'primary'));
    actions.appendChild(makeAction(project.sourceUrl, 'Source Code', 'Code not added', 'github', 'secondary'));

    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(tags);
    body.appendChild(actions);

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function renderProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    projects.forEach(function (project) {
      grid.appendChild(buildCard(project));
    });
  }

  // Exposed so main.js can run it once the page is ready.
  window.PORTFOLIO_RENDER_PROJECTS = renderProjects;
})();
