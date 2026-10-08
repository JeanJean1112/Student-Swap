// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Sticky header shadow on scroll ----------
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 8 ? '0 4px 16px rgba(0,0,0,0.12)' : 'none';
});

// ---------- Listings ----------
const categoryLabel = {
  clothing: 'Clothes',
  kitchen: 'Kitchenware',
  sport: 'Sport equipment',
  travel: 'Travel equipment',
};

const items = [
  { name: 'Denim jacket', category: 'clothing', price: 8000 },
  { name: 'Winter coat', category: 'clothing', price: 12000 },
  { name: 'Wool sweater', category: 'clothing', price: 4000 },
  { name: 'Rain jacket', category: 'clothing', price: 5000 },
  { name: 'Hoodie', category: 'clothing', price: 6000 },
  { name: 'Pot & pan set', category: 'kitchen', price: 10000 },
  { name: 'Rice cooker', category: 'kitchen', price: 12000 },
  { name: 'Electric kettle', category: 'kitchen', price: 5000 },
  { name: 'Dish set', category: 'kitchen', price: 3500 },
  { name: 'Blender', category: 'kitchen', price: 6000 },
  { name: 'Yoga mat', category: 'sport', price: 5000 },
  { name: 'Football', category: 'sport', price: 4000 },
  { name: 'Dumbbell set', category: 'sport', price: 9000 },
  { name: 'Tennis racket', category: 'sport', price: 7000 },
  { name: 'Mountain bike', category: 'sport', price: 35000 },
  { name: 'Carry-on suitcase', category: 'travel', price: 15000 },
  { name: 'Hiking backpack', category: 'travel', price: 18000 },
  { name: 'Travel adapter', category: 'travel', price: 3000 },
  { name: 'Neck pillow', category: 'travel', price: 2500 },
  { name: 'Packing cubes', category: 'travel', price: 4000 },
];

function formatCLP(n) {
  return '$' + n.toLocaleString('es-CL') + ' CLP';
}

const itemGrid = document.getElementById('itemGrid');
let activeFilter = 'all';

function renderItems() {
  const filtered = activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter);
  itemGrid.innerHTML = filtered.map((item, i) => {
    const suggested = Math.round((item.price * 0.85) / 500) * 500;
    return `
      <div class="item-card">
        <div class="item-thumb"><img src="${phSrc(item.category)}" alt="${item.name}, example photo"><span class="example-badge">Example</span></div>
        <div class="item-body">
          <span class="item-tag">${categoryLabel[item.category]}</span>
          <h4>${item.name}</h4>
          <p class="item-offer-note">Offers welcome</p>
          <div class="item-price-row">
            <span class="item-price">${formatCLP(item.price)}</span>
            <button class="offer-btn" type="button" data-index="${i}">Make an offer</button>
          </div>
          <form class="offer-form" data-index="${i}">
            <input type="number" min="0" step="500" value="${suggested}" aria-label="Your offer in CLP">
            <button type="submit">Send</button>
          </form>
          <p class="offer-sent" data-index="${i}">Offer sent to the seller.</p>
        </div>
      </div>
    `;
  }).join('');
}
renderItems();

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    activeFilter = chip.dataset.filter;
    renderItems();
  });
});

// Pre-select a category from a query string, e.g. marketplace.html?category=clothing
const requestedCategory = new URLSearchParams(window.location.search).get('category');
if (requestedCategory && categoryLabel[requestedCategory]) {
  const chip = document.querySelector(`.filter-chip[data-filter="${requestedCategory}"]`);
  if (chip) chip.click();
}

// ---------- Make an offer ----------
itemGrid.addEventListener('click', (e) => {
  const offerBtn = e.target.closest('.offer-btn');
  if (offerBtn) {
    const form = itemGrid.querySelector(`.offer-form[data-index="${offerBtn.dataset.index}"]`);
    form.classList.toggle('is-open');
  }
});

itemGrid.addEventListener('submit', (e) => {
  if (!e.target.classList.contains('offer-form')) return;
  e.preventDefault();
  e.target.classList.remove('is-open');
  itemGrid.querySelector(`.offer-sent[data-index="${e.target.dataset.index}"]`).classList.add('is-visible');
});
