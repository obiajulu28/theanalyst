(function () {
  var root = document.documentElement;

  // Light / dark theme toggle (remembers the choice in this browser)
  var themeBtn = document.getElementById('theme');
  function paintTheme() {
    var light = root.dataset.theme === 'light';
    themeBtn.textContent = light ? 'Dark mode' : 'Light mode';
    themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  }
  themeBtn.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  // Typed headline (static text is shown if the visitor prefers reduced motion)
  var typed = document.getElementById('typed');
  if (typed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = ['smarter working solutions.', 'clear requirements.', 'better care workflows.', 'data-led decisions.'];
    var w = 0, i = words[0].length, deleting = true;
    var tick = function () {
      if (deleting) {
        i--; typed.textContent = words[w].slice(0, i);
        if (i === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 300); }
        return setTimeout(tick, 35);
      }
      i++; typed.textContent = words[w].slice(0, i);
      if (i === words[w].length) { deleting = true; return setTimeout(tick, 2000); }
      setTimeout(tick, 70);
    };
    setTimeout(tick, 2200);
  }

  // Mobile menu
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Contact form: sends to Formspree and shows a success or error message
  var form = document.getElementById('form');
  var note = document.getElementById('status');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.className = '';
      note.textContent = 'Sending...';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Request failed');
          form.reset();
          note.className = 'ok';
          note.textContent = 'Thank you. Your message has been sent.';
        })
        .catch(function () {
          note.className = 'err';
          note.textContent = 'Your message was not sent. Please try again or email Obiajuluibe@gmail.com.';
        });
    });
  }
})();
