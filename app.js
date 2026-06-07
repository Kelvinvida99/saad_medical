/* ── STATE ── */
let currentCategory = 'todos';
let searchQuery = '';

/* ── HELPERS ── */
function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function getFiltered() {
  return PRODUCTS.filter(p => {
    const matchCat = currentCategory === 'todos' || p.category === currentCategory;
    const matchSearch = !searchQuery || normalize(p.name).includes(normalize(searchQuery));
    return matchCat && matchSearch;
  });
}


/* ── RENDER CATEGORIES ── */
function renderCategories() {
  const el = document.getElementById('categories');
  el.innerHTML = CATEGORIES.map(c => `
    <button class="cat-btn ${c.id === currentCategory ? 'active' : ''}"
      onclick="setCategory('${c.id}')">${c.label}</button>
  `).join('');
}

function setCategory(id) {
  currentCategory = id;
  renderCategories();
  renderProducts();
}

/* ── RENDER PRODUCTS ── */
function renderProducts() {
  const filtered = getFiltered();
  const grid = document.getElementById('products-grid');
  const info = document.getElementById('results-info');

  const catLabel = CATEGORIES.find(c => c.id === currentCategory)?.label || 'Todos';
  if (searchQuery) {
    info.innerHTML = `<strong>${filtered.length}</strong> resultado${filtered.length !== 1 ? 's' : ''} para "<strong>${searchQuery}</strong>"`;
  } else {
    info.innerHTML = `Mostrando <strong>${filtered.length}</strong> producto${filtered.length !== 1 ? 's' : ''} — ${catLabel}`;
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="no-results">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
        <h3>Sin resultados</h3>
        <p>Intenta buscar con otro término o cambia la categoría.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((p, idx) => `
    <div class="product-card" style="animation-delay:${Math.min(idx, 30) * 0.03}s">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.parentElement.style.background='#f0f0f0'">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
      </div>
    </div>
  `).join('');
}

/* ── SEARCH ── */
function onSearch(e) {
  searchQuery = e.target.value.trim();
  renderProducts();
}

function onSearchSubmit(e) {
  e.preventDefault();
  renderProducts();
}

/* ── HAMBURGER ── */
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();

  document.getElementById('search-input').addEventListener('input', onSearch);
  document.getElementById('search-form').addEventListener('submit', onSearchSubmit);
});
