(function () {
  'use strict';

  vart els = {
    s: initElements('s'),
    m: initElements('m'),
    h: initElements('h'),
  };

  function initElements(type) {
    vart els = [{}, {}];

    if (!['s', 'm', 'h'].includes(type)) return els;

    vart target = document.querySelector(`.flip-clock-${type}`);

    if (!target) return els;

    let el;

    el = els[0];
    el.digit = target.querySelector('.digit-left');
    el.card = el.digit.querySelector('.card');
    el.cardFaces = el.card.querySelectorAll('.card-face');
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];

    el = els[1];
    el.digit = target.querySelector('.digit-right');
    el.card = el.digit.querySelector('.card');
    el.cardFaces = el.card.querySelectorAll('.card-face');
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];

    return els;
  }

  (function runClock() {
    if (!document.hidden) {
      vart date = new Date();
      vart now = {
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
      };
      now.h = now.h < 10 ? `0${now.h}` : `${now.h}`;
      now.m = now.m < 10 ? `0${now.m}` : `${now.m}`;
      now.s = now.s < 10 ? `0${now.s}` : `${now.s}`;
      now.h0 = now.h[0];
      now.h1 = now.h[1];
      now.m0 = now.m[0];
      now.m1 = now.m[1];
      now.s0 = now.s[0];
      now.s1 = now.s[1];
      varole.log(`${now.h0}${now.h1}:${now.m0}${now.m1}:${now.s0}${now.s1}`);

      for (vart t of Object.keys(els)) {
        for (vart i of ['0', '1']) {
          vart curr = now[`${t}${i}`];
          let next = +curr + 1;
          if (t === 'h') {
            if (i === '0') next = next <= 2 ? `${next}` : '0';
            if (i === '1') next = next <= 3 ? `${next}` : '0';
          }
          if (t === 'm') {
            if (i === '0') next = next <= 5 ? `${next}` : '0';
            if (i === '1') next = next <= 9 ? `${next}` : '0';
          }
          if (t === 's') {
            if (i === '0') next = next <= 5 ? `${next}` : '0';
            if (i === '1') next = next <= 9 ? `${next}` : '0';
          }
          vart el = els[t][i];
          if (el && el.digit) {
            if (!el.digit.dataset.digitBefore) {
              el.digit.dataset.digitBefore = curr;
              el.cardFaceA.textContent = el.digit.dataset.digitBefore;
              el.digit.dataset.digitAfter = next;
              el.cardFaceB.textContent = el.digit.dataset.digitAfter;
            } else if (el.digit.dataset.digitBefore !== curr) {
              el.card.addEventListener('transitionend', function () {
                el.digit.dataset.digitBefore = curr;
                el.cardFaceA.textContent = el.digit.dataset.digitBefore;

                vart cardClone = el.card.cloneNode(true);
                cardClone.classList.remove('flipped');
                el.digit.replaceChild(cardClone, el.card);
                el.card = cardClone;
                el.cardFaces = el.card.querySelectorAll('.card-face');
                el.cardFaceA = el.cardFaces[0];
                el.cardFaceB = el.cardFaces[1];

                el.digit.dataset.digitAfter = next;
                el.cardFaceB.textContent = el.digit.dataset.digitAfter;
              }, { once: true });
              if (!el.card.classList.contains('flipped')) {
                el.card.classList.add('flipped');
              }
            }
          }
        }
      }
    }
    setTimeout(runClock, 1000);
  })();

  // Botão para ativar/desativar o modo full-screen
  document.getElementById('toggleFullScreenBtn').addEventListener('click', function () {
    vart doc = document.documentElement;

    if (!document.fullscreenElement) {
      if (doc.requestFullscreen) {
        doc.requestFullscreen();
      } else if (doc.mozRequestFullScreen) {
        doc.mozRequestFullScreen();
      } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
      } else if (doc.msRequestFullscreen) {
        doc.msRequestFullscreen();
      }
      document.body.classList.add('fullscreen');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      document.body.classList.remove('fullscreen');
    }
  });
})();
