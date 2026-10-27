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
  function updateLabel() {
    var isDark = html.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
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
}

function initFooter() {
  patchLinks('#footer-placeholder');

  var logoImg = document.querySelector('#footer-placeholder .footer-logo-img');
  if (!logoImg) return;

  function updateFooterLogo() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    logoImg.src = _base + (isDark
      ? 'images/contact-illustration.gif'
      : 'images/SafeCamp_black.gif');
  }

  updateFooterLogo();

  new MutationObserver(updateFooterLogo).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

loadComponent('#header-placeholder', 'components/header.html', initHeader);
loadComponent('#footer-placeholder', 'components/footer.html', initFooter);
