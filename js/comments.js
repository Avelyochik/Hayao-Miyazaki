// comments.js — управление формой комментариев и localStorage
(function () {
  const STORAGE_KEY = 'hm_comments';

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
      const body = document.createElement('div');
      body.textContent = c.text;
      item.appendChild(hdr);
      item.appendChild(body);
      container.appendChild(item);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('comment-input');
    const btn = document.getElementById('open-name-modal');
    renderComments();

    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        alert('Пожалуйста, введите текст комментария.');
        input.focus();
        return;
      }
      const name = window.prompt('Введите ваше имя (или оставьте пустым для "Гость"):', '');
      if (name === null) {
        // пользователь отменил ввод имени
        return;
      }

      const comments = loadComments();
      comments.push({ name: name.trim() || 'Гость', text, time: new Date().toISOString() });
      saveComments(comments);
      input.value = '';
      renderComments();
      const list = document.getElementById('comments-list');
      if (list) list.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
