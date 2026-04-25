import { fetchRating, submitRating } from './api.js';

export async function renderRatingWidget(seriesId, container, options = {}) {
  const compact = !!options.compact;
  const originalRating = options.originalRating != null ? parseFloat(options.originalRating) : null;

  let data = null;
  try { data = await fetchRating(seriesId); } catch (_) {}

  const avg   = data?.average ? parseFloat(data.average).toFixed(1) : 'N/A';
  const count = data?.count ?? 0;

  const origHtml = originalRating != null
    ? `<div class="rating-original"><span class="rating-original__label">Series rating</span><span class="rating-original__value">${originalRating.toFixed(1)}<span class="rating-original__max">/10</span></span></div>`
    : '';

  container.innerHTML = `
    <div class="rating-widget${compact ? ' rating-widget--compact' : ''}">
      ${origHtml}
      <div class="rating-summary">
        <span class="rating-avg">${avg}</span>
        <span class="rating-count">${count} vote${count !== 1 ? 's' : ''}</span>
        <span class="rating-avg-label">avg</span>
      </div>
      <div class="stars-input" data-series="${seriesId}">
        ${Array.from({ length: 10 }, (_, i) =>
          `<span class="star-input" data-value="${i + 1}" title="${i + 1}/10">★</span>`
        ).join('')}
      </div>
      ${compact ? '' : '<p class="rating-hint">Click to rate</p>'}
    </div>`;

  const stars = container.querySelectorAll('.star-input');

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => highlight(stars, star.dataset.value));
    star.addEventListener('mouseleave', () => highlight(stars, 0));
    star.addEventListener('click', async () => {
      try {
        await submitRating(seriesId, parseInt(star.dataset.value));
        renderRatingWidget(seriesId, container, options);
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

function highlight(stars, upTo) {
  stars.forEach(s =>
    s.classList.toggle('star-input--hover', parseInt(s.dataset.value) <= parseInt(upTo))
  );
}
