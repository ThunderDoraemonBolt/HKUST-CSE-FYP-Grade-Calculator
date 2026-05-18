// ── Navigation functions ─────────────────────────────────────────────────
function goToCalculator() {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("calculatorPage").style.display = "block";
  window.scrollTo(0, 0);
}

function goToMenu() {
  document.getElementById("menuPage").style.display = "block";
  document.getElementById("calculatorPage").style.display = "none";
  document.getElementById("results").style.display = "none";
  resetAll();
  window.scrollTo(0, 0);
}

function backToCalculator() {
  document.getElementById("calculatorPage").classList.remove("show-results");
  document.getElementById("results").style.display = "none";
  window.scrollTo(0, 0);
}

// ── grade / scale data ───────────────────────────────────────────────────
const GRADES = [
  { letter: "A+", points: 4.30 },
  { letter: "A",  points: 4.00 },
  { letter: "A-", points: 3.70 },
  { letter: "B+", points: 3.30 },
  { letter: "B",  points: 3.00 },
  { letter: "B-", points: 2.70 },
  { letter: "C+", points: 2.30 },
  { letter: "C",  points: 2.00 },
  { letter: "C-", points: 1.70 },
  { letter: "D",  points: 1.00 },
  { letter: "F",  points: 0.00 },
];

const SCALE = [
  { min: 4.15, letter: "A+", rowId: "sr-Ap" },
  { min: 3.85, letter: "A",  rowId: "sr-A"  },
  { min: 3.50, letter: "A-", rowId: "sr-Am" },
  { min: 3.15, letter: "B+", rowId: "sr-Bp" },
  { min: 2.85, letter: "B",  rowId: "sr-B"  },
  { min: 2.50, letter: "B-", rowId: "sr-Bm" },
  { min: 2.15, letter: "C+", rowId: "sr-Cp" },
  { min: 1.85, letter: "C",  rowId: "sr-C"  },
  { min: 1.35, letter: "C-", rowId: "sr-Cm" },
  { min: 0.50, letter: "D",  rowId: "sr-D"  },
  { min: 0.00, letter: "F",  rowId: "sr-F"  },
];

function normalizeScore(score) {
  return Number(score.toFixed(4));
}

function pointsToLetter(p) {
  const normalizedPoints = normalizeScore(p);
  for (const s of SCALE) if (normalizedPoints >= s.min) return s.letter;
  return "F";
}

// ── component & criteria definitions ─────────────────────────────────────
const COMPONENTS = {
  advisor: [
    {
      id: "adv_prop", label: "Project Proposal Report", compWeight: 0.05,
      criteria: [
        { id: "adv_prop_c1", label: "Project objective formulation, methodology & background", weight: 0.60 },
        { id: "adv_prop_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_prop_c3", label: "Planning of future work", weight: 0.10 },
      ]
    },
    {
      id: "adv_ethics", label: "Individual Ethics Essay", compWeight: 0.05,
      criteria: [
        { id: "adv_ethics_c1", label: "Content",   weight: 0.40 },
        { id: "adv_ethics_c2", label: "Clarity",   weight: 0.30 },
        { id: "adv_ethics_c3", label: "Relevance", weight: 0.30 },
      ]
    },
    {
      id: "adv_prog", label: "Project Progress Report", compWeight: 0.20,
      criteria: [
        { id: "adv_prog_c1", label: "Work completed", weight: 0.60 },
        { id: "adv_prog_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_prog_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "adv_final", label: "Final Project Report", compWeight: 0.35,
      criteria: [
        { id: "adv_final_c1", label: "Results obtained", weight: 0.60 },
        { id: "adv_final_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_final_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "adv_oral", label: "Oral Presentation", compWeight: 0.30,
      criteria: [
        { id: "adv_oral_c1", label: "Project demonstration", weight: 0.40 },
        { id: "adv_oral_c2", label: "Delivery (oral, audience contact, slides, timing)", weight: 0.40 },
        { id: "adv_oral_c3", label: "Quality of answers", weight: 0.20 },
      ]
    },
    {
      id: "adv_monthly", label: "Monthly Reports (3 reports)", compWeight: 0.05,
      criteria: [
        { id: "adv_monthly_c1", label: "Report 1 (October) - Equal weight across all 3 reports", weight: 1/3 },
        { id: "adv_monthly_c2", label: "Report 2 (November) - Equal weight across all 3 reports", weight: 1/3 },
        { id: "adv_monthly_c3", label: "Report 3 (December/January) - Equal weight across all 3 reports", weight: 1/3 },
      ]
    },
  ],
  reader: [
    {
      id: "read_prop", label: "Project Proposal Report", compWeight: 0.05,
      criteria: [
        { id: "read_prop_c1", label: "Project objective formulation, methodology & background", weight: 0.60 },
        { id: "read_prop_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_prop_c3", label: "Planning of future work", weight: 0.10 },
      ]
    },
    {
      id: "read_prog", label: "Project Progress Report", compWeight: 0.15,
      criteria: [
        { id: "read_prog_c1", label: "Work completed", weight: 0.60 },
        { id: "read_prog_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_prog_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "read_final", label: "Final Project Report", compWeight: 0.35,
      criteria: [
        { id: "read_final_c1", label: "Results obtained", weight: 0.60 },
        { id: "read_final_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_final_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "read_oral", label: "Oral Presentation", compWeight: 0.40,
      criteria: [
        { id: "read_oral_c1", label: "Project demonstration", weight: 0.40 },
        { id: "read_oral_c2", label: "Delivery (oral, audience contact, slides, timing)", weight: 0.40 },
        { id: "read_oral_c3", label: "Quality of answers", weight: 0.20 },
      ]
    },
    {
      id: "read_video", label: "Poster Session / Video Trailer", compWeight: 0.05,
      criteria: [
        { id: "read_video_c1", label: "Clarity & presentation of poster / video", weight: 0.50 },
        { id: "read_video_c2", label: "Information conveyed", weight: 0.50 },
      ]
    },
  ]
};

const IMPORT_TARGETS = {
  advisor: [
    { id: "adv_prop_c1", index: 1 },
    { id: "adv_prop_c2", index: 0 },
    { id: "adv_prop_c3", index: 2 },
    { id: "adv_prog_c1", index: 6 },
    { id: "adv_prog_c2", index: 5 },
    { id: "adv_prog_c3", index: 7 },
    { id: "adv_oral_c1", index: 10 },
    { id: "adv_oral_c2", index: 11 },
    { id: "adv_oral_c3", index: 12 },
    { id: "adv_final_c1", index: 15 },
    { id: "adv_final_c2", index: 14 },
    { id: "adv_final_c3", index: 16 },
    { id: "adv_ethics_c1", index: 23 },
    { id: "adv_ethics_c2", index: 24 },
    { id: "adv_ethics_c3", index: 25 },
  ],
  reader: [
    { id: "read_prop_c1", index: 1 },
    { id: "read_prop_c2", index: 0 },
    { id: "read_prop_c3", index: 2 },
    { id: "read_prog_c1", index: 6 },
    { id: "read_prog_c2", index: 5 },
    { id: "read_prog_c3", index: 7 },
    { id: "read_oral_c1", index: 10 },
    { id: "read_oral_c2", index: 11 },
    { id: "read_oral_c3", index: 12 },
    { id: "read_final_c1", index: 15 },
    { id: "read_final_c2", index: 14 },
    { id: "read_final_c3", index: 16 },
    { id: "read_video_c1", index: 20 },
    { id: "read_video_c2", index: 19 },
  ],
};

// ── build a grade <select> element ───────────────────────────────────────
function makeSelect(id, onChangeFn) {
  const sel = document.createElement("select");
  sel.id = id;
  sel.addEventListener("change", onChangeFn);
  const def = document.createElement("option");
  def.value = ""; def.textContent = "--";
  sel.appendChild(def);
  GRADES.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.points;
    opt.textContent = `${g.letter} (${g.points.toFixed(2)})`;
    sel.appendChild(opt);
  });
  return sel;
}

// ── dynamically build table rows ──────────────────────────────────────────
function buildTable(tbodyId, components) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";
  components.forEach(comp => {
    const compRow = document.createElement("tr");
    compRow.className = "comp-row";
    compRow.innerHTML = `
      <td><strong>${comp.label}</strong>
        <span class="auto-note">↓ auto-calculated from criteria below</span></td>
      <td class="tcenter">${(comp.compWeight * 100).toFixed(0)}%</td>
      <td class="tcenter" id="${comp.id}_letter"><em class="pending">fill criteria ↓</em></td>
      <td class="tcenter" id="${comp.id}_pts"><em class="pending">—</em></td>`;
    tbody.appendChild(compRow);

    comp.criteria.forEach(crit => {
      const subRow = document.createElement("tr");
      subRow.className = "sub-row";

      const td1 = document.createElement("td");
      td1.className = "sub-cell";
      td1.textContent = crit.label;

      const td2 = document.createElement("td");
      td2.className = "sub-wt-cell";
      td2.textContent = `${(crit.weight * 100).toFixed(0)}%`;

      const td3 = document.createElement("td");
      td3.className = "tcenter";
      td3.appendChild(makeSelect(crit.id, () => {
        const val = document.getElementById(crit.id).value;
        document.getElementById(`${crit.id}_pts`).textContent =
          val !== "" ? parseFloat(val).toFixed(2) : "—";
        calcComp(comp);
      }));

      const td4 = document.createElement("td");
      td4.className = "tcenter";
      td4.id = `${crit.id}_pts`;
      td4.textContent = "—";

      subRow.appendChild(td1); subRow.appendChild(td2);
      subRow.appendChild(td3); subRow.appendChild(td4);
      tbody.appendChild(subRow);
    });
  });
}

// ── auto-calculate component grade from its sub-criteria ─────────────────
function calcComp(comp) {
  let total = 0, allFilled = true;
  for (const crit of comp.criteria) {
    const val = document.getElementById(crit.id).value;
    if (val === "") { allFilled = false; break; }
    total += parseFloat(val) * crit.weight;
  }
  const letterEl = document.getElementById(`${comp.id}_letter`);
  const ptsEl    = document.getElementById(`${comp.id}_pts`);
  if (!allFilled) {
    letterEl.innerHTML  = `<em class="pending">fill criteria ↓</em>`;
    ptsEl.innerHTML     = `<em class="pending">—</em>`;
    letterEl.dataset.pts = "";
  } else {
    const letter = pointsToLetter(total);
    letterEl.innerHTML   = `<span class="calc-grade">${letter}</span>`;
    ptsEl.textContent    = total.toFixed(3);
    letterEl.dataset.pts = total;
  }
}

// ── build tables on page load ─────────────────────────────────────────────
buildTable("adv_tbody",  COMPONENTS.advisor);
buildTable("read_tbody", COMPONENTS.reader);

// ── calculate final grade ─────────────────────────────────────────────────
function calculate() {
  const allComps = [...COMPONENTS.advisor, ...COMPONENTS.reader];
  const missingFields = [];
  for (const comp of allComps) {
    for (const crit of comp.criteria) {
      if (document.getElementById(crit.id).value === "") {
        missingFields.push(`${comp.label} - ${crit.label}`);
      }
    }
  }

  if (missingFields.length > 0) {
    const msg = [
      "Please input values for the following lines:",
      "",
      ...missingFields.map((item, idx) => `${idx + 1}. ${item}`),
    ].join("\n");
    alert(msg);
    return;
  }

  function sectionTotal(components) {
    let total = 0;
    for (const comp of components) {
      let compTotal = 0;
      for (const crit of comp.criteria)
        compTotal += parseFloat(document.getElementById(crit.id).value) * crit.weight;
      const weighted = compTotal * comp.compWeight;
      total += weighted;
    }
    return total;
  }

  const advTotal  = sectionTotal(COMPONENTS.advisor);
  const readTotal = sectionTotal(COMPONENTS.reader);

  const advContrib  = advTotal  * 0.60;
  const readContrib = readTotal * 0.40;
  const finalScore  = normalizeScore(advContrib + readContrib);
  const finalLetter = pointsToLetter(finalScore);

  document.getElementById("final_score_line").textContent = `Final Score: ${finalScore.toFixed(4)}`;
  document.getElementById("final_grade_big").textContent  = finalLetter;

  const entry = SCALE.find(s => finalScore >= s.min);
  const idx   = SCALE.indexOf(entry);
  const lower = entry.min.toFixed(2);
  document.getElementById("final_range_line").textContent =
    idx === 0 ? `Score ≥ ${lower}` : `Score range: ${lower} – ${(SCALE[idx - 1].min - 0.01).toFixed(2)}`;

  SCALE.forEach(s => {
    const row = document.getElementById(s.rowId);
    if (row) row.classList.remove("active-grade");
  });
  if (entry) document.getElementById(entry.rowId).classList.add("active-grade");

  document.getElementById("calculatorPage").classList.add("show-results");
  document.getElementById("results").style.display = "block";
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// ── reset ─────────────────────────────────────────────────────────────────
function resetAll() {
  const allComps = [...COMPONENTS.advisor, ...COMPONENTS.reader];
  allComps.forEach(comp => {
    document.getElementById(`${comp.id}_letter`).innerHTML  = `<em class="pending">fill criteria ↓</em>`;
    document.getElementById(`${comp.id}_pts`).innerHTML     = `<em class="pending">—</em>`;
    document.getElementById(`${comp.id}_letter`).dataset.pts = "";
    comp.criteria.forEach(crit => {
      document.getElementById(crit.id).value = "";
      document.getElementById(`${crit.id}_pts`).textContent = "—";
    });
  });
  document.getElementById("calculatorPage").classList.remove("show-results");
  document.getElementById("results").style.display = "none";
  SCALE.forEach(s => {
    const row = document.getElementById(s.rowId);
    if (row) row.classList.remove("active-grade");
  });
}

function setParseStatus(message, type) {
  const statusEl = document.getElementById("parseStatus");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = "parse-status";
  if (type) statusEl.classList.add(type);
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

function parseRowTokens(tokens) {
  const studentIdIndex = tokens.findIndex(tok => /^\d{8}$/.test(tok));
  if (studentIdIndex < 0 || studentIdIndex + 3 >= tokens.length) return null;

  const metrics = tokens.slice(studentIdIndex + 2);
  const readGrade = index => (index < metrics.length ? parseGradeToken(metrics[index]) : null);

  const row = {
    studentId: tokens[studentIdIndex],
    evaluator: tokens[studentIdIndex + 1],
    gradesByIndex: metrics.map(parseGradeToken),
    totals: {
      proposal: readGrade(4),
      progress: readGrade(9),
      oral: readGrade(13),
      finalReport: readGrade(18),
      video: readGrade(22),
      ethics: readGrade(27),
    },
  };

  const ethicsCount = [23, 24, 25].filter(i => row.gradesByIndex[i] !== null).length;
  const videoCount = [19, 20].filter(i => row.gradesByIndex[i] !== null).length;
  if (ethicsCount >= 2) row.roleHint = "advisor";
  else if (videoCount >= 1) row.roleHint = "reader";
  else row.roleHint = "unknown";

  row.filledGrades = row.gradesByIndex.filter(v => v !== null).length;
  return row;
}

function findMatchingOptionValue(selectEl, score) {
  const target = Number(score);
  for (const option of selectEl.options) {
    if (option.value === "") continue;
    if (Math.abs(parseFloat(option.value) - target) < 0.001) return option.value;
  }
  return null;
}

function applyGradeToField(fieldId, score) {
  if (score === null) return false;
  const selectEl = document.getElementById(fieldId);
  if (!selectEl) return false;
  let matchValue = findMatchingOptionValue(selectEl, score);
  if (!matchValue) {
    const nearestLetter = pointsToLetter(score);
    const nearestGrade = GRADES.find(g => g.letter === nearestLetter);
    if (nearestGrade) {
      matchValue = findMatchingOptionValue(selectEl, nearestGrade.points);
    }
  }
  if (!matchValue) return false;

  selectEl.value = matchValue;
  const pointsEl = document.getElementById(`${fieldId}_pts`);
  if (pointsEl) pointsEl.textContent = parseFloat(matchValue).toFixed(2);
  return true;
}

function recalcRole(role) {
  COMPONENTS[role].forEach(comp => calcComp(comp));
}

function isFieldEmpty(fieldId) {
  const field = document.getElementById(fieldId);
  return !!field && field.value === "";
}

function applyRowToRole(row, role) {
  let filled = 0;
  IMPORT_TARGETS[role].forEach(target => {
    if (applyGradeToField(target.id, row.gradesByIndex[target.index])) filled += 1;
  });

  recalcRole(role);
  return { filled };
}

function fillMissingFromRows(rows, role, studentIdFilter) {
  let filled = 0;
  IMPORT_TARGETS[role].forEach(target => {
    if (!isFieldEmpty(target.id)) return;
    const candidate = rows.find(row => {
      if (studentIdFilter && row.studentId !== studentIdFilter) return false;
      return row.gradesByIndex[target.index] !== null;
    });
    if (!candidate) return;
    if (applyGradeToField(target.id, candidate.gradesByIndex[target.index])) filled += 1;
  });
  recalcRole(role);
  return filled;
}

function parseMonthlyGrades(rawText) {
  const monthlyMap = {
    oct: "adv_monthly_c1",
    nov: "adv_monthly_c2",
    decjan: "adv_monthly_c3",
  };
  const lines = rawText.split(/\r?\n/);
  const result = {};

  lines.forEach(line => {
    if (!/monthly\s+report/i.test(line)) return;
    const grade = parseGradeToken(line);
    if (grade === null) return;

    const normalized = line.toLowerCase();
    if (/oct/.test(normalized)) result[monthlyMap.oct] = grade;
    if (/nov/.test(normalized)) result[monthlyMap.nov] = grade;
    if (/dec\s*\/\s*jan|dec\/?jan/.test(normalized)) result[monthlyMap.decjan] = grade;
  });

  return result;
}

function applyMonthlyGrades(monthlyGrades) {
  let filled = 0;
  Object.entries(monthlyGrades).forEach(([fieldId, score]) => {
    if (applyGradeToField(fieldId, score)) filled += 1;
  });
  recalcRole("advisor");
  return filled;
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

function swapAdvisorReaderSharedComponents() {
  const pairs = [
    ["adv_prop_c1", "read_prop_c1"],
    ["adv_prop_c2", "read_prop_c2"],
    ["adv_prop_c3", "read_prop_c3"],
    ["adv_prog_c1", "read_prog_c1"],
    ["adv_prog_c2", "read_prog_c2"],
    ["adv_prog_c3", "read_prog_c3"],
    ["adv_oral_c1", "read_oral_c1"],
    ["adv_oral_c2", "read_oral_c2"],
    ["adv_oral_c3", "read_oral_c3"],
    ["adv_final_c1", "read_final_c1"],
    ["adv_final_c2", "read_final_c2"],
    ["adv_final_c3", "read_final_c3"],
  ];
  pairs.forEach(([a, b]) => swapFieldValues(a, b));
  recalcRole("advisor");
  recalcRole("reader");
}

function applyTargetsFromRow(targets, row) {
  if (!row) return 0;
  let filled = 0;
  targets.forEach(target => {
    if (applyGradeToField(target.id, row.gradesByIndex[target.index])) filled += 1;
  });
  return filled;
}

function applySwitchedSharedComponents(parsedRows) {
  const detailedRows = parsedRows
    .filter(row => row.filledGrades >= 12)
    .sort((a, b) => b.filledGrades - a.filledGrades);

  if (detailedRows.length === 0) return 0;

  // Requested behavior: advisor/reader shared components are switched.
  const readerSource = detailedRows[0];
  const advisorSource = detailedRows[1] || detailedRows[0];
  const advisorSharedTargets = IMPORT_TARGETS.advisor.slice(0, 12);
  const readerSharedTargets = IMPORT_TARGETS.reader.slice(0, 12);

  const filledAdvisor = applyTargetsFromRow(advisorSharedTargets, advisorSource);
  const filledReader = applyTargetsFromRow(readerSharedTargets, readerSource);
  recalcRole("advisor");
  recalcRole("reader");
  return filledAdvisor + filledReader;
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

function parsePastedGrades(options) {
  const opts = options || {};
  const inputEl = document.getElementById("fypPasteInput");
  if (!inputEl) return;

  const rawText = inputEl.value.trim();
  if (!rawText) {
    if (!opts.silentOnEmpty) setParseStatus("Paste FYPMS content first.", "warn");
    return;
  }

  const lines = rawText.split(/\r?\n/);
  const parsedRows = [];

  lines.forEach(line => {
    if (!/[A-F][+-]?\s*\(\d/.test(line) || !/\d{8}/.test(line)) return;
    const tokens = splitCandidateLine(line);
    if (tokens.length < 18) return;
    const parsed = parseRowTokens(tokens);
    // Keep sparse rows too (for example, ethics-only rows) so we can merge missing fields.
    if (parsed && parsed.filledGrades >= 3) parsedRows.push(parsed);
  });

  if (parsedRows.length === 0) {
    setParseStatus("No valid grading rows were detected. Try copying the table rows directly from FYPMS.", "error");
    return;
  }

  resetAll();

  const usedRows = new Set();
  let advisorRow = pickBestRow(parsedRows, "advisor", usedRows);
  if (!advisorRow) advisorRow = pickBestRow(parsedRows, "any", usedRows);
  if (advisorRow) usedRows.add(advisorRow);

  let readerRow = pickBestRow(parsedRows, "reader", usedRows);
  if (!readerRow) readerRow = pickBestRow(parsedRows, "any", usedRows);
  if (readerRow) usedRows.add(readerRow);

  let advisorResult = { filled: 0 };
  let readerResult = { filled: 0 };

  if (advisorRow) advisorResult = applyRowToRole(advisorRow, "advisor");
  if (readerRow) readerResult = applyRowToRole(readerRow, "reader");

  const sameStudentId = advisorRow?.studentId || readerRow?.studentId || null;
  const supplementalAdvisor = fillMissingFromRows(parsedRows, "advisor", sameStudentId);
  const supplementalReader = fillMissingFromRows(parsedRows, "reader", sameStudentId);

  // Requested behavior: switch advisor/reader values for shared report/presentation components.
  const switchedSharedCount = applySwitchedSharedComponents(parsedRows);

  const monthlyFromText = applyMonthlyGrades(parseMonthlyGrades(rawText));

  const missingCount = getMissingCriteriaCount();
  const autoCalculated = missingCount === 0;
  if (autoCalculated) {
    calculate();
  }

  const pickedIds = [advisorRow?.studentId, readerRow?.studentId].filter(Boolean);
  const sameStudent = pickedIds.length > 1 && pickedIds[0] === pickedIds[1];
  const monthlyNote = monthlyFromText > 0
    ? " Monthly report grades were imported from pasted text."
    : "";

  if (!advisorRow || !readerRow) {
    setParseStatus("Only one role row was detected. Please paste both advisor and reader rows.", "warn");
    return;
  }

  if (autoCalculated) {
    const studentInfo = sameStudent ? ` Student ID ${pickedIds[0]}.` : "";
    setParseStatus(`Imported and calculated successfully.${studentInfo}${monthlyNote}`, "success");
  } else {
    const importedCount = advisorResult.filled + readerResult.filled + supplementalAdvisor + supplementalReader + switchedSharedCount + monthlyFromText;
    setParseStatus(
      `Imported ${importedCount} criteria, but ${missingCount} fields are still missing.${monthlyNote}`,
      "warn"
    );
  }
}

function clearPastedContent() {
  const inputEl = document.getElementById("fypPasteInput");
  if (inputEl) inputEl.value = "";
  setParseStatus("", "");
}

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

initPastedInputAutoParse();