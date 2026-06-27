# 2027 AFL Kids Tracker

Personal AFL Kids League stat tracker and storytelling platform for Hammond Park Hurricanes. Tracks game stats for Alek (#13, Hammond Park Blue), generates Fox Footy-style match reports and season narratives, and shares them with family in Bulgaria. PWA hosted on GitHub Pages.

---

## Project structure

```
2027-afl-kids-tracker/
├── docs/                          # GitHub Pages serves from here (the live PWA)
│   ├── index.html                 # Two-flag landing page (EN / BG)
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker (offline shell + data cache)
│   ├── icons/                     # App icons (SVG)
│   ├── styles/
│   │   ├── main.css               # Landing page + base styles
│   │   ├── fixtures.css           # Fixtures & Results screen
│   │   ├── tracker.css            # Stat tracker screen
│   │   └── story.css              # Story reader screen
│   ├── scripts/
│   │   ├── app.js                 # SPA router
│   │   ├── fixtures.js            # Fixtures & Results (EN + BG)
│   │   ├── tracker.js             # Stat tracker (EN only)
│   │   └── story.js               # Story reader (BG)
│   └── data/
│       ├── fixtures.json          # 2026 season schedule + results
│       ├── fixtures-YYYY.json     # Future seasons (loaded by year selector)
│       ├── games/                 # game-YYYY-MM-DD.json (saved after each game)
│       └── stories/
│           └── 2026.json          # BG stories: prologue + chapters 1–9
├── data/                          # Schema reference files
│   ├── season-config.json
│   ├── fixtures.json
│   ├── games/_template.json
│   └── stories/_template.json
└── PROJECT-INSTRUCTIONS-v1.0.md
```

## GitHub Pages

- **Source:** Deploy from branch `main`, folder `/docs`
- **URL:** `zstoimenov.github.io/2027-afl-kids-tracker`

> Enable Pages in **Settings → Pages → Build and deployment → Deploy from a branch**, then select `main` / `/docs`.

## Local preview

The PWA is static. Serve `docs/` over HTTP (service workers need a server, not `file://`):

```bash
cd docs && python3 -m http.server 8000
# open http://localhost:8000
```

---

## Development plan

### Phase 1 — Foundation ✅ Complete

| Task | Status |
|---|---|
| Repo folder structure (`docs/`, `src/`, `data/`) | ✅ Done |
| JSON data schema files with default values | ✅ Done |
| PWA shell: installable manifest + service worker | ✅ Done |
| Two-flag landing page (🇦🇺 EN / 🇧🇬 BG) | ✅ Done |
| Hash-based SPA router (`#/`, `#/en`, `#/bg`, `#/en/tracker`, `#/bg/story/*`) | ✅ Done |
| Landing page polish — Fox Footy broadcast aesthetic | ✅ Done |

---

### Phase 2 — Fixtures & Stories ✅ Complete

| Task | Status |
|---|---|
| EN Fixtures & Results screen (round, date, ground, result, score) | ✅ Done |
| BG Fixtures & Results screen (fan/grandparent tone, warm narrative framing) | ✅ Done |
| Multi-year season selector (year bar with prev/next navigation) | ✅ Done |
| AWST → EEST time conversion for BG screen | ✅ Done |
| Score display: goals.behinds (total) format | ✅ Done |
| Prologue card at top of BG fixtures list | ✅ Done |
| BG story reader screen (`#/bg/story/prologue`, `#/bg/story/N`) | ✅ Done |
| Bulgarian story content: prologue + chapters 1–9 (2026 season) | ✅ Done |
| Story buttons on BG past-game cards (rounds 1–9) | ✅ Done |

---

### Phase 3 — Stat Tracker ✅ Complete

| Task | Status |
|---|---|
| Tracker screen layout: ctrl-bar / game-bar / scoreboard / alek strip / stat buttons | ✅ Done |
| Quarter countdown timer (default 15 min, editable before game start, locked after) | ✅ Done |
| Start / pause / resume timer with ▶ / ⏸ button | ✅ Done |
| Position selector: tap to cycle — / DEF / MID / FWD | ✅ Done |
| Scoreboard interactions: single tap HP = shot attempt | ✅ Done |
| Scoreboard interactions: double tap HP = behind fork, long press HP = goal fork | ✅ Done |
| Scoreboard interactions: double tap / long press opp = behind / goal (no fork) | ✅ Done |
| Fork popup: GOAL / BEHIND → Alek #13 / Teammate attribution | ✅ Done |
| Stat buttons: tap = attempt, long press = successful (🤲 Disposal / 🤼 Tackle / 🏉 Mark) | ✅ Done |
| Haptic feedback: short/weak for attempts, long/strong for successes | ✅ Done |
| Quarter recap popup (long press Q label): mood 🔥😐😮‍💨 + notes field + End Quarter | ✅ Done |
| Per-quarter state: position, mood, notes, aleksStats, teamScore snapshot | ✅ Done |
| Undo last action | ✅ Done |
| LocalStorage persistence (resume mid-game after accidental navigation) | ✅ Done |
| Summary screen: scoreline, per-quarter breakdown with moods, totals | ✅ Done |
| Export JSON to clipboard with GitHub Mobile paste instructions | ✅ Done |
| Game JSON schema matching spec: per-quarter + totals + points calculation | ✅ Done |
| BG side blocked from tracker (view-only) | ✅ Done |
| Old game results not editable (results come from saved JSON only) | ✅ Done |

---

### Phase 4 — Password Gates 🔲 Not started

| Task | Status |
|---|---|
| Tracker password gate (EN side, Zak only) — case-insensitive, caps + numbers | 🔲 Todo |
| Family password gate (BG side) — case-insensitive, caps + numbers | 🔲 Todo |
| Session unlock: tracker stays unlocked for full session once entered | 🔲 Todo |
| Passwords stored as environment config (never in data files or source) | 🔲 Todo |

---

### Phase 5 — Game Data Pipeline 🔲 Not started

The tracker currently saves game JSON via clipboard → GitHub Mobile paste. Once game files exist in `docs/data/games/`, the pipeline below makes the rest of the app data-driven.

| Task | Status |
|---|---|
| Fixtures screen reads results from `games/game-YYYY-MM-DD.json` (not hard-coded in fixtures.json) | 🔲 Todo |
| `fixtures.json` result fields updated from game files on load | 🔲 Todo |
| Debrief section in game JSON: `didWell` + `workOn` fields (post-game input screen) | 🔲 Todo |
| `season-config.json` integration: read player number, team name dynamically | 🔲 Todo |
| Home/away colour scheme auto-detection from fixtures.json | 🔲 Todo |

---

### Phase 6 — Match Reports & Story Generation 🔲 Not started

Claude generates stories from game JSON. Stories are saved once and never regenerated unless explicitly requested.

| Task | Status |
|---|---|
| Story generation prompt: Claude receives game JSON → outputs EN + BG story JSON | 🔲 Todo |
| EN story format: headline + Fox Footy commentator + coach notes | 🔲 Todo |
| BG story format: warm grandparent-tone narrative (2–3 rich paragraphs) | 🔲 Todo |
| Story saved to `docs/data/stories/story-YYYY-MM-DD.json` | 🔲 Todo |
| EN Match Reports screen (Alek-facing, kid-friendly) | 🔲 Todo |
| BG Game Stories screen updated to read from per-game story JSON files | 🔲 Todo |

---

### Phase 7 — Season Arc 🔲 Not started

| Task | Status |
|---|---|
| Season arc generation: Claude receives all game JSONs → season narrative | 🔲 Todo |
| BG Season Arc screen | 🔲 Todo |
| EN Season summary view | 🔲 Todo |

---

### Known gaps / future improvements

| Item | Note |
|---|---|
| Player number change next season | Read from `season-config.json` — field exists but not yet wired |
| `seasonTeamName` field | Reserved for next year's team rename |
| `nicknames` array in player config | Story variety — not yet used |
| `shoeColour` + personal details | Richer story colour — not yet used |
| Fixtures for 2027 season | To be added to `docs/data/fixtures-2027.json` when schedule is published |
