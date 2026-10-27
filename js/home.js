// Homepage interactions: the "Pick your trail" tabs and the client logo ticker.

// ── 03 Pick your trail ─────────────────────────────────────────────
(function () {
  var tabsEl = document.getElementById('trailTabs');
  var blurbEl = document.getElementById('trailBlurb');
  var cardsEl = document.getElementById('trailCards');
  if (!tabsEl) return;

  // Each item can carry "more": a short note and/or bullet list for its "What's included" expander.
  var trails = [
    {
      id: 'trailhead', name: 'Trailhead', level: 'Get started', mark: 'triangle',
      blurb: 'Quick, low-commitment ways in. Get a straight answer, a working session, or a partner embedded for the long haul.',
      items: [
        { name: 'Little Answers', desc: 'One social media question, answered personally by email.', price: '$15' },
        { name: 'Consulting Call', desc: 'A focused 30-minute ($150) or 1-hour ($250) session for immediate answers.', price: '$150–$250' },
        { name: 'Custom Project', desc: 'A scoped engagement built around your needs, from a fast, time-boxed Sprint to an ongoing retainer.', price: 'Priced by scope · Retainers typically $8k+/mo',
          more: { groups: [
            ['Sprint', 'A focused, time-boxed engagement to move fast on one problem or opportunity, like a rapid audit or a quick-turn recommendation.'],
            ['Retainer', 'Reserved monthly time with me as your embedded strategist and operator, typically for six months or around a big campaign or event. It may include:']
          ], list: [
            'Being deeply embedded as a strategist and operator',
            'A dedicated email address, laptop, file access and/or specific software',
            'Joining ongoing meetings, such as weekly, monthly or ad hoc calls',
            'Onsite or offsite travel, with expenses billed'
          ] } }
      ]
    },
    {
      id: 'survey', name: 'Survey', level: 'Audits', mark: 'circle',
      blurb: 'Find out where you really stand before deciding where to go next.',
      items: [
        { name: 'Social Media Audit', desc: 'A review of your public channels and internal documentation to surface business opportunities, for one channel or many.', price: 'From $2k',
          more: { note: 'The scope can scale, from a single channel to many, and can include a review of backend nuances.' } },
        { name: 'LinkedIn Profile Audit', desc: 'Recommendations for every part of a LinkedIn profile, tailored to each person\u2019s goals. Often batched for executives or teams.', price: 'From $750 per profile, batch pricing available',
          more: { note: 'Each audit documents recommendations for every part of a profile, plus additional resources and considerations. Audits are often batched for a functional team, select executives and spokespeople, or to support activities like employee advocacy and training. Recommendations are tailored to goals such as pursuing a new role or new business development.' } }
      ]
    },
    {
      id: 'expedition', name: 'Expedition', level: 'Strategy', mark: 'square',
      blurb: 'Full systems for brands, executives and moments that matter, each tied directly to business, marketing and social objectives.',
      items: [
        { name: 'Social Media Playbook', desc: 'A complete system covering every part of your social strategy and operations, each tied to business, marketing and social objectives.', price: 'From $8k', signature: true,
          more: { groups: [
            ['Foundation', 'Business, marketing and social priorities; role of social media; objectives and measurement; budget; social audiences; social channel roles; automation'],
            ['Governance', 'Risk; legal; compliance; AI governance policy; platform policy compliance; account security protocols; employee access controls'],
            ['Customer Care', 'Operations and processes; team structure; community; customer servicing; response scenarios; social listening; crisis preparation'],
            ['Content', 'Owned assets; user-generated content; influencers and partners; employer brand; executive presence; employee advocacy; social selling'],
            ['Social by Design', 'Accessibility; brand guidelines; editorial style guide; dynamic elements; social post templates; integrated marketing; media optimization'],
            ['Social Advertising', 'Audience targeting; retargeting; budget allocation; social media pixels; A/B testing; brand and conversion lift; conversion optimization']
          ] } },
        { name: 'Executive Thought Leadership', desc: 'A personal playbook for one leader, spokesperson or founder, covering purpose, personal brand, content pillars, cadence and channels.', price: 'From $5k',
          more: { note: 'Also known as an Executive Purpose Playbook or Personal Brand Strategy. It may include:', list: [
            'Personal and professional purpose statements',
            'Personal brand elements',
            'Content and thought leadership pillars',
            'Content production and publishing cadence',
            'Key digital channels',
            'Integrations with other marketing plans, such as PR and internal and external comms'
          ] } },
        { name: 'Social Advertising Strategy', desc: 'Paid social, scoped to fit: a targeting brief, a full plan for your Playbook, campaign, event, or other scenario.', price: 'From $5k',
          more: { note: 'Scope scales with complexity and timing. A typical deliverable sequence:', list: [
            'Strategy foundation',
            'Pre-launch activities',
            'Initial setup and promotion',
            'Continued promotion and testing'
          ] } },
        { name: 'Digital Crisis Playbook', desc: 'A Listen, Analyze, Act framework with response protocols for the scenarios you\u2019re most likely to face.', price: 'From $6k',
          more: { note: 'This may include:', list: [
            'A Listen, Analyze, Act framework (or similar)',
            'Media response protocol',
            'Workflows for coordinating with PR, crisis comms and more',
            'Legal, risk and compliance'
          ] } },
        { name: 'Social Media Strategy for Events and Conferences', desc: 'Social recommendations for every touchpoint before, during and after an event.', price: 'From $5k',
          more: { note: 'This may include strategy for:', list: [
            'Content creation, including on-site production',
            'Social media advertising',
            'Staff, speaker and attendee involvement',
            'Social monitoring and listening',
            'Additional creative ideas, like WiFi naming and LinkedIn badges'
          ] } },
        { name: 'Digital Reviews Strategy', desc: 'For brands whose reputation lives on review platforms: which platforms to prioritize, response workflows, and proactive review generation.', price: 'From $5k',
          more: { note: 'Review platforms call for different thinking than standard community management. This may include:', list: [
            'Industry and competitor research',
            'Review platforms to prioritize',
            'Review management workflow',
            'Response messaging pool',
            'Ties to business, team and individual goals, like ratings and response speed',
            'Content recommendations to amplify positive reviews and address negative ones',
            'Proactive review generation'
          ] } }
      ]
    }
  ];

  // Join the last two words so a description never ends on a lone word
  function keepLastWords(text) {
    return text.replace(/ (\S+)$/, '\u00a0$1');
  }

  // Trail markers match the shapes the camper is carrying (colours sampled from his illustration)
  var MARKS = {
    triangle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2 21 19.2H3Z" fill="#709858" stroke="#0E1012" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    circle: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4" fill="#F0585C" stroke="#0E1012" stroke-width="2.2"/></svg>',
    square: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" fill="#FCD040" stroke="#0E1012" stroke-width="2.2"/></svg>'
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  var buttons = trails.map(function (t, i) {
    var b = el('button', 'trail-tab');
    b.type = 'button';
    b.id = 'trail-tab-' + t.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'trailPanel');
    var mark = el('span', 'mark');
    mark.innerHTML = MARKS[t.mark];
    b.appendChild(mark);
    var names = el('span', 'names');
    names.appendChild(el('b', '', t.name));
    names.appendChild(el('small', '', t.level));
    b.appendChild(names);
    b.addEventListener('click', function () { select(i); });
    b.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % trails.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + trails.length) % trails.length;
      if (next !== null) { e.preventDefault(); select(next); buttons[next].focus(); }
    });
    tabsEl.appendChild(b);
    return b;
  });

  // "What's included" slides up over its own card, so every card keeps the same size.
  var panelCount = 0;
  function included(card, more) {
    var id = 'included-' + (++panelCount);
    var open = el('button', 'more-btn', 'What\u2019s included');
    open.type = 'button';
    open.setAttribute('aria-expanded', 'false');
    open.setAttribute('aria-controls', id);

    var panel = el('div', 'more-panel');
    panel.id = id;
    panel.hidden = true;
    var close = el('button', 'more-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close details');
    close.innerHTML = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12"/></svg>';
    panel.appendChild(close);
    panel.appendChild(el('p', 'more-title', 'What\u2019s included'));
    if (more.note) panel.appendChild(el('p', '', more.note));
    (more.groups || []).forEach(function (g) {
      var p = el('p');
      p.appendChild(el('b', '', g[0]));
      p.appendChild(document.createTextNode(g[1]));
      panel.appendChild(p);
    });
    if (more.list) {
      var ul = el('ul');
      more.list.forEach(function (item) { ul.appendChild(el('li', '', item)); });
      panel.appendChild(ul);
    }

    function set(state) {
      open.setAttribute('aria-expanded', String(state));
      if (state) {
        panel.hidden = false;
        requestAnimationFrame(function () { card.classList.add('is-open'); });
        close.focus();
      } else {
        card.classList.remove('is-open');
        setTimeout(function () { if (!card.classList.contains('is-open')) panel.hidden = true; }, 260);
        open.focus();
      }
    }
    open.addEventListener('click', function () { set(true); });
    close.addEventListener('click', function () { set(false); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    return { button: open, panel: panel };
  }

  function select(index) {
    var t = trails[index];
    buttons.forEach(function (b, i) {
      b.setAttribute('aria-selected', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    document.getElementById('trailPanel').setAttribute('aria-labelledby', 'trail-tab-' + t.id);
    blurbEl.textContent = t.blurb;
    cardsEl.textContent = '';
    t.items.forEach(function (it) {
      var card = el('article', 'trail-card' + (it.signature ? ' is-signature' : ''));
      if (it.signature) card.appendChild(el('span', 'badge', 'Signature'));
      card.appendChild(el('h3', '', it.name));
      card.appendChild(el('p', 'desc', keepLastWords(it.desc)));
      var more = it.more ? included(card, it.more) : null;
      // Cards without details keep an empty slot so every footer lines up
      card.appendChild(more ? more.button : el('span', 'more-slot'));
      card.appendChild(el('p', 'price', it.price));
      if (more) card.appendChild(more.panel);
      cardsEl.appendChild(card);
    });
  }

  select(2); // Expedition first
})();

// ── Client logo ticker: auto-scroll, drag, and category filter ────────
(function () {
  var outer = document.getElementById('tickerOuter');
  var track = document.getElementById('tickerTrack');
  var label = document.getElementById('logosLabel');
  var reset = document.getElementById('logosReset');
  if (!track) return;

  // Alphabetical. Categories drive the filter; logos with none only show under "all".
  var logos = [
    ['ACT.png', 'nonprofit'],
    ['Alcon.svg', 'biotech'],
    ['Almond_Board.png', 'cpg'],
    ['ALS_Association.svg', 'nonprofit'],
    ['Amgen.svg', 'biotech'],
    ['Amicus_Therapeutics.svg', 'biotech'],
    ['ARS_Pharmaceuticals.png', 'pharma'],
    ['BabyBjorn.svg', 'cpg'],
    ['Bayer.svg', 'pharma'],
    ['BMO_Bank.svg', 'finance'],
    ['Boehringer_Ingelheim.svg', 'pharma'],
    ['Braintree_Payments.svg', 'finance'],
    ['CareerBuilder.svg', ''],
    ['CDW.svg', ''],
    ['Centria_autism.svg', ''],
    ['Comic_Relief_USA.svg', 'nonprofit'],
    ['Daiichi-Sankyo.svg', 'pharma'],
    ['Dairy_Management.png', 'cpg'],
    ['Depend.png', 'cpg'],
    ['Editas_Medicine.svg', 'biotech'],
    ['Education_For_Employment.svg', 'nonprofit'],
    ['Evofem_Biosciences.png', 'biotech'],
    ['Glade.svg', 'cpg'],
    ['Grounded.png', ''],
    ['GSK.svg', 'pharma'],
    ['Hanna_Andersson.svg', 'cpg'],
    ['hooli.png', ''],
    ['Hornitos.png', 'cpg'],
    ['Huntington_Bank.svg', 'finance'],
    ['Intarcia_Therapeutics.png', 'biotech'],
    ['Jacks_Pizza.avif', 'cpg'],
    ['Janssen_Neuroscience.svg', 'pharma'],
    ['Jenius_Bank.svg', 'finance'],
    ['Jim_Beam.svg', 'cpg'],
    ['KidsRights.png', 'nonprofit'],
    ['Kotex.svg', 'cpg'],
    ['Lilly_Oncology.svg', 'pharma'],
    ['Lundbeck_US.png', 'pharma'],
    ['McGraw_Hill_Education.svg', ''],
    ['Mission_Lane.svg', 'finance'],
    ['National_Restaurant_Association.svg', ''],
    ['Novo_Nordisk.svg', 'pharma'],
    ['Ogilvy.svg', ''],
    ['One_Earth.avif', 'nonprofit'],
    ['pied-piper.png', ''],
    ['Pfizer.svg', 'pharma'],
    ['Pinnacle_Vodka.svg', 'cpg'],
    ['Poise.png', 'cpg'],
    ['PorterNovelli.svg', ''],
    ['Procter_and_Gamble.svg', 'cpg'],
    ['Red_Wing_Shoes.svg', 'cpg'],
    ['Sams_Club.svg', ''],
    ['Sandoz.svg', 'pharma'],
    ['SC_Johnson.svg', 'cpg'],
    ['Shop_Your_Way.svg', ''],
    ['Tazo.svg', 'cpg'],
    ['Theirworld.svg', 'nonprofit'],
    ['Venmo.svg', 'finance'],
    ['Vidalia_Onion.svg', 'cpg'],
    ['Visby_Medical.png', 'biotech'],
    ['VML.png', '']
  ];

  logos.sort(function (a, b) {
    return a[0].localeCompare(b[0], 'en', { sensitivity: 'base' });
  });

  var posX = 0;        // current translateX in px, always <= 0
  var halfWidth = 0;   // width of one full copy of the logo run
  var SPEED = 0.4;     // px per frame (~24 px/s at 60 fps)
  var isDragging = false;
  var isPaused = false; // hovering the bar stops the auto-scroll
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var dragStartX = 0;
  var dragStartPos = 0;

  function wrap(x) {
    if (!halfWidth) return x;
    x = x % halfWidth;
    if (x > 0) x -= halfWidth;
    return x;
  }

  function build(category) {
    var files = logos.filter(function (l) { return !category || l[1] === category; })
                     .map(function (l) { return l[0]; });
    // One "run" repeats the set until it is wider than the screen, so short
    // filtered sets still fill the bar; the track holds two runs for the loop.
    var logoW = window.innerWidth <= 768 ? 100 + 48 : 120 + 64;
    var reps = Math.max(1, Math.ceil((outer.clientWidth * 1.2) / (files.length * logoW)));
    var run = [];
    for (var i = 0; i < reps; i++) run = run.concat(files);
    track.textContent = '';
    run.concat(run).forEach(function (file) {
      var img = document.createElement('img');
      img.src = 'images/clients/' + file;
      img.alt = '';
      img.className = 'ticker-logo';
      img.draggable = false;
      track.appendChild(img);
    });
    halfWidth = run.length * logoW;
    posX = 0;
  }

  function tick() {
    if (!isDragging && !isPaused && !reduceMotion.matches) posX = wrap(posX - SPEED);
    track.style.transform = 'translateX(' + posX + 'px)';
    requestAnimationFrame(tick);
  }

  // ── Category filter ──
  var current = '';
  function setCategory(cat) {
    current = cat;
    label.querySelectorAll('button[data-cat]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat));
    });
    reset.hidden = !cat;
    track.classList.add('is-swapping');
    setTimeout(function () {
      build(cat);
      track.classList.remove('is-swapping');
    }, 250);
  }
  label.querySelectorAll('button[data-cat]').forEach(function (b) {
    b.addEventListener('click', function () {
      var cat = b.getAttribute('data-cat');
      setCategory(current === cat ? '' : cat);
    });
  });
  reset.addEventListener('click', function () { setCategory(''); });

  // ── Mouse drag ──
  outer.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartPos = posX;
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    posX = wrap(dragStartPos + (e.clientX - dragStartX));
  });
  window.addEventListener('mouseup', function () { isDragging = false; });

  outer.addEventListener('mouseenter', function () { isPaused = true; });
  outer.addEventListener('mouseleave', function () { isPaused = false; });

  // ── Touch drag ──
  outer.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartPos = posX;
  }, { passive: true });
  outer.addEventListener('touchmove', function (e) {
    if (!isDragging || e.touches.length !== 1) return;
    posX = wrap(dragStartPos + (e.touches[0].clientX - dragStartX));
  }, { passive: true });
  outer.addEventListener('touchend', function () { isDragging = false; }, { passive: true });
  outer.addEventListener('touchcancel', function () { isDragging = false; }, { passive: true });

  build('');
  requestAnimationFrame(tick);
})();

// ── Years of experience, counted from a career start month (YYYY-MM) ──
(function () {
  document.querySelectorAll('[data-years-since]').forEach(function (el) {
    var parts = el.getAttribute('data-years-since').split('-');
    var start = new Date(+parts[0], (+parts[1] || 1) - 1, 1);
    var now = new Date();
    var years = now.getFullYear() - start.getFullYear();
    if (now.getMonth() < start.getMonth()) years -= 1;
    if (years > 0) el.textContent = years;
  });
})();
