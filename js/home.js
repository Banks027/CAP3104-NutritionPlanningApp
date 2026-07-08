if (typeof setupConfig === 'function') {
  setupConfig();
}

document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;
  const on = (element, eventName, handler) => {
    if (element) {
      element.addEventListener(eventName, handler);
    }
  };

  /* ---------- Helpers: consistent scroll lock while a panel is open ---------- */
  function lockScroll()   { body.classList.add('no-scroll'); }
  function unlockScroll() { body.classList.remove('no-scroll'); }

  /* ---------- Search overlay ---------- */
  const searchToggle  = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose   = document.getElementById('searchClose');
  const searchForm    = document.getElementById('searchForm');
  const searchInput   = document.getElementById('searchInput');

  function openSearch() {
    if (!searchOverlay || !searchToggle || !searchInput) return;
    searchOverlay.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    lockScroll();
    searchInput.focus();
  }
  function closeSearch() {
    if (!searchOverlay || !searchToggle) return;
    searchOverlay.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    unlockScroll();
    searchToggle.focus();
  }

  on(searchToggle, 'click', openSearch);
  on(searchClose, 'click', closeSearch);
  on(searchOverlay, 'click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  on(searchForm, 'submit', (e) => {
    e.preventDefault();
    const query = (new FormData(searchForm).get('q') || '').trim();
    if (!query) {
      searchInput.focus();
      return;
    }
    // TODO: point this at the real PHP search endpoint once the team confirms the route, e.g.
    // window.location.href = `/search.php?q=${encodeURIComponent(query)}`;
    console.log('Search submitted:', query);
  });

  /* ---------- Categories drawer (desktop tab + mobile nav trigger both open it) ---------- */
  const categoriesToggle       = document.getElementById('categoriesToggle');
  const categoriesToggleMobile = document.getElementById('categoriesToggleMobile');
  const categoriesDrawer       = document.getElementById('categoriesDrawer');
  const categoriesClose        = document.getElementById('categoriesClose');
  const drawerBackdrop         = document.getElementById('drawerBackdrop');

  function openDrawer() {
    if (!categoriesDrawer || !drawerBackdrop || !categoriesToggle || !categoriesToggleMobile || !categoriesClose) return;
    categoriesDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    categoriesToggle.setAttribute('aria-expanded', 'true');
    categoriesToggleMobile.setAttribute('aria-expanded', 'true');
    lockScroll();
    categoriesClose.focus();
  }
  function closeDrawer() {
    if (!categoriesDrawer || !drawerBackdrop || !categoriesToggle || !categoriesToggleMobile) return;
    categoriesDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    categoriesToggle.setAttribute('aria-expanded', 'false');
    categoriesToggleMobile.setAttribute('aria-expanded', 'false');
    unlockScroll();
  }

  on(categoriesToggle, 'click', openDrawer);
  on(categoriesToggleMobile, 'click', openDrawer);
  on(categoriesClose, 'click', closeDrawer);
  on(drawerBackdrop, 'click', closeDrawer);

  /* ---------- Escape closes whichever panel is open ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (searchOverlay.classList.contains('open')) closeSearch();
    if (categoriesDrawer.classList.contains('open')) closeDrawer();
  });

  /* ---------- Apply filters ---------- */
  on(document.getElementById('applyFilters'), 'click', () => {
    const mealTypes  = [...document.querySelectorAll('input[name="mealType"]:checked')].map(el => el.value);
    const budgets     = [...document.querySelectorAll('input[name="budget"]:checked')].map(el => el.value);
    const ingMode     = document.querySelector('input[name="ingMode"]:checked')?.value || 'include';
    const ingredients = [...document.querySelectorAll('input[name="ingredient"]:checked')].map(el => el.value);

    const filters = { mealTypes, budgets, ingredientMode: ingMode, ingredients };

    // TODO: replace with the real call once the FR1 search/filter PHP endpoint exists, e.g.
    // fetch('/api/filter.php', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(filters) })
    console.log('Filters applied:', filters);

    closeDrawer();
  });

  /* ---------- Get Started -> onboarding survey (NFR1/NFR2 flow) ---------- */
  on(document.getElementById('getStartedBtn'), 'click', () => {
    // TODO: this page doesn't exist yet. Point at the real onboarding survey once it's built
    // (NFR2 flow: Budget -> Time available -> Dietary restrictions -> Nutrition goals -> main screen).
    // Placed flat at repo root to match how SignUp.html/menu.html are referenced elsewhere in auth.js/nav.js.
    window.location.href = '../html/survey.html';
  });
  
});
