var _base = document.querySelector('script[src*="include.js"]').src.replace(/include\.js$/, '');

async function loadComponent(selector, file, callback) {
  const res = await fetch(_base + file);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
  if (callback) callback();
}

function initHeader() {
  var html = document.documentElement;

  // On pages other than index.html, patch anchor-only nav links to include the page prefix
  var isIndex = window.location.pathname === '/' ||
                window.location.pathname.endsWith('/') ||
                window.location.pathname.endsWith('index.html');
  if (!isIndex) {
    document.querySelectorAll('#header-placeholder a[href^="#"]').forEach(function(a) {
      a.setAttribute('href', 'index.html' + a.getAttribute('href'));
    });
  }

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

loadComponent('#header-placeholder', 'components/header.html', initHeader);
loadComponent('#footer-placeholder', 'components/footer.html');
