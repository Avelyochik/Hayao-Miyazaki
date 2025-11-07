// main.js — объединённый скрипт: аудио + комментарии
(function () {
  // --- Audio module ---
  let audioEl = null;

  function ensureAudio() {
    if (!audioEl) audioEl = document.getElementById('audio');
    return !!audioEl;
  }

  function playAudio() {
    if (!ensureAudio()) return;
    audioEl.play();
  }

  function pauseAudio() {
    if (!ensureAudio()) return;
    audioEl.pause();
  }

  function quieter() {
    if (!ensureAudio()) return;
    if (audioEl.volume > 0.1) audioEl.volume = Math.max(0, audioEl.volume - 0.1);
  }

  function louder() {
    if (!ensureAudio()) return;
    if (audioEl.volume < 0.9) audioEl.volume = Math.min(1, audioEl.volume + 0.1);
  }

  function scrollToComments() {
    const comments = document.getElementById('comments');
    if (comments) comments.scrollIntoView({ behavior: 'smooth' });
  }

  // Экспорт в глобальную область
  window.playAudio = playAudio;
  window.pauseAudio = pauseAudio;
  window.quieter = quieter;
  window.louder = louder;
  window.scrollToComments = scrollToComments;

  document.addEventListener('DOMContentLoaded', () => {
    audioEl = document.getElementById('audio');
  });

  // --- Comments module ---
  const STORAGE_KEY = 'hm_comments';

  // clientId — чтобы отличать комментарии текущего клиента и разрешать удаление
  const CLIENT_KEY = 'hm_clientId';

  function getClientId() {
    try {
      let id = localStorage.getItem(CLIENT_KEY);
      if (!id) {
        id = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
        localStorage.setItem(CLIENT_KEY, id);
      }
      return id;
    } catch (e) {
      console.error('Не удалось получить clientId:', e);
      return null;
    }
  }

  function loadComments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Не удалось прочитать комментарии:', e);
      return [];
    }
  }

  function saveComments(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Не удалось сохранить комментарии:', e);
    }
  }

  function renderComments() {
    const container = document.getElementById('comments-list');
    const comments = loadComments();
    if (!container) return;
    container.innerHTML = '';
    if (comments.length === 0) {
      container.innerHTML = '<p>Здесь появятся ваши отзывы и обсуждения 😊</p>';
      return;
    }
    const myId = getClientId();
    comments.slice().reverse().forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.style = 'background: rgba(255,255,255,0.9); padding:10px; border-radius:8px; margin-bottom:10px; text-align:left;';
      const hdr = document.createElement('div');
      hdr.style = 'font-weight:700; margin-bottom:6px;';
      const name = document.createElement('span');
      name.textContent = c.name || 'Гость';
      const time = document.createElement('span');
      time.textContent = ' • ' + (new Date(c.time)).toLocaleString();
      time.style = 'font-weight:400; color:#666; margin-left:6px; font-size:0.9em;';
      hdr.appendChild(name);
      hdr.appendChild(time);
      // Если комментарий принадлежит текущему клиенту — добавим кнопку удаления
      if (myId && c.clientId && myId === c.clientId) {
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Удалить';
        delBtn.style = 'margin-left:10px; padding:4px 8px; border-radius:6px; background:#e74c3c; color:#fff; border:none; cursor:pointer;';
        delBtn.addEventListener('click', () => {
          if (!confirm('Удалить этот комментарий?')) return;
          const list = loadComments();
          const idx = list.findIndex(x => x.id === c.id);
          if (idx !== -1) {
            list.splice(idx, 1);
            saveComments(list);
            renderComments();
          }
        });
        hdr.appendChild(delBtn);
      }
      const body = document.createElement('div');
      body.textContent = c.text;
      item.appendChild(hdr);
      item.appendChild(body);
      container.appendChild(item);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderComments();
    const input = document.getElementById('comment-input');
    const btn = document.getElementById('open-name-modal');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        alert('Пожалуйста, введите текст комментария.');
        input.focus();
        return;
      }
      const name = window.prompt('Введите ваше имя (или оставьте пустым для "Гость"):', '');
      if (name === null) return; // отмена

      const comments = loadComments();
      const comment = {
        id: 'cm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
        clientId: getClientId(),
        name: name.trim() || 'Гость',
        text,
        time: new Date().toISOString()
      };
      comments.push(comment);
      saveComments(comments);
      input.value = '';
      renderComments();
      const list = document.getElementById('comments-list');
      if (list) list.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();
