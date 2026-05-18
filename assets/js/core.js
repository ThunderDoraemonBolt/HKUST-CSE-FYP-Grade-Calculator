// ──────────────────────────────────────────────────────────────────────────
// core.js — Core UI and calculation logic
// ──────────────────────────────────────────────────────────────────────────

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
        saveFormState();
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

function recalcRole(role) {
  COMPONENTS[role].forEach(comp => calcComp(comp));
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

  document.getElementById("menuPage").style.display = "none";
  document.getElementById("calculatorPage").style.display = "none";
  document.getElementById("resultsPage").style.display = "block";
  history.pushState({ page: 'results' }, '', '');
  document.getElementById("resultsPage").scrollIntoView({ behavior: "smooth" });
}

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
  document.getElementById("resultsPage").style.display = "none";
  SCALE.forEach(s => {
    const row = document.getElementById(s.rowId);
    if (row) row.classList.remove("active-grade");
  });
  sessionStorage.removeItem('fypFormState');
}

// Build tables on page load
buildTable("adv_tbody",  COMPONENTS.advisor);
buildTable("read_tbody", COMPONENTS.reader);
