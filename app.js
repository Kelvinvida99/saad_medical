/* ── STATE ── */
let currentCategory = 'todos';
let searchQuery = '';
let currentSlide = 0;
let slideTimer = null;

const heroSlides = [
  {
    img: 'assects/Fotos Especiales/Portada.png',
    title: 'Calidad y confianza en cada producto',
    desc: 'Laboratorio Saad Medical — medicamentos y suplementos de alta calidad para tu salud.',
    btn: 'Ver catálogo',
    href: '#productos',
  },
  {
    img: 'assects/Fotos Especiales/Portada 2.png',
    title: 'Nuestra línea Life Made',
    desc: 'Colágeno, Omega-3, Vitaminas y más. Suplementos que marcan la diferencia.',
    btn: 'Ver suplementos',
    href: '#productos',
  },
  {
    img: 'assects/Fotos Especiales/presentacion 3.jpg',
    title: 'Dolocom — Elimina el dolor fuerte',
    desc: 'Analgésico · Antiinflamatorio · Antineurálgico · Antireumático. Diclofenac Sódico + Complejo B1-B6-B12.',
    btn: 'Ver Dolocom',
    href: '#productos',
  },
  {
    img: 'assects/Fotos Especiales/Vitamina C y Aceite de Linaza.png',
    title: 'Múltiples suplementos para tu salud',
    desc: 'Vitamina C, Aceite de Linaza, Omega-3 y más. Todo lo que tu cuerpo necesita en un solo lugar.',
    btn: 'Ver vitaminas',
    href: '#productos',
  },
  {
    img: 'assects/Fotos Especiales/Vitamina C.png',
    title: 'Vitamina C 500 mg',
    desc: 'Fortalece tu sistema inmune con nuestra línea de vitaminas Life Made.',
    btn: 'Ver vitaminas',
    href: '#productos',
  },
];

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

/* ── RENDER HERO ── */
function renderHero() {
  const track = document.getElementById('hero-track');
  const dotsEl = document.getElementById('hero-dots');
  track.innerHTML = heroSlides.map((s, i) => `
    <div class="hero-slide">
      <img src="${s.img}" alt="${s.title}" loading="${i === 0 ? 'eager' : 'lazy'}">
      <div class="hero-content">
        <h1>${s.title}</h1>
        <p>${s.desc}</p>
        <a href="${s.href}" class="hero-btn">${s.btn}</a>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = heroSlides.map((_, i) =>
    `<button class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})" aria-label="Slide ${i+1}"></button>`
  ).join('');
}

function goToSlide(n) {
  currentSlide = (n + heroSlides.length) % heroSlides.length;
  const track = document.getElementById('hero-track');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
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
  renderHero();
  renderCategories();
  renderProducts();

  /* hero track style */
  document.getElementById('hero-track').style.cssText =
    'display:flex;width:100%;height:100%;transition:transform .5s ease;';

  startAutoSlide();

  document.getElementById('search-input').addEventListener('input', onSearch);
  document.getElementById('search-form').addEventListener('submit', onSearchSubmit);

  /* pause auto-slide on hover */
  document.querySelector('.hero').addEventListener('mouseenter', () => clearInterval(slideTimer));
  document.querySelector('.hero').addEventListener('mouseleave', startAutoSlide);
});
