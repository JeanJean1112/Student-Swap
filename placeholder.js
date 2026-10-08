// Photo placeholders. To use a real photo, give the <img> a real src (e.g. src="images/denim-jacket.jpg")
// and remove its data-ph attribute. Anything with data-ph and no src gets a neutral stand-in.
const PH_STYLE = {
  clothing: { bg: '#FBE2DC', stroke: '#A3341C' },
  kitchen: { bg: '#FBEBD3', stroke: '#8A5A10' },
  sport: { bg: '#E4F2E8', stroke: '#164F39' },
  travel: { bg: '#F4EEE2', stroke: '#4B5A50' },
};

function phSrc(category) {
  const s = PH_STYLE[category] || PH_STYLE.travel;
  const bg = encodeURIComponent(s.bg);
  const stroke = encodeURIComponent(s.stroke);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${bg}'/%3E%3Ccircle cx='72' cy='72' r='16' fill='none' stroke='${stroke}' stroke-width='5'/%3E%3Cpath d='M24 156 L78 100 L112 134 L146 100 L176 138' fill='none' stroke='${stroke}' stroke-width='5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E`;
}

document.querySelectorAll('img[data-ph]:not([src])').forEach(img => {
  img.src = phSrc(img.dataset.ph);
});
