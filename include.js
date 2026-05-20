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

  var logoImg = document.querySelector('#footer-placeholder .footer-logo-img');
  if (!logoImg) return;

  var freezeTimer = null;

  // Parse total one-loop duration (ms) from a GIF's frame delays
  function getGifDuration(url, cb) {
    fetch(url).then(function(r) { return r.arrayBuffer(); }).then(function(buf) {
      var d = new Uint8Array(buf);
      var packed = d[10];
      var gctBytes = ((packed >> 7) & 1) ? 3 * (2 << (packed & 7)) : 0;
      var i = 13 + gctBytes;
      var ms = 0;
      while (i < d.length) {
        if (d[i] === 0x3B) break; // trailer
        if (d[i] === 0x21 && d[i + 1] === 0xF9) { // Graphic Control Extension
          ms += ((d[i + 4] | d[i + 5] << 8) || 10) * 10; // centiseconds → ms
          i += 8;
        } else if (d[i] === 0x2C) { // image descriptor
          var lctBytes = ((d[i + 9] >> 7) & 1) ? 3 * (2 << (d[i + 9] & 7)) : 0;
          i += 10 + lctBytes + 1;
          while (d[i]) i += d[i] + 1;
          i++;
        } else if (d[i] === 0x21) { // other extension
          i += 2;
          while (d[i]) i += d[i] + 1;
          i++;
        } else { i++; }
      }
      cb(ms || 3000);
    }).catch(function() { cb(3000); });
  }

  // Draw current frame to canvas, replace src with a static PNG to freeze animation
  function freezeGif(img) {
    if (!img.complete || !img.naturalWidth) return;
    var c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    img.src = c.toDataURL('image/png');
  }

  function updateFooterLogo() {
    if (freezeTimer) { clearTimeout(freezeTimer); freezeTimer = null; }
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var src = _base + (isDark ? 'images/contact-illustration.gif' : 'images/SafeCamp_black.gif');
    logoImg.src = src;
    // Dark mode GIF has loop=1 baked in; light mode GIF loops infinitely, so freeze it
    if (!isDark) {
      var startTime = Date.now();
      getGifDuration(src, function(ms) {
        // Account for time already elapsed while fetching the GIF binary
        var remaining = Math.max(ms - (Date.now() - startTime) + 100, 100);
        freezeTimer = setTimeout(function() { freezeGif(logoImg); }, remaining);
      });
    }
  }

  updateFooterLogo();

  // Re-run whenever the theme toggle flips data-theme on <html>
  new MutationObserver(updateFooterLogo).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

loadComponent('#header-placeholder', 'components/header.html', initHeader);
loadComponent('#footer-placeholder', 'components/footer.html', initFooter);
