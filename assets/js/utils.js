// ──────────────────────────────────────────────────────────────────────────
// utils.js — Utility and helper functions
// ──────────────────────────────────────────────────────────────────────────

function normalizeScore(score) {
  return Number(score.toFixed(4));
}

function pointsToLetter(p) {
  const normalizedPoints = normalizeScore(p);
  for (const s of SCALE) if (normalizedPoints >= s.min) return s.letter;
  return "F";
}

function parseGradeToken(token) {
  const normalized = token.trim();
  if (!normalized || normalized === "--") return null;
  const match = normalized.match(/([A-F][+-]?)\s*\((\d+(?:\.\d+)?)\)/i);
  if (!match) return null;
  return parseFloat(match[2]);
}

function splitCandidateLine(line) {
  return line
    .trim()
    .split(/\t+| {2,}/)
    .map(t => t.trim())
    .filter(Boolean);
}

function findMatchingOptionValue(selectEl, score) {
  const target = Number(score);
  for (const option of selectEl.options) {
    if (option.value === "") continue;
    if (Math.abs(parseFloat(option.value) - target) < 0.001) return option.value;
  }
  return null;
}

function setParseStatus(message, type) {
  const statusEl = document.getElementById("parseStatus");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "parse-status";
  if (type) statusEl.classList.add(type);
}

function isFieldEmpty(fieldId) {
  const field = document.getElementById(fieldId);
  return !!field && field.value === "";
}

function syncPointsDisplay(fieldId) {
  const selectEl = document.getElementById(fieldId);
  const pointsEl = document.getElementById(`${fieldId}_pts`);
  if (!selectEl || !pointsEl) return;
  pointsEl.textContent = selectEl.value === "" ? "—" : parseFloat(selectEl.value).toFixed(2);
}

function swapFieldValues(fieldA, fieldB) {
  const a = document.getElementById(fieldA);
  const b = document.getElementById(fieldB);
  if (!a || !b) return;
  const temp = a.value;
  a.value = b.value;
  b.value = temp;
  syncPointsDisplay(fieldA);
  syncPointsDisplay(fieldB);
}

function getMissingCriteriaCount() {
  let missing = 0;
  [...COMPONENTS.advisor, ...COMPONENTS.reader].forEach(comp => {
    comp.criteria.forEach(crit => {
      if (document.getElementById(crit.id).value === "") missing += 1;
    });
  });
  return missing;
}

function pickBestRow(rows, role, excluded) {
  const filtered = rows
    .filter(row => !excluded.has(row))
    .filter(row => role === "any" || row.roleHint === role)
    .sort((a, b) => b.filledGrades - a.filledGrades);
  return filtered[0] || null;
}
