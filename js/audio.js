яяя// audio.js — управление аудиоплеером на странице
// Обёрну получение элемента audio в DOMContentLoaded, чтобы гарантированно получить элемент
(function () {
  let audioEl = null;

  function ensure() {
    if (!audioEl) audioEl = document.getElementById('audio');
    return !!audioEl;
  }

  function playAudio() {
    if (!ensure()) return;
    audioEl.play();
  }

  function pauseAudio() {
    if (!ensure()) return;
    audioEl.pause();
  }

  function quieter() {
    if (!ensure()) return;
    if (audioEl.volume > 0.1) audioEl.volume = Math.max(0, audioEl.volume - 0.1);
  }

  function louder() {
    if (!ensure()) return;
    if (audioEl.volume < 0.9) audioEl.volume = Math.min(1, audioEl.volume + 0.1);
  }

  function scrollToComments() {
    const comments = document.getElementById('comments');
    if (comments) comments.scrollIntoView({ behavior: 'smooth' });
  }

  // Экспорт функций в глобальную область, чтобы кнопки в разметке могли их вызвать
  window.playAudio = playAudio;
  window.pauseAudio = pauseAudio;
  window.quieter = quieter;
  window.louder = louder;
  window.scrollToComments = scrollToComments;

  // Попытка предварительно получить элемент, если скрипт подключён внизу страницы — на всякий случай
  document.addEventListener('DOMContentLoaded', () => {
    audioEl = document.getElementById('audio');
  });
})();
