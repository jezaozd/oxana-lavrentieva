(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ключевые показатели: разряды прокручиваются, как в счётчике ---------- */
  var nums = $$('.num');
  nums.forEach(function (el) {
    var target = el.dataset.n;
    el.setAttribute('aria-label', target);
    var roll = document.createElement('span');
    roll.className = 'roll';
    roll.setAttribute('aria-hidden', 'true');
    target.split('').forEach(function (d, k) {
      var col = document.createElement('i');
      var strip = document.createElement('b');
      // две полных ленты 0–9, чтобы разряд успел сделать оборот
      for (var r = 0; r < 2; r++) for (var x = 0; x <= 9; x++) {
        var s = document.createElement('span'); s.textContent = x; strip.appendChild(s);
      }
      strip.dataset.to = 10 + Number(d);
      strip.style.transitionDelay = (k * 0.12) + 's';
      col.appendChild(strip);
      roll.appendChild(col);
    });
    el.textContent = '';
    el.appendChild(roll);
  });
  function spin() {
    $$('.roll b').forEach(function (b) { b.style.transform = 'translateY(-' + b.dataset.to + 'em)'; });
  }
  if (calm) {
    $$('.roll b').forEach(function (b) { b.style.transition = 'none'; });
    spin();
  } else {
    // запуск после первой отрисовки, чтобы переход был виден
    setTimeout(spin, 350);
  }

  /* ---------- зеркало ---------- */
  var words = $$('#words input'), btn = $('#reflect'), wc = $('#wcount'), ans = $('#answer'), you = $('#youwords');
  function picked() { return words.filter(function (w) { return w.checked; }).map(function (w) { return w.value; }); }
  words.forEach(function (w) {
    w.addEventListener('change', function () {
      var n = picked().length;
      btn.disabled = n < 3;
      wc.textContent = n < 3 ? 'Отмечено: ' + n + ' из 3' : 'Отмечено: ' + n + '. Можно смотреть ответ';
    });
  });
  if (btn) btn.addEventListener('click', function () {
    var p = picked();
    if (p.length < 3) return;
    var last = p.pop();
    you.textContent = (p.length ? p.join(', ') + ' и ' : '') + last;
    ans.hidden = false;
    ans.focus({ preventScroll: true });
    ans.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  });

  /* ---------- заявка в WhatsApp ---------- */
  var form = $('#form'), ferr = $('#ferr');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name;
    if (name.value.trim().length < 2) {
      name.setAttribute('aria-invalid', 'true');
      ferr.textContent = 'Напишите, как к вам обращаться, — команда Оксаны ответит лично.';
      name.focus();
      return;
    }
    name.setAttribute('aria-invalid', 'false');
    ferr.textContent = '';
    var topic = (form.querySelector('input[name="topic"]:checked') || {}).value || '';
    var note = form.elements.note.value.trim();
    var text = 'Здравствуйте! Хочу записаться на коуч-сессию к Оксане Лаврентьевой.\n' +
      'Меня зовут ' + name.value.trim() + '.\nТема: ' + topic + '.' + (note ? '\nКоротко: ' + note : '');
    window.open('https://wa.me/79267171141?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
  if (form) form.elements.name.addEventListener('input', function () {
    if (this.value.trim().length > 1) { this.setAttribute('aria-invalid', 'false'); ferr.textContent = ''; }
  });
})();
