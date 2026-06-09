let allData = [];
let selectedPlace = "";

const bladeSelect = document.getElementById("bladeSelect");
const ratchetSelect = document.getElementById("ratchetSelect");
const bitSelect = document.getElementById("bitSelect");
const recordCount = document.getElementById("recordCount");

const clearBlade = document.getElementById("clearBlade");
const clearRatchet = document.getElementById("clearRatchet");
const clearBit = document.getElementById("clearBit");
const clearAllButton = document.getElementById("clearAllButton");

fetch("combos.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    Analysis.init(data);

    initFilters();
    bindEvents();
    render();
  });

function initFilters() {
  fillBladeSelect();
  fillRatchetSelect();
  fillBitSelect();
}

function fillBladeSelect() {
  bladeSelect.innerHTML = `<option value="">全部上蓋</option>`;

  const ranking = Analysis.countBy(allData.map(item => {
    return {
      上蓋: item.上蓋 && item.上蓋.trim()
        ? item.上蓋
        : `【待釐正】(${item.英文})`
    };
  }), "上蓋");

  ranking.forEach(([name, count]) => {
    bladeSelect.innerHTML += `
      <option value="${name}">
        ${name} (${count})
      </option>
    `;
  });
}

function fillRatchetSelect() {
  ratchetSelect.innerHTML = `<option value="">全部固鎖</option>`;

  const ranking = Analysis.getRatchetRanking(allData);

  ranking.forEach(([name]) => {
    ratchetSelect.innerHTML += `
      <option value="${name}">
        ${name}
      </option>
    `;
  });
}

function fillBitSelect() {
  bitSelect.innerHTML = `<option value="">全部軸心</option>`;

  const ranking = Analysis.getBitRanking(allData);

  ranking.forEach(([name, count]) => {
    bitSelect.innerHTML += `
      <option value="${name}">
        ${name} (${count})
      </option>
    `;
  });
}

function bindEvents() {
  bladeSelect.addEventListener("change", render);
  ratchetSelect.addEventListener("change", render);
  bitSelect.addEventListener("change", render);

  clearBlade.addEventListener("click", () => {
    bladeSelect.value = "";
    render();
  });

  clearRatchet.addEventListener("click", () => {
    ratchetSelect.value = "";
    render();
  });

  clearBit.addEventListener("click", () => {
    bitSelect.value = "";
    render();
  });

  clearAllButton.addEventListener("click", () => {
    bladeSelect.value = "";
    ratchetSelect.value = "";
    bitSelect.value = "";
    selectedPlace = "";

    document.querySelectorAll(".place-btn")
      .forEach(btn => btn.classList.remove("active"));

    const allBtn = document.querySelector('.place-btn[data-place=""]');
    if (allBtn) allBtn.classList.add("active");

    render();
  });

  document.querySelectorAll(".place-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".place-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      selectedPlace = btn.dataset.place || "";

      render();
    });
  });
}

function render() {
  const rows = Analysis.filter({
    blade: bladeSelect.value,
    ratchet: ratchetSelect.value,
    bit: bitSelect.value,
    place: selectedPlace
  });

  recordCount.textContent = `${rows.length} 筆`;

  renderTopCombos(rows);
  renderRanking(rows);
  renderResults(rows);
}

function renderTopCombos(rows) {
  const topCombos = document.getElementById("topCombos");
  const combos = Analysis.getTopCombos(rows, 3);

  if (!combos.length) {
    topCombos.innerHTML = `<div class="empty">沒有資料</div>`;
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];

  topCombos.innerHTML = combos.map((combo, index) => `
    <div class="top-combo-row">
      <span>${medals[index]}</span>
      <span>${combo.blade}</span>
      <span class="combo-code">${combo.ratchet}${combo.bit}</span>
      <span>${combo.count} 次</span>
    </div>
  `).join("");
}

function renderRanking(rows) {
  renderSmallRanking(
    "bladeRanking",
    Analysis.getBladeRanking(rows),
    rows.length
  );

  renderSmallRanking(
    "ratchetRanking",
    Analysis.getRatchetRanking(rows),
    rows.length
  );

  renderSmallRanking(
    "bitRanking",
    Analysis.getBitRanking(rows),
    rows.length
  );
}

function renderSmallRanking(id, ranking, total) {
  const el = document.getElementById(id);

  if (!ranking.length) {
    el.innerHTML = `<div class="empty">無</div>`;
    return;
  }

  el.innerHTML = ranking.slice(0, 3).map(([name, count], index) => {
    const percent = total ? Math.round((count / total) * 100) : 0;

    return `
      <div class="ranking-row">
        <span>${index + 1}. ${name}</span>
        <span>${percent}%</span>
      </div>
    `;
  }).join("");
}

function renderResults(rows) {
  const resultList = document.getElementById("resultList");

  if (!rows.length) {
    resultList.innerHTML = `<div class="empty">沒有符合條件的賽果</div>`;
    return;
  }

  resultList.innerHTML = rows.map(item => {
    const blade =
      item.上蓋 && item.上蓋.trim()
        ? item.上蓋
        : `【待釐正】(${item.英文})`;

    const place =
      item.名次 === "1st"
        ? "🏆"
        : item.名次 || "";

    const date = formatDate(item.日期);

    return `
      <div class="result-row">
        <span class="place">${place}</span>
        <span class="blade-name">${blade}</span>
        <span class="combo-code">${item.固鎖}${item.軸}</span>
        <span class="date">${date}</span>
      </div>
    `;
  }).join("");
}

function formatDate(date) {
  if (!date) return "";

  const parts = date.split("/");
  if (parts.length < 3) return date;

  const month = parts[1].padStart(2, "0");
  const day = parts[2].padStart(2, "0");

  return `${month}/${day}`;
}
