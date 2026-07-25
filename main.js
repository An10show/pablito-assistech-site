// ===========================================================
// PABLITO ASSISTECH — main.js
// ===========================================================

document.getElementById('yearNow').textContent = new Date().getFullYear();

/* ---------- Generic carousel factory ---------- */
function makeCarousel({ trackId, dotsId, prevId, nextId, autoplayMs, slideCount }) {
  const track = document.getElementById(trackId);
  const dotsWrap = dotsId ? document.getElementById(dotsId) : null;
  const prevBtn = prevId ? document.getElementById(prevId) : null;
  const nextBtn = nextId ? document.getElementById(nextId) : null;
  let index = 0;
  let timer = null;

  if (dotsWrap) {
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'hc-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
    }
  }

  function goTo(i, manual) {
    index = (i + slideCount) % slideCount;
    update();
    if (manual) restartAutoplay();
  }

  function next(manual) { goTo(index + 1, manual); }
  function prev(manual) { goTo(index - 1, manual); }

  function restartAutoplay() {
    if (!autoplayMs) return;
    clearInterval(timer);
    timer = setInterval(() => next(false), autoplayMs);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => next(true));
  if (prevBtn) prevBtn.addEventListener('click', () => prev(true));

  // touch swipe support
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next(true) : prev(true); }
    startX = null;
  }, { passive: true });

  update();
  restartAutoplay();

  return { next, prev, goTo };
}

/* ---------- Hero carousel (5 slides) ---------- */
makeCarousel({
  trackId: 'hcTrack',
  dotsId: 'hcDots',
  prevId: 'hcPrev',
  nextId: 'hcNext',
  autoplayMs: 5500,
  slideCount: 5
});

/* ---------- Footer mini carousel (3 slides) ---------- */
makeCarousel({
  trackId: 'fcTrack',
  dotsId: 'fcDots',
  prevId: null,
  nextId: null,
  autoplayMs: 4500,
  slideCount: 3
});

/* ---------- FAQ Accordion ---------- */
document.querySelectorAll('.acc-item').forEach((item) => {
  const head = item.querySelector('.acc-head');
  const body = item.querySelector('.acc-body');

  function setState(open) {
    item.classList.toggle('open', open);
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
  }

  setState(item.classList.contains('open'));

  head.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    setState(willOpen);
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.acc-item.open .acc-body').forEach((body) => {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
});
