// Contact page: three toggles that switch the viewpane between the Cal.com
// scheduler, the Tally message form and the Little Answers form.
// Each embed loads the first time its pane is shown. A hash such as
// contact.html#little-answers opens that pane directly.
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.contact-tab'));
  if (!tabs.length) return;
  var names = tabs.map(function (t) { return t.getAttribute('data-pane'); });
  var loaded = {};

  // ── Tally (message + Little Answers forms) ──
  function loadTally() {
    var d = document, w = 'https://tally.so/widgets/embed.js';
    var v = function () {
      if (typeof Tally !== 'undefined') Tally.loadEmbeds();
      else d.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function (e) { e.src = e.dataset.tallySrc; });
    };
    if (typeof Tally !== 'undefined') v();
    else if (!d.querySelector('script[src="' + w + '"]')) {
      var s = d.createElement('script');
      s.src = w; s.onload = v; s.onerror = v;
      d.body.appendChild(s);
    } else v();
  }

  // ── Cal.com inline scheduler ──
  function loadCal() {
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    Cal('init', 'contact', { origin: 'https://app.cal.com' });
    Cal.ns.contact('inline', {
      elementOrSelector: '#cal-inline',
      calLink: 'safecamp',
      config: { layout: 'month_view', theme: theme }
    });
    Cal.ns.contact('ui', { theme: theme, hideEventTypeDetails: false, layout: 'month_view' });

    // Keep the scheduler's theme in step with the site toggle
    new MutationObserver(function () {
      var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      Cal.ns.contact('ui', { theme: t });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function load(name) {
    if (loaded[name]) return;
    loaded[name] = true;
    if (name === 'call') loadCal();
    else loadTally();
  }

  function select(name, focus) {
    if (names.indexOf(name) === -1) name = names[0];
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-pane') === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById('pane-' + t.getAttribute('data-pane')).hidden = !on;
      if (on && focus) t.focus();
    });
    load(name);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      var name = t.getAttribute('data-pane');
      select(name);
      history.replaceState(null, '', '#' + name);
    });
    t.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (next !== null) {
        e.preventDefault();
        select(names[next], true);
        history.replaceState(null, '', '#' + names[next]);
      }
    });
  });

  var start = location.hash.slice(1);
  if (start === 'little-answers-faq') start = 'little-answers';
  select(start);
  // Only pane names switch toggles; other anchors (like the FAQ link) just scroll.
  window.addEventListener('hashchange', function () {
    var name = location.hash.slice(1);
    if (names.indexOf(name) !== -1) select(name);
  });
})();
