// Personal settings. Edit the values below, save, and refresh the page.
// Anything left as '' (empty) is hidden instead of showing a broken link.
// Values that start with YOUR_ are treated as "not filled in yet" and are also hidden where it matters.
// (Your bio, education, skills and resume cards are edited directly in index.html.)

window.PORTFOLIO_CONFIG = {
  name: 'Afridi',
  initials: 'AF', // Shown in the logo box
  title: 'Web Developer & Designer',
  intro:
    'I’m a student learning web development. I enjoy turning ideas into clean, responsive websites and I’m always practicing something new.',
  invitation:
    "Have a project in mind or just want to say hello? Send a message and I'll get back to you.",

  email: 'laufey.e661@gmail.com', // e.g. name@example.com
  phone: '01234567899', // Optional, e.g. +880 1XXX XXXXXX. Leave '' to hide.
  location: 'YOUR_LOCATION', // Optional. Leave '' to hide.

  // Full profile URLs. Leave '' (or keep YOUR_...) to hide that icon.
  socials: {
    github: 'YOUR_GITHUB_URL',
    linkedin: 'YOUR_LINKEDIN_URL',
    twitter: '',
    facebook: '',
    instagram: '',
  },

  // CV download.
  // 1) Put your PDF at files/resume.pdf
  // 2) Set cvAvailable to true. (On a web server the site also detects the file by itself.)
  cvPath: 'files/resume.pdf',
  cvFileName: 'YOUR_NAME-CV.pdf',
  cvAvailable: false,

  // Contact form delivery. A static website cannot send email by itself.
  // Paste the endpoint URL of a form service here (for example a Formspree form URL).
  // This URL is public by design. NEVER put a secret API key in this file.
  // While this is '', the form shows an honest message and offers an email-app fallback.
  formEndpoint: 'https://formspree.io/f/mjyyygor',
};
