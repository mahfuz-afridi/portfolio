# Personal Portfolio Website (HTML, CSS, JavaScript)

A dark, responsive personal portfolio built with plain HTML, CSS and JavaScript. There is no npm, no build step and no framework. **Double-click `index.html` and it works.**

> Everything in this project is sample content (`YOUR_NAME`, sample projects, sample skills). Nothing in it is a real claim about anyone. Replace it with your own information.

## How to open it

- **Easiest:** double-click `index.html`. It opens in your browser.
- **Optional, with VS Code Live Server:** install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server". The page then reloads automatically when you save.

## Folder structure

```
portfolio-website/
├── index.html            Page structure and your text content
├── css/
│   ├── style.css         Design tokens (colors, spacing) and all component styles
│   ├── responsive.css    Tablet and phone layouts
│   └── animations.css    Fade-in, glow, float, scroll reveal
├── js/
│   ├── config.js         YOUR personal settings (name, email, socials, CV, form)
│   ├── projects.js       Your project list + code that draws the project cards
│   ├── theme.js          Light/dark toggle
│   ├── navigation.js     Mobile menu, active link, scroll reveal
│   ├── contact.js        Contact form validation and feedback
│   └── main.js           Fills in config values, social icons, year, CV button
├── assets/
│   ├── images/           Placeholder SVG images (replace with your own)
│   └── icons/favicon.svg Browser tab icon
├── files/                Put resume.pdf here (you create this file/folder)
└── README.md
```

## Personalize it

### 1. Basic details: `js/config.js`

Open it in any text editor and replace every `YOUR_...` value:

| Setting | What to put |
| --- | --- |
| `name`, `initials` | Your name and the initials in the logo box |
| `title`, `intro` | Your headline and a short introduction |
| `email`, `phone`, `location` | Contact details. Leave `phone` or `location` as `''` to hide them |
| `socials` | Full profile URLs (GitHub, LinkedIn, X, Facebook, Instagram). Empty or `YOUR_...` values are hidden, so there are no dead icons |

Save the file and refresh the page.

### 2. Your story: `index.html`

Search for these words and replace the text around them: `SAMPLE`, `YOUR_EDUCATION`, `YOUR_INTERESTS`, `YOUR_EXPERIENCE_SUMMARY`, `YOUR_DEGREE_OR_PROGRAM`, `YOUR_SCHOOL_OR_UNIVERSITY`, `YOUR_ROLE`, `YOUR_ORGANIZATION`, `YOUR_CERTIFICATE_OR_ACHIEVEMENT`. This covers the About text, the info cards and the Resume cards. Delete any card you do not need. Only write qualifications and experience that are true.

Skills are also in `index.html` (section `id="skills"`). Each skill is one `<li class="skill-card">`. Edit the name, copy a card to add one, or delete a card to remove one.

### 3. Projects: `js/projects.js`

The list at the top of the file holds each project. Edit the three samples or add your own. Leave `demoUrl` or `sourceUrl` as `''` if you do not have one yet: the card shows a disabled "not added" button instead of a broken link.

### 4. Page title and sharing preview: `index.html`

In the `<head>`, replace `YOUR_NAME` in the title and description, and replace `YOUR_SITE_URL` in the `og:` tags after you deploy. Point `og:image` at a real image.

## Replace images

| Image | File | Tips |
| --- | --- | --- |
| Hero photo | `assets/images/profile-placeholder.svg` | Easiest: save your photo as `assets/images/me.jpg`, then in `index.html` change the hero `<img src="...">` to `assets/images/me.jpg` and update its `alt` text. A portrait around 600x700 works best. |
| About photo | `assets/images/about-placeholder.svg` | Same steps, in the About section `<img>`. |
| Project thumbnails | `assets/images/weather-app.svg`, `portfolio-project.svg`, `todo-app.svg` | Use 16:10 images (for example 1280x800). Change the `image` path in `js/projects.js`. |
| Favicon | `assets/icons/favicon.svg` | Edit the initials, or replace with your own `.svg`/`.png` and update the `<link rel="icon">` in `index.html`. |

The placeholders are SVG files because they can be written as text. JPG or PNG files work just as well for your real images.

## Add your CV

1. Save your PDF as `files/resume.pdf` (create the `files` folder if it is missing).
2. In `js/config.js` set `cvAvailable: true`, and set `cvFileName` to the download name you want.
3. Refresh. The grey "CV not available yet" button becomes a working "Download CV" link.

Why the flag? Browsers cannot check whether a file exists when a page is opened straight from disk. Once the site is on a web server (GitHub Pages, Netlify), it detects the PDF by itself, so the flag is only needed for local use.

## Contact form

The form checks the name, email format and message length in the browser, and includes a hidden spam-trap field for simple bots.

**A static website cannot send email by itself.** You need a form service or your own backend:

1. Create a form at a service such as [Formspree](https://formspree.io) or [Netlify Forms](https://docs.netlify.com/forms/setup/), or write your own endpoint.
2. Paste the endpoint URL into `formEndpoint` in `js/config.js`.
3. Test it by sending yourself a message.

Until `formEndpoint` is set, submitting shows an honest message that nothing was sent, plus an "Open in your email app" link (once your real email is in `config.js`). **Never put a secret API key in these files:** everything in them is public. For extra spam protection, turn on the service's CAPTCHA or rate limiting.

## Deploy

**GitHub Pages**
1. Create a GitHub repository and upload all files (with `index.html` at the top level).
2. Go to Settings, then Pages, choose the `main` branch and the `/ (root)` folder, and save.
3. After a minute your site is live at `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`.

**Netlify**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `portfolio-website` folder onto the page.
3. Netlify gives you a public address immediately. You can rename it in site settings.

After deploying, update `YOUR_SITE_URL` in `index.html`.

## Notes

- Light and dark themes are included; the choice is remembered in the browser.
- Animations switch off for visitors who prefer reduced motion.
- Colors, spacing and radii are CSS variables at the top of `css/style.css`.
- Without JavaScript, the page content and navigation links still work. Only the project cards, social icons and extras need JavaScript.
- The fonts (Inter and Caveat) load from Google Fonts. If you are offline, the browser uses your system fonts instead and the layout still works.
