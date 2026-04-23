const BASE_URL = 'http://localhost:3000';

// ── Series ────────────────────────────────────────────────────────────────────

export async function fetchSeries({ page = 1, limit = 10, q = '', sort = 'created_at', order = 'desc' } = {}) {
  const params = new URLSearchParams({ page, limit, q, sort, order });
  const res = await fetch(`${BASE_URL}/series?${params}`);
  if (!res.ok) throw new Error('Failed to fetch series');
  return res.json();
}

export async function fetchSeriesById(id) {
  const res = await fetch(`${BASE_URL}/series/${id}`);
  if (!res.ok) throw new Error('Series not found');
  return res.json();
}

export async function createSeries(formData) {
  const res = await fetch(`${BASE_URL}/series`, { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create series');
  }
  return res.json();
}

export async function updateSeries(id, formData) {
  const res = await fetch(`${BASE_URL}/series/${id}`, { method: 'PUT', body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update series');
  }
  return res.json();
}

export async function deleteSeries(id) {
  const res = await fetch(`${BASE_URL}/series/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete series');
}

// ── Ratings ───────────────────────────────────────────────────────────────────

export async function fetchRating(seriesId) {
  const res = await fetch(`${BASE_URL}/series/${seriesId}/rating`);
  if (!res.ok) return null;
  return res.json();
}

export async function submitRating(seriesId, score) {
  const res = await fetch(`${BASE_URL}/series/${seriesId}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit rating');
  }
  return res.json();
}

export { BASE_URL };
