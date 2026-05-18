// ──────────────────────────────────────────────────────────────────────────
// app.js — Navigation, state management, and app initialization
// ──────────────────────────────────────────────────────────────────────────

// ── Navigation functions ─────────────────────────────────────────────────
function goToCalculator() {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("calculatorPage").style.display = "block";
  document.getElementById("resultsPage").style.display = "none";
  history.pushState({ page: 'calculator' }, '', '');
  window.scrollTo(0, 0);
}

function goToMenu() {
  document.getElementById("menuPage").style.display = "block";
  document.getElementById("calculatorPage").style.display = "none";
  document.getElementById("resultsPage").style.display = "none";
  history.pushState({ page: 'menu' }, '', '');
  window.scrollTo(0, 0);
}

function backToCalculator() {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("calculatorPage").style.display = "block";
  document.getElementById("resultsPage").style.display = "none";
  history.pushState({ page: 'calculator' }, '', '');
  window.scrollTo(0, 0);
}

// ── Session state persistence ───────────────────────────────────────────
function saveFormState() {
  const allComps = [...COMPONENTS.advisor, ...COMPONENTS.reader];
  const state = {};
  allComps.forEach(comp => {
    comp.criteria.forEach(crit => {
      state[crit.id] = document.getElementById(crit.id).value;
    });
  });
  const pasteEl = document.getElementById('fypPasteInput');
  if (pasteEl) state._paste = pasteEl.value;
  sessionStorage.setItem('fypFormState', JSON.stringify(state));
}

function restoreFormState() {
  const saved = sessionStorage.getItem('fypFormState');
  if (!saved) return;
  try {
    const state = JSON.parse(saved);
    const allComps = [...COMPONENTS.advisor, ...COMPONENTS.reader];
    allComps.forEach(comp => {
      comp.criteria.forEach(crit => {
        if (state[crit.id]) {
          document.getElementById(crit.id).value = state[crit.id];
        }
      });
      calcComp(comp);
    });
    const pasteEl = document.getElementById('fypPasteInput');
    if (pasteEl && state._paste) pasteEl.value = state._paste;
  } catch (e) {}
}

// ── Browser history & session restore ────────────────────────────────────
window.addEventListener('popstate', e => {
  const page = (e.state && e.state.page) || 'menu';
  if (page === 'menu') {
    document.getElementById("menuPage").style.display = "block";
    document.getElementById("calculatorPage").style.display = "none";
    document.getElementById("resultsPage").style.display = "none";
  } else if (page === 'calculator') {
    document.getElementById("menuPage").style.display = "none";
    document.getElementById("calculatorPage").style.display = "block";
    document.getElementById("resultsPage").style.display = "none";
  } else if (page === 'results') {
    document.getElementById("menuPage").style.display = "none";
    document.getElementById("calculatorPage").style.display = "none";
    document.getElementById("resultsPage").style.display = "block";
  }
  window.scrollTo(0, 0);
});

// ── Auto-parse input handler ─────────────────────────────────────────────
function initPastedInputAutoParse() {
  const inputEl = document.getElementById("fypPasteInput");
  if (!inputEl) return;
  let timer = null;
  inputEl.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (inputEl.value.trim().length >= 80) {
        parsePastedGrades({ silentOnEmpty: true });
      } else {
        setParseStatus("", "");
      }
    }, 450);
  });
}

// ── App initialization ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  restoreFormState();
  initPastedInputAutoParse();
  // Always start on the menu page; replace the initial history entry with state
  history.replaceState({ page: 'menu' }, '', '');
});
