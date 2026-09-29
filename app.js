/* MANOJ #1 — thwips, flashes, page numbers. vanilla, file:// safe. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WORDS = ['THWIP!', 'POW!', 'ZAP!', 'BOOM!', 'WHAM!', 'SPLAT!', 'KRAKOOM!'];

  /* toast */
  var toast = document.getElementById('toast'), toastT = null;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.add('hidden'); }, 2400);
  }

  /* THWIP! burst wherever you click (not on inputs/buttons) */
  var wi = 0;
  document.addEventListener('pointerdown', function (e) {
    var t = e.target;
    if (t.closest('input, textarea, select')) return;
    if (reduceMotion) return;
    var s = document.createElement('span');
    s.className = 'thwip';
    s.textContent = WORDS[wi++ % WORDS.length];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.style.color = ['#FFD500', '#fff', '#7CFC98'][wi % 3];
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 750);
  });

  /* scroll reveal */
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* power-grid dots */
  document.querySelectorAll('.dots').forEach(function (d) {
    var v = Math.max(0, Math.min(7, parseInt(d.getAttribute('data-v'), 10) || 0));
    for (var i = 0; i < 7; i++) {
      var dot = document.createElement('i');
      if (i < v) dot.className = 'on';
      d.appendChild(dot);
    }
  });

  /* spider-signal flash */
  var flash = document.getElementById('flash'), flashT = null;
  function signal() {
    flash.classList.add('go');
    clearTimeout(flashT);
    flashT = setTimeout(function () { flash.classList.remove('go'); }, reduceMotion ? 0 : 120);
    say('🚨 SIGNAL RECEIVED! He replies within 24h!');
  }
  document.getElementById('signalBig').addEventListener('click', signal);
  document.getElementById('signalTop').addEventListener('click', function () {
    document.getElementById('signal').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(signal, 600);
  });

  /* copy email (manojmuniraju31@gmail.com via data-email / button wiring below) */
  function copyEmail(addr) {
    function done() { say('COPIED: ' + addr + ' ✓'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done, function () { fb(); });
    } else { fb(); }
    function fb() {
      var ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { say(addr); }
      document.body.removeChild(ta);
    }
  }
  document.getElementById('copyEmail').addEventListener('click', function () {
    copyEmail(this.getAttribute('data-email') || 'manojmuniraju31@gmail.com');
  });

  /* tip form → opens the visitor's mail app, pre-addressed to you (no middleman to break) */
  document.getElementById('tipForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var name = form.querySelector('[name=name]').value.trim();
    var email = form.querySelector('[name=email]').value.trim();
    var msg = form.querySelector('[name=message]').value.trim();
    var subject = encodeURIComponent('MANOJ #1 portfolio — tip from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    say('OPENING YOUR MAIL APP… HIT SEND! 📧');
    setTimeout(function () {
      window.location.href = 'mailto:manojmuniraj31@gmail.com?subject=' + subject + '&body=' + body;
    }, 600);
  });

  /* page number by scroll (4 chapters) */
  var pageNo = document.getElementById('pageNo');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  function page() {
    var idx = 0;
    chapters.forEach(function (c, i) {
      if (c.getBoundingClientRect().top < innerHeight * 0.4) idx = i;
    });
    pageNo.textContent = 'PAGE ' + (idx + 1) + '/' + chapters.length;
  }
  addEventListener('scroll', page, { passive: true }); page();

  /* web back up */
  document.getElementById('topBtn').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  setTimeout(function () { say('WELCOME, TRUE BELIEVER! CLICK ANYTHING! 💥'); }, 1500);
})();
