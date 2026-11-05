/* "Which service fits you?" quiz for the homepage.
   Add one line before </body> in the root index.html: <script src="quiz.js" defer></script>
   It builds its own section right after #services (or put <div id="service-quiz"></div> anywhere to place it yourself).
   Everything runs in the visitor's browser. Nothing is stored or sent.
   Links are written for the homepage, so use it on the homepage only. */
(function () {
  var FIVERR = 'https://www.fiverr.com/sami5d200';
  var EMAIL = 'samid6061@gmail.com';

  // Result copy uses only things already stated on the site.
  var SERVICES = {
    writing: {
      name: 'Written content and SEO',
      text: 'SEO blog writing and copywriting. I have written 50+ blog articles on topics like cryptocurrency, finance, and personal well-being, for clients across Asia, Europe, and the Americas.',
      see: { label: 'Read my blog', href: 'blog/' },
      short: 'SEO blog writing and copywriting'
    },
    youtube: {
      name: 'YouTube growth',
      text: 'Channel setup and branding, YouTube SEO and keyword research, channel audits, a monetization roadmap, and title and thumbnail optimization. I run my own channel, The Pavilion Report, which has passed 1.6M views.',
      see: { label: 'See my channel story', href: '#creative-work' },
      short: 'channel setup, YouTube SEO, audits, and growth'
    },
    video: {
      name: 'AI-assisted video',
      text: 'AI-generated 3D animated greeting videos (a 5-star rated service on Fiverr) and video ads made with AI-generated images and prompt engineering.',
      see: { label: 'See the work', href: '#work' },
      short: 'AI-generated greeting videos and video ads'
    },
    strategy: {
      name: 'Strategy and scripts',
      text: 'Content strategy and YouTube scripts. I designed a 3-month digital marketing funnel for a solar energy brand (a final-year project) and write scripts for an explainer channel.',
      see: { label: 'See the work', href: '#work' },
      short: 'content strategy and scripts'
    }
  };

  var QUESTIONS = [
    { id: 'goal', text: 'What do you most want to happen?', options: [
      { label: 'People finding me on Google', svc: 'writing' },
      { label: 'More views on YouTube', svc: 'youtube' },
      { label: 'A video that explains or promotes something', svc: 'video' },
      { label: 'A clear plan for what to publish and where', svc: 'strategy' }
    ] },
    { id: 'have', text: 'What do you have right now?', options: [
      { label: 'A website or blog that needs content', svc: 'writing' },
      { label: 'A YouTube channel that is new or stuck', svc: 'youtube' },
      { label: 'An idea or product, but no visuals or footage', svc: 'video' },
      { label: 'A brand, but no plan yet', svc: 'strategy' }
    ] },
    { id: 'when', text: 'How soon do you want to start?', options: [
      { label: 'Just exploring', val: 'explore' },
      { label: 'Within a few weeks', val: 'weeks' },
      { label: 'As soon as I can', val: 'soon' }
    ] }
  ];

  var host = document.getElementById('service-quiz');
  if (!host) {
    var anchor = document.getElementById('services') || document.getElementById('contact');
    if (!anchor || !anchor.parentNode) { return; }
    var sec = document.createElement('section');
    sec.id = 'quiz';
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    host = document.createElement('div');
    host.id = 'service-quiz';
    wrap.appendChild(host);
    sec.appendChild(wrap);
    if (anchor.id === 'services') { anchor.parentNode.insertBefore(sec, anchor.nextSibling); }
    else { anchor.parentNode.insertBefore(sec, anchor); }
  }

  var css = [
    '.sq{background:var(--paper-raised);border:1px solid var(--rule);border-radius:var(--radius);padding:24px;}',
    '.sq fieldset{border:0;margin:0 0 22px;padding:0;min-width:0;}',
    '.sq legend{font-family:var(--serif);font-size:1.05rem;margin:0 0 12px;padding:0;}',
    '.sq-num{color:var(--mark);margin-right:8px;}',
    '.sq-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
    '@media (max-width:560px){.sq-opts{grid-template-columns:1fr;}}',
    '.sq-opt{display:block;position:relative;}',
    '.sq-opt input{position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;margin:0;cursor:pointer;}',
    '.sq-opt span{display:block;padding:12px 14px;border:1px solid var(--rule);border-radius:var(--radius);font-size:.93rem;color:var(--ink);background:var(--paper);transition:border-color .15s,background .15s;}',
    '.sq-opt:hover span{border-color:var(--ink-soft);}',
    '.sq-opt input:checked + span{border-color:var(--mark);background:color-mix(in srgb,var(--mark) 12%,var(--paper));}',
    '.sq-opt input:focus-visible + span{outline:2px solid var(--mark);outline-offset:2px;}',
    '.sq-result{margin-top:6px;padding-top:20px;border-top:1px solid var(--rule);}',
    '.sq-kicker{font-size:.78rem;color:var(--mark);font-weight:600;margin-bottom:6px;}',
    '.sq-result h3{font-family:var(--serif);font-weight:500;font-size:1.35rem;margin:0 0 8px;}',
    '.sq-result p{color:var(--ink-soft);font-size:.95rem;margin:0 0 12px;}',
    '.sq-result p.sq-also{font-size:.9rem;}',
    '.sq-actions{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0 8px;}',
    '.sq-btn{display:inline-block;padding:11px 18px;border-radius:var(--radius);border:1px solid var(--rule);color:var(--ink);text-decoration:none;font-weight:600;font-size:.93rem;}',
    '.sq-btn:hover{border-color:var(--ink-soft);}',
    '.sq-btn.primary{background:var(--mark);border-color:var(--mark);color:var(--mark-ink);}',
    '.sq-result p.sq-note{font-size:.8rem;margin:6px 0 0;}',
    '.sq-reset{background:none;border:none;color:var(--ink-soft);text-decoration:underline;cursor:pointer;font:inherit;font-size:.85rem;padding:0;margin-top:12px;}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var html = '<h2 class="section-title">Not sure which service fits?</h2>' +
    '<p class="section-sub">Three quick questions. Nothing is stored or sent.</p>' +
    '<div class="sq"><form id="sq-form" onsubmit="return false">';
  QUESTIONS.forEach(function (q, qi) {
    html += '<fieldset><legend><span class="sq-num">' + (qi + 1) + '</span>' + q.text + '</legend><div class="sq-opts">';
    q.options.forEach(function (o, oi) {
      html += '<label class="sq-opt"><input type="radio" name="' + q.id + '" value="' + oi + '"><span>' + o.label + '</span></label>';
    });
    html += '</div></fieldset>';
  });
  html += '</form><div class="sq-result" id="sq-result" aria-live="polite" hidden></div></div>';
  host.innerHTML = html;

  var form = document.getElementById('sq-form');
  var result = document.getElementById('sq-result');
  var shown = false;

  function answer(qIndex) {
    var q = QUESTIONS[qIndex];
    var picked = form.querySelector('input[name="' + q.id + '"]:checked');
    return picked ? q.options[parseInt(picked.value, 10)] : null;
  }

  function mailto(svc, goal, have, when) {
    var body = 'Hi Sami,\r\n\r\nI took the quiz on your site.\r\n' +
      'Best fit: ' + svc.name + '\r\n' +
      'What I want: ' + goal.label + '\r\n' +
      'What I have: ' + have.label + '\r\n' +
      'Timing: ' + when.label + '\r\n\r\n' +
      'Here is what I would like help with:\r\n';
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project enquiry: ' + svc.name) + '&body=' + encodeURIComponent(body);
  }

  function btn(label, href, primary, external) {
    return '<a class="sq-btn' + (primary ? ' primary' : '') + '" href="' + href + '"' +
      (external ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
  }

  function render() {
    var goal = answer(0), have = answer(1), when = answer(2);
    if (!goal || !have || !when) { return; }

    // The first answer decides the best fit. The second adds a related option if it points somewhere else.
    var best = SERVICES[goal.svc];
    var other = have.svc !== goal.svc ? SERVICES[have.svc] : null;
    var mail = mailto(best, goal, have, when);

    var actions;
    if (when.val === 'explore') {
      actions = btn(best.see.label, best.see.href, true, false) + btn('Ask me a question', mail, false, false);
    } else if (when.val === 'weeks') {
      actions = btn('Message me about this', mail, true, false) + btn(best.see.label, best.see.href, false, false);
    } else {
      actions = btn('Contact me on Fiverr', FIVERR, true, true) + btn('Email me', mail, false, false);
    }

    result.innerHTML =
      '<div class="sq-kicker">Your best fit</div>' +
      '<h3>' + best.name + '</h3>' +
      '<p>' + best.text + '</p>' +
      (other ? '<p class="sq-also">You may also be interested in <strong>' + other.name + '</strong> (' + other.short + ').</p>' : '') +
      '<div class="sq-actions">' + actions + '</div>' +
      '<p class="sq-note">This is a starting point, not a quote.</p>' +
      '<button type="button" class="sq-reset" id="sq-reset">Start over</button>';
    result.hidden = false;

    document.getElementById('sq-reset').addEventListener('click', function () {
      form.reset();
      result.hidden = true;
      result.innerHTML = '';
      shown = false;
    });

    if (!shown) {
      shown = true;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (result.scrollIntoView) { result.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }
    }
  }

  form.addEventListener('change', render);
})();
