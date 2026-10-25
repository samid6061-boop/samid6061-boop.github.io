/* "Am I available in your time?" widget for the Contact section.
   Add one line before </body> on the homepage: <script src="clock.js" defer></script>
   Everything runs in the visitor's browser. Nothing is sent anywhere or stored. */
(function () {
  // ---- Edit these four lines to change your hours ----
  var MY_TZ = 'Asia/Karachi';
  var MY_TZ_LABEL = 'PKT';
  var START_HOUR = 8;   // 08:00
  var END_HOUR = 22;    // 22:00
  // ----------------------------------------------------

  var host = document.getElementById('avail-clock');
  if (!host) {
    var contact = document.getElementById('contact');
    if (!contact) { return; }
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    host = document.createElement('div');
    host.id = 'avail-clock';
    wrap.appendChild(host);
    contact.appendChild(wrap);
  }

  var fmtClock, fmtMyClock, fmtHM, fmtParts, visitorTz;
  try {
    visitorTz = (Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone').replace(/_/g, ' ');
    fmtClock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    fmtMyClock = new Intl.DateTimeFormat('en-GB', { timeZone: MY_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    fmtHM = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    fmtParts = new Intl.DateTimeFormat('en-GB', { timeZone: MY_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  } catch (e) { return; }

  var css = [
    '.ac{background:var(--paper-raised);border:1px solid var(--rule);border-radius:var(--radius);padding:24px;margin-top:40px;}',
    '.ac-title{font-family:var(--serif);font-weight:500;font-size:1.2rem;margin:0 0 18px;}',
    '.ac-clocks{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}',
    '@media (max-width:560px){.ac-clocks{grid-template-columns:1fr;}}',
    '.ac-clock{border:1px solid var(--rule);border-radius:var(--radius);padding:14px 16px;}',
    '.ac-label{font-size:.8rem;color:var(--ink-soft);margin-bottom:4px;}',
    '.ac-digits{font-family:var(--sans);font-variant-numeric:tabular-nums;font-weight:600;font-size:clamp(1.6rem,5vw,2.2rem);letter-spacing:.02em;}',
    '.ac-verdict{display:flex;gap:10px;align-items:flex-start;}',
    '.ac-dot{width:10px;height:10px;border-radius:50%;background:var(--ink-soft);flex:none;margin-top:7px;}',
    '.ac.ac-open .ac-dot{background:var(--green);}',
    '.ac-head{font-weight:600;font-size:1rem;}',
    '.ac-sub,.ac-hours{color:var(--ink-soft);font-size:.9rem;margin:6px 0 0;}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  host.innerHTML =
    '<div class="ac" role="group" aria-label="Availability">' +
      '<h3 class="ac-title">Am I available in your time? Let\u2019s find out.</h3>' +
      '<div class="ac-clocks">' +
        '<div class="ac-clock"><div class="ac-label" id="ac-you-label">Your time</div><div class="ac-digits" id="ac-you">--:--:--</div></div>' +
        '<div class="ac-clock"><div class="ac-label">My time (Karachi, ' + MY_TZ_LABEL + ')</div><div class="ac-digits" id="ac-me">--:--:--</div></div>' +
      '</div>' +
      '<div class="ac-verdict"><span class="ac-dot" aria-hidden="true"></span>' +
        '<div><div class="ac-head" id="ac-head"></div><p class="ac-sub" id="ac-sub"></p></div>' +
      '</div>' +
      '<p class="ac-hours" id="ac-hours"></p>' +
    '</div>';

  var box = host.querySelector('.ac');
  var youLabel = document.getElementById('ac-you-label');
  var you = document.getElementById('ac-you');
  var me = document.getElementById('ac-me');
  var head = document.getElementById('ac-head');
  var sub = document.getElementById('ac-sub');
  var hours = document.getElementById('ac-hours');
  youLabel.textContent = 'Your time (' + visitorTz + ')';

  function setText(el, text) { if (el.textContent !== text) { el.textContent = text; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dur(ms) {
    var m = Math.max(0, Math.round(ms / 60000));
    var h = Math.floor(m / 60);
    m = m % 60;
    return h > 0 ? h + 'h ' + m + 'm' : m + 'm';
  }

  // Works out my current date and UTC offset from the time zone database, so DST rules are never hard-coded.
  function myClockInfo(now) {
    var p = {};
    fmtParts.formatToParts(now).forEach(function (x) {
      if (x.type !== 'literal') { p[x.type] = parseInt(x.value, 10); }
    });
    var asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return { y: p.year, m: p.month, d: p.day, offset: asUtc - Math.floor(now.getTime() / 1000) * 1000 };
  }

  function status(now) {
    var k = myClockInfo(now);
    var t = now.getTime();
    var start = Date.UTC(k.y, k.m - 1, k.d, START_HOUR, 0, 0) - k.offset;
    var end = Date.UTC(k.y, k.m - 1, k.d, END_HOUR, 0, 0) - k.offset;
    var open = t >= start && t < end;
    var nextStart = start;
    if (t >= end) { nextStart = Date.UTC(k.y, k.m - 1, k.d + 1, START_HOUR, 0, 0) - k.offset; }
    return { open: open, start: start, end: end, nextStart: nextStart };
  }

  var announced = false;
  function tick() {
    var now = new Date();
    setText(you, fmtClock.format(now));
    setText(me, fmtMyClock.format(now));

    var s = status(now);
    var winText = pad(START_HOUR) + ':00 to ' + pad(END_HOUR) + ':00 ' + MY_TZ_LABEL;
    setText(hours, 'My hours: ' + winText + ', which is ' + fmtHM.format(new Date(s.start)) + ' to ' + fmtHM.format(new Date(s.end)) + ' in your time.');

    if (s.open) {
      setText(head, 'Yes, I\u2019m available right now.');
      setText(sub, 'I\u2019m around until ' + pad(END_HOUR) + ':00 ' + MY_TZ_LABEL + ' (' + fmtHM.format(new Date(s.end)) + ' your time), another ' + dur(s.end - now.getTime()) + '.');
    } else {
      setText(head, 'Not right now.');
      setText(sub, 'I\u2019m back at ' + pad(START_HOUR) + ':00 ' + MY_TZ_LABEL + ' (' + fmtHM.format(new Date(s.nextStart)) + ' your time), in ' + dur(s.nextStart - now.getTime()) + '.');
    }
    box.classList.toggle('ac-open', s.open);

    // Only the headline is announced by screen readers, and only when it changes, never every second.
    if (!announced) { head.setAttribute('aria-live', 'polite'); announced = true; }
  }

  tick();
  setInterval(tick, 1000);
})();
