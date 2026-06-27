import { renderFixtures } from './fixtures.js';

const LANDING_HTML = document.getElementById('app').innerHTML;

function renderLanding() {
  const app = document.getElementById('app');
  app.innerHTML = LANDING_HTML;
  app.querySelectorAll('.flag').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = `#/${btn.dataset.lang}`;
    });
  });
}

const ROUTES = {
  '':    renderLanding,
  '/':   renderLanding,
  '/en': () => renderFixtures('en'),
  '/bg': () => renderFixtures('bg'),
};

function route() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  (ROUTES[hash] ?? renderLanding)();
}

window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}
