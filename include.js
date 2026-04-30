var _base = document.querySelector('script[src*="include.js"]').src.replace(/include\.js$/, '');

// Patch all relative hrefs in an injected component so they resolve
// from the site root (_base) rather than the current page's directory.
function patchLinks(selector) {
  var isIndex = window.location.pathname === '/' ||
                window.location.pathname.endsWith('/') ||
                window.location.pathname.endsWith('index.html');

  document.querySelectorAll(selector + ' a[href]').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href.startsWith('#')) {
      // Anchor-only links: on non-index pages, prefix with index.html
      if (!isIndex) {
        a.setAttribute('href', _base + 'index.html' + href);
      }
    } else if (
      !href.startsWith('http') &&
      !href.startsWith('//') &&
      !href.startsWith('/') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:')
    ) {
      // Relative path (e.g. tools.html, privacy.html): prefix with _base
      a.setAttribute('href', _base + href);
    }
  });
}

async function loadComponent(selector, file, callback) {
  const res = await fetch(_base + file);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
  if (callback) callback();
}

function initHeader() {
  var html = document.documentElement;

  patchLinks('#header-placeholder');

  // Theme toggle button
  var btn = document.getElementById('themeToggle');
  var label = btn.querySelector('.toggle-label');
  function updateLabel() {
    label.textContent = html.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light';
  }
  updateLabel();
  btn.addEventListener('click', function () {
    var isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateLabel();
  });

  // Hamburger menu
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('nav-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('nav-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initFooter() {
  patchLinks('#footer-placeholder');
}

loadComponent('#header-placeholder', 'components/header.html', initHeader);
loadComponent('#footer-placeholder', 'components/footer.html', initFooter);
