import { fetchSeries, fetchSeriesById, createSeries, updateSeries } from './api.js';
import { BASE_URL } from './api.js';
import { renderSeriesGrid, renderPagination, showToast, setEditCallback } from './ui.js';
import { renderRatingWidget } from './rating.js';
import { exportCSV, exportXLSX } from './export.js';

// ── State ─────────────────────────────────────────────────────────────────────
let currentPage  = 1;
let currentQ     = '';
let currentSort  = 'created_at';
let currentOrder = 'desc';
let allSeries    = [];
let editingId    = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const grid       = document.getElementById('grid');
const pagination = document.getElementById('pagination');
const modal      = document.getElementById('modal');
const form       = document.getElementById('series-form');
const modalTitle = document.getElementById('modal-title');
const ratingContainer = document.getElementById('rating-container');

// ── Load series ───────────────────────────────────────────────────────────────
async function loadSeries() {
  try {
    const result = await fetchSeries({
      page: currentPage, q: currentQ, sort: currentSort, order: currentOrder
    });
    allSeries = result.data;
    renderSeriesGrid(result.data, grid);
    renderPagination(result.meta, pagination, p => { currentPage = p; loadSeries(); });
  } catch (e) {
    showToast('Failed to load series', 'error');
  }
}

// ── Search ────────────────────────────────────────────────────────────────────
document.getElementById('search').addEventListener('input', e => {
  currentQ    = e.target.value;
  currentPage = 1;
  loadSeries();
});

// ── Sort ──────────────────────────────────────────────────────────────────────
document.getElementById('sort-select').addEventListener('change', e => {
  const [s, o]  = e.target.value.split('-');
  currentSort   = s;
  currentOrder  = o;
  loadSeries();
});

// ── Export ────────────────────────────────────────────────────────────────────
document.getElementById('btn-csv').addEventListener('click',  () => exportCSV(allSeries));
document.getElementById('btn-xlsx').addEventListener('click', () => exportXLSX(allSeries));

// ── Modal open/close ──────────────────────────────────────────────────────────
document.getElementById('btn-add').addEventListener('click', () => openModal());

document.getElementById('btn-close-modal').addEventListener('click', closeModal);

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  modal.classList.remove('modal--open');
  form.reset();
  document.getElementById('img-preview').src = '';
  document.getElementById('img-label').style.display = 'block';
  ratingContainer.innerHTML = '';
  editingId = null;
}

export function openEditModal(id) {
  fetchSeriesById(id).then(s => openModal(s)).catch(() => showToast('Could not load series', 'error'));
}

setEditCallback(openEditModal);

function openModal(series = null) {
  editingId             = series?.id ?? null;
  modalTitle.textContent = series ? 'Edit Series' : 'Add Series';

  form.elements['title'].value  = series?.title  || '';
  form.elements['genre'].value  = series?.genre  || '';
  form.elements['status'].value = series?.status || '';
  form.elements['rating'].value = series?.rating || '';

  const preview = document.getElementById('img-preview');
  const label   = document.getElementById('img-label');
  preview.src          = series?.image_url ? `${BASE_URL}${series.image_url}` : '';
  preview.style.display = series?.image_url ? 'block' : 'none';
  label.style.display   = series?.image_url ? 'none'  : 'block';

  ratingContainer.innerHTML = '';
  if (series) renderRatingWidget(series.id, ratingContainer);

  modal.classList.add('modal--open');
  form.elements['title'].focus();
}

// ── Image preview ─────────────────────────────────────────────────────────────
form.elements['image'].addEventListener('change', e => {
  const file    = e.target.files[0];
  const preview = document.getElementById('img-preview');
  const label   = document.getElementById('img-label');
  if (file) {
    preview.src           = URL.createObjectURL(file);
    preview.style.display = 'block';
    label.style.display   = 'none';
  }
});

// ── Form submit ───────────────────────────────────────────────────────────────
form.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(form);
  const btn = form.querySelector('[type="submit"]');
  btn.disabled    = true;
  btn.textContent = 'Saving…';

  try {
    if (editingId) {
      await updateSeries(editingId, fd);
      showToast('Series updated!');
    } else {
      await createSeries(fd);
      showToast('Series created!');
    }
    closeModal();
    loadSeries();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Save';
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadSeries();
