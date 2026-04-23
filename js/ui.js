import { deleteSeries } from './api.js';
import { BASE_URL } from './api.js';

let onEditCallback = null;

export function setEditCallback(fn) {
  onEditCallback = fn;
}

export function renderSeriesGrid(series, container) {
  container.innerHTML = '';
  if (!series.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎬</span>
        <p>No series found. Add one to get started.</p>
      </div>`;
    return;
  }
  series.forEach((s, i) => {
    const card = buildCard(s);
    card.style.animationDelay = `${i * 60}ms`;
    container.appendChild(card);
  });
}

function buildCard(s) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = s.id;

  const statusClass = s.status || 'none';
  const statusLabel = s.status
    ? s.status.charAt(0).toUpperCase() + s.status.slice(1)
    : '—';

  const imgHtml = s.image_url
    ? `<img src="${BASE_URL}${s.image_url}" alt="${escHtml(s.title)}" class="card-img" loading="lazy">`
    : `<div class="card-img card-img--placeholder"><span>🎬</span></div>`;

  card.innerHTML = `
    ${imgHtml}
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">${escHtml(s.title)}</h3>
        <span class="badge badge--${statusClass}">${statusLabel}</span>
      </div>
      <p class="card-genre">${escHtml(s.genre || 'Unknown genre')}</p>
      <div class="card-rating">${buildStarDisplay(s.rating)}</div>
      <div class="card-actions">
        <button class="btn btn--edit" data-id="${s.id}">Edit</button>
        <button class="btn btn--delete" data-id="${s.id}">Delete</button>
      </div>
    </div>`;

  card.querySelector('.btn--edit').addEventListener('click', () => onEditCallback?.(s.id));
  card.querySelector('.btn--delete').addEventListener('click', () => handleDelete(s.id, card));

  return card;
}

async function handleDelete(id, card) {
  if (!confirm('Delete this series? This cannot be undone.')) return;
  try {
    await deleteSeries(id);
    card.classList.add('card--removing');
    setTimeout(() => card.remove(), 300);
    showToast('Series deleted');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

export function buildStarDisplay(rating) {
  if (!rating) return `<span class="no-rating">No rating</span>`;
  const r = parseFloat(rating);
  const filled = Math.round(r / 2); // convert /10 to /5 stars
  const stars = Array.from({ length: 5 }, (_, i) =>
    `<span class="${i < filled ? 'star star--filled' : 'star'}">★</span>`
  ).join('');
  return `<span class="stars">${stars}</span><span class="rating-num">${r.toFixed(1)}</span>`;
}

export function renderPagination(meta, container, onPageChange) {
  container.innerHTML = '';
  if (meta.pages <= 1) return;

  const addBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (active ? ' page-btn--active' : '');
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener('click', () => onPageChange(page));
    container.appendChild(btn);
  };

  addBtn('←', meta.page - 1, meta.page === 1);
  for (let i = 1; i <= meta.pages; i++) {
    addBtn(i, i, false, i === meta.page);
  }
  addBtn('→', meta.page + 1, meta.page === meta.pages);
}

export function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast--visible'));
  setTimeout(() => {
    t.classList.remove('toast--visible');
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
