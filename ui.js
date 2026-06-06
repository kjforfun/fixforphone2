const UI = {

render() {

  if (!Analysis.data.length) return;

  this.renderFilters();

  const rows = Analysis.filter({
    keyword: document.getElementById('keyword').value || '',
    blade: document.getElementById('bladeSelect').value || '',
    ratchet: document.getElementById('ratchetSelect').value || '',
    bit: document.getElementById('bitSelect').value || ''
  });

  document.getElementById('recordCount').textContent =
    `${rows.length} 筆`;

  this.renderTopCombos(rows);
  this.renderRankings(rows);
  this.renderResults(rows);
},



renderFilters() {

  一大堆程式...

  bladeSelect.value = currentBlade;
  ratchetSelect.value = currentRatchet;
  bitSelect.value = currentBit;

},





  
renderTopCombos(rows) {

  const map = {};

  rows.forEach(r => {

const bladeName =
  r.上蓋 && r.上蓋.trim()
    ? r.上蓋
    : `【未翻譯】${r.英文 || ''}`;

const key =
  `${bladeName} ${r.固鎖}${r.軸}`;
    map[key] = (map[key] || 0) + 1;

  });

  const html =
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([combo, count], idx) => {

        const parts = combo.split(' ');
        const blade = parts[0];
        const setup = parts.slice(1).join(' ');

        return `
          <div style="
            padding:2px 0;
            font-size:14px;
            text-align:right;
          ">
            ${idx + 1}.
            <span style="
              color:#d32f2f;
              font-weight:bold;
            ">
              ${blade}
            </span>
            ${setup}
            (${count}次)
          </div>
        `;
      })
      .join('');

  document.getElementById('topCombos').innerHTML =
    html || '無資料';
},

renderRankings(rows) {

  const renderRanking = (target, key) => {

    const total = rows.length || 1;

    const html =
      Analysis.countBy(rows, key)
        .slice(0, 3)
        .map(([name, count]) => {

          const pct =
            (count / total * 100).toFixed(1);

          return `
            <div style="margin-bottom:8px">

              <div style="
                display:flex;
                justify-content:center;
                gap:8px;
                margin-bottom:2px;
              ">
                <span style="
                  color:#0b3d91;
                  font-weight:bold;
                ">
                  ${name}
                </span>

                <span style="
                  color:#000;
                  font-size:12px;
                ">
                  ${pct}%
                </span>
              </div>

              <div style="
                background:#ddd;
                height:10px;
                border-radius:5px;
              ">
                <div style="
                  width:${pct}%;
                  background:#2e7d32;
                  height:10px;
                  border-radius:5px;
                "></div>
              </div>

            </div>
          `;
        })
        .join('');

    document.getElementById(target).innerHTML = html;
  };

  renderRanking('bladeRanking', '上蓋');
  renderRanking('ratchetRanking', '固鎖');
  renderRanking('bitRanking', '軸');
},

renderResults(rows) {

  document.getElementById('resultList').innerHTML =
    rows.map(r => `

      <div style="
        display:grid;
        grid-template-columns:1fr 120px 1fr;
        align-items:center;
        padding:6px 0;
        border-bottom:1px solid #eee;
      ">

        <div style="
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          font-size:14px;
        ">
         ${
  r.上蓋 && r.上蓋.trim()
    ? r.上蓋
    : `【未翻譯】${r.英文 || ''}`
}
        </div>

        <div style="
          display:flex;
          justify-content:center;
          align-items:center;
          font-weight:bold;
          color:#0b3d91;
          text-align:center;
        ">
          ${r.固鎖}${r.軸}
        </div>

        <div style="
          text-align:center;
        ">
          ${
            String(r.名次 || '')
              .toUpperCase()
              .includes('1ST')
              ? '🏆'
              : (r.名次 || '')
          }
        </div>

      </div>

    `).join('');
}

};

window.addEventListener('DOMContentLoaded', () => {

  document.getElementById('keyword')
    .addEventListener('input', () => UI.render());

  document.getElementById('bladeSelect')
    .addEventListener('change', () => UI.render());

  document.getElementById('ratchetSelect')
    .addEventListener('change', () => UI.render());

  document.getElementById('bitSelect')
    .addEventListener('change', () => UI.render());

  document.getElementById('clearBlade')
    .addEventListener('click', () => {

      document.getElementById('bladeSelect').value = '';
      UI.render();

    });

  document.getElementById('clearRatchet')
    .addEventListener('click', () => {

      document.getElementById('ratchetSelect').value = '';
      UI.render();

    });

  document.getElementById('clearBit')
    .addEventListener('click', () => {

      document.getElementById('bitSelect').value = '';
      UI.render();

    });

  document.getElementById('clearAllButton')
    .addEventListener('click', () => {

      document.getElementById('keyword').value = '';
      document.getElementById('bladeSelect').value = '';
      document.getElementById('ratchetSelect').value = '';
      document.getElementById('bitSelect').value = '';

      UI.render();

    });

});

document.addEventListener('dataLoaded', () => {
  UI.render();
});
