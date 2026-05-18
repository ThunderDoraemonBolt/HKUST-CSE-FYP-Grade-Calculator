// ──────────────────────────────────────────────────────────────────────────
// parser.js — FYPMS data parsing and import logic
// ──────────────────────────────────────────────────────────────────────────

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

  saveFormState();

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
