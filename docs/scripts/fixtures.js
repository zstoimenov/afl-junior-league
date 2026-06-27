const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTHS_BG = ['ЯНУ','ФЕВ','МАР','АПР','МАЙ','ЮНИ','ЮЛИ','АВГ','СЕП','ОКТ','НОЕ','ДЕК'];

function fmtDate(dateStr, lang) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} ${(lang === 'bg' ? MONTHS_BG : MONTHS_EN)[m - 1]}`;
}

function fmtScore(t) {
  return `${t.goals}.${t.behinds} (${t.score})`;
}

function hasResult(round) {
  return round.result && round.result.winner !== '';
}

function opponent(round) {
  if (!round.homeAway) return '';
  return round.homeAway === 'home' ? round.awayTeam : round.homeTeam;
}

function gameState(round, today) {
  if (!round.date) return 'tbd';
  if (round.date === today) return 'today';
  if (round.date < today) return 'past';
  return 'upcoming';
}

/* ---- English card ---- */

function cardEn(round, state) {
  const opp = opponent(round) || 'TBD';
  const ha = round.homeAway;

  const haChip = ha
    ? `<span class="ha-chip ha-chip--${ha}">${ha === 'home' ? 'HOME' : 'AWAY'}</span>`
    : '';

  const todayPill = state === 'today'
    ? `<span class="today-dot">TODAY</span>`
    : '';

  const venueTime = `
    <div class="fixture-card__venue">
      <span class="venue-name">${round.ground || 'Venue TBD'}</span>
      ${round.time ? `<span class="venue-time">${round.time}</span>` : ''}
    </div>`;

  return `
    <div class="fixture-card__top">
      <span class="round-label">RD ${round.round}</span>
      <div class="fixture-card__top-mid">
        <span class="date-label">${fmtDate(round.date, 'en') || 'TBD'}</span>
        ${todayPill}
      </div>
      ${haChip}
    </div>
    <div class="fixture-card__opponent">${opp}</div>
    ${venueTime}`;
}

/* ---- Bulgarian card ---- */

function bgNarrative(round, state) {
  const opp = opponent(round);
  if (!opp) return 'Предстои уточняване';
  const ha = round.homeAway;

  if (state === 'today') {
    return ha === 'home'
      ? `Алек посреща <strong>${opp}</strong> у дома`
      : `Алек играе на гости срещу <strong>${opp}</strong>`;
  }
  if (state === 'past') {
    return ha === 'home'
      ? `Алек посрещна <strong>${opp}</strong> у дома`
      : `Алек пътува до ${round.ground || 'гостите'} срещу <strong>${opp}</strong>`;
  }
  return ha === 'home'
    ? `Алек ще посрещне <strong>${opp}</strong> у дома`
    : `Алек ще пътува до ${round.ground || 'гостите'} срещу <strong>${opp}</strong>`;
}

function cardBg(round, state) {
  const ha = round.homeAway;

  const haChip = ha
    ? `<span class="ha-chip ha-chip--${ha}">${ha === 'home' ? 'У ДОМА' : 'НА ГОСТИ'}</span>`
    : '';

  const todayPill = state === 'today'
    ? `<span class="today-dot">ДНЕС</span>`
    : '';

  const venueTime = `
    <div class="fixture-card__venue">
      <span class="venue-name">${round.ground || 'Стадионът предстои'}</span>
      ${round.time ? `<span class="venue-time">${round.time}</span>` : ''}
    </div>`;

  return `
    <div class="fixture-card__top">
      <span class="round-label">КР ${round.round}</span>
      <div class="fixture-card__top-mid">
        <span class="date-label">${fmtDate(round.date, 'bg') || 'ПРЕДСТОИ'}</span>
        ${todayPill}
      </div>
      ${haChip}
    </div>
    <div class="fixture-card__narrative">${bgNarrative(round, state)}</div>
    ${venueTime}`;
}

/* ---- Score row ---- */

function scoreRow(round, lang) {
  const isEn = lang === 'en';

  if (!hasResult(round)) {
    return `<div class="score-dash">— · —</div>`;
  }

  const hp  = round.result.hammondPark;
  const opp = round.result.opposition;
  const w   = round.result.winner;

  const hpWon  = w === 'hammondPark';
  const oppWon = w === 'opposition';

  const chip = hpWon
    ? (isEn ? 'WIN' : 'ПОБЕДА')
    : oppWon
      ? (isEn ? 'LOSS' : 'ЗАГУБА')
      : (isEn ? 'DRAW' : 'РАВЕНСТВО');

  const chipClass = hpWon ? 'win' : oppWon ? 'loss' : 'draw';

  const oppName = (opponent(round) || 'OPP').toUpperCase().substring(0, 11);

  return `
    <div class="score-row">
      <div class="score-team">
        <span class="score-team__name">HP BLUE</span>
        <span class="score-team__value">${fmtScore(hp)}</span>
      </div>
      <div class="score-mid">
        <span class="score-sep">·</span>
        <span class="result-chip result-chip--${chipClass}">${chip}</span>
      </div>
      <div class="score-team score-team--right">
        <span class="score-team__name">${oppName}</span>
        <span class="score-team__value">${fmtScore(opp)}</span>
      </div>
    </div>`;
}

/* ---- Full card ---- */

function buildCard(round, lang, today) {
  const state = gameState(round, today);
  const classes = ['fixture-card'];
  if (state === 'today') classes.push('fixture-card--today');
  else if (state === 'past') classes.push('fixture-card--past');
  else if (state === 'tbd') classes.push('fixture-card--tbd');

  const inner = lang === 'bg'
    ? cardBg(round, state)
    : cardEn(round, state);

  return `
    <article class="${classes.join(' ')}" data-round="${round.round}" data-state="${state}">
      ${inner}
      ${scoreRow(round, lang)}
    </article>`;
}

/* ---- Screen entry point ---- */

export async function renderFixtures(lang) {
  const app = document.getElementById('app');
  const isEn = lang === 'en';

  app.innerHTML = `
    <div class="screen">
      <header class="screen-header">
        <button class="back-btn" id="back-btn" aria-label="${isEn ? 'Back' : 'Назад'}">‹</button>
        <div class="screen-header__mid">
          <div class="screen-header__club">Hammond Park Blue</div>
          <h1 class="screen-header__title">${isEn ? 'Fixtures &amp; Results' : 'Мачове &amp; Резултати'}</h1>
        </div>
        <span class="screen-header__season" id="season-year"></span>
      </header>
      <div class="fixtures-list" id="fixtures-list">
        <div class="screen-loading">${isEn ? 'Loading…' : 'Зарежда се…'}</div>
      </div>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  try {
    const [, fixtures] = await Promise.all([
      fetch('./data/season-config.json').then(r => r.json()),
      fetch('./data/fixtures.json').then(r => r.json()),
    ]);

    document.getElementById('season-year').textContent = fixtures.season;

    const today = new Date().toISOString().split('T')[0];
    const list  = document.getElementById('fixtures-list');

    list.innerHTML = fixtures.rounds.map(r => buildCard(r, lang, today)).join('');

    const todayCard = list.querySelector('[data-state="today"]');
    if (todayCard) {
      requestAnimationFrame(() =>
        todayCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      );
    }
  } catch {
    document.getElementById('fixtures-list').innerHTML =
      `<div class="screen-error">${isEn ? 'Could not load fixtures.' : 'Грешка при зареждане.'}</div>`;
  }
}
