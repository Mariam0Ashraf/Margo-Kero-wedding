/* ============================================================
   Kerollos & Margret — Wedding Invitation
   Fully static. No database, no stored guest input.
   ============================================================ */
(function () {
  'use strict';

  var EVENT_DATE = new Date('2026-09-03T19:00:00+02:00'); // Cairo time

  /* ---------- Language ---------- */
  var htmlEl = document.documentElement;
  function applyLang(lang) {
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val != null) el.textContent = val;
    });
    try { localStorage.setItem('nafrah.lang', lang); } catch (e) {}
  }
  var savedLang = 'en';
  try { savedLang = localStorage.getItem('nafrah.lang') || 'en'; } catch (e) {}
  applyLang(savedLang);

  document.getElementById('langToggle').addEventListener('click', function () {
    applyLang(htmlEl.getAttribute('lang') === 'ar' ? 'en' : 'ar');
  });

  /* ---------- Cover open ---------- */
  var cover = document.getElementById('cover');
  var invite = document.getElementById('invite');
  var openBtn = document.getElementById('openBtn');

  spawnPetals(document.getElementById('coverPetals'), 18);

  openBtn.addEventListener('click', function () {
    cover.classList.add('open');
    invite.setAttribute('aria-hidden', 'false');
    setTimeout(function () { cover.style.display = 'none'; }, 1000);
    tryPlayMusic();
    burstConfetti();
    revealSections();
    window.scrollTo(0, 0);
  });

  /* ---------- Music ---------- */
  var audio = document.getElementById('bgAudio');
  var musicBtn = document.getElementById('musicToggle');
  var musicOn = false;
  audio.volume = 0.6;

  function tryPlayMusic() {
    audio.currentTime = 35; // matches original audio start
    var p = audio.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked; user can tap */ });
    setMusicUI(!audio.paused);
    audio.onplaying = function () { setMusicUI(true); };
  }
  function setMusicUI(on) {
    musicOn = on;
    musicBtn.classList.toggle('playing', on);
    musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  musicBtn.addEventListener('click', function () {
    if (musicOn) { audio.pause(); setMusicUI(false); }
    else { if (audio.currentTime < 1) audio.currentTime = 35; audio.play(); setMusicUI(true); }
  });

  /* ---------- Countdown ---------- */
  var cd = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = EVENT_DATE - new Date();
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Section reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  function revealSections() {
    document.querySelectorAll('.section-reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Petals & confetti ---------- */
  function spawnPetals(layer, count) {
    if (!layer) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 8 + Math.random() * 12;
      p.style.width = size + 'px';
      p.style.height = size * 0.8 + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (7 + Math.random() * 7) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      layer.appendChild(p);
    }
  }
  var CONF_COLORS = ['hsl(36 52% 66%)', 'hsl(30 22% 60%)', 'hsl(38 44% 88%)', 'hsl(32 38% 46%)', 'hsl(40 44% 96%)'];
  function burstConfetti() {
    var layer = document.getElementById('confetti');
    for (var i = 0; i < 40; i++) {
      (function () {
        var c = document.createElement('span');
        c.className = 'conf';
        c.style.left = Math.random() * 100 + '%';
        c.style.background = CONF_COLORS[i % CONF_COLORS.length];
        c.style.animationDuration = (2.4 + Math.random() * 2) + 's';
        c.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        layer.appendChild(c);
        setTimeout(function () { c.remove(); }, 4600);
      })();
    }
  }
})();
