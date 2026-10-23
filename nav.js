/* Mobile menu for Sami Uddin's site.
   Adds a "Menu" button on small screens and shows the nav links as a dropdown.
   One script line per page: <script src="nav.js" defer></script>
   (inside /blog/ pages use: <script src="../nav.js" defer></script>) */
(function () {
  var nav = document.querySelector('header.site .nav');
  var menu = nav && nav.querySelector('ul');
  if (!nav || !menu) return;

  var css = [
    '.nav-toggle{display:none;background:none;border:1px solid var(--rule);color:var(--ink);border-radius:8px;padding:6px 12px;font:inherit;font-size:.9rem;cursor:pointer;}',
    '@media (max-width:720px){',
    '.nav-toggle{display:block;}',
    '.nav ul:not(.open){display:none;}',
    '.nav ul.open{display:flex;flex-direction:column;gap:0;position:absolute;top:100%;left:0;right:0;margin:0;padding:6px 24px 14px;background:var(--paper);border-bottom:1px solid var(--rule);}',
    '.nav ul.open li{border-top:1px solid var(--rule);}',
    '.nav ul.open li:first-child{border-top:none;}',
    '.nav ul.open a{display:block;padding:14px 0;font-size:1rem;color:var(--ink);}',
    '}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  if (!menu.id) { menu.id = 'navMenu'; }
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', menu.id);
  btn.textContent = 'Menu';
  nav.insertBefore(btn, menu);

  function setOpen(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  }

  btn.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target && e.target.tagName === 'A') { setOpen(false); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setOpen(false); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) { setOpen(false); }
  });
})();
