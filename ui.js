const UI = {

render() {

this.renderFilters();

const rows = Analysis.filter({
keyword: document.getElementById('keyword').value,
blade: document.getElementById('bladeSelect').value,
ratchet: document.getElementById('ratchetSelect').value,
bit: document.getElementById('bitSelect').value
});

document.getElementById('recordCount').textContent =
`${rows.length} 筆`;

this.renderSummary(rows);
this.renderTopCombos(rows);
this.renderRankings(rows);
this.renderResults(rows);

},

renderFilters() {

const fillSelect = (id,key,label)=>{

```
const sel = document.getElementById(id);

if(sel.dataset.loaded) return;

const values =
  [...new Set(
    Analysis.data
      .map(r=>r[key])
      .filter(Boolean)
  )]
  .sort();

sel.innerHTML =
  `<option value="">全部${label}</option>` +
  values.map(v =>
    `<option value="${v}">${v}</option>`
  ).join('');

sel.dataset.loaded = '1';
```

};

fillSelect('bladeSelect','上蓋','上蓋');
fillSelect('ratchetSelect','固鎖','固鎖');
fillSelect('bitSelect','軸','軸心');

},

renderSummary(rows){

const total = rows.length || 1;

const bladeTop =
Analysis.countBy(rows,'上蓋').slice(0,3);

const ratchetTop =
Analysis.countBy(rows,'固鎖').slice(0,3);

const bitTop =
Analysis.countBy(rows,'軸').slice(0,3);

const makeList = arr =>
arr.map(([k,v],i)=>
`<div>${i+1}. ${k} (${(v/total*100).toFixed(1)}%)</div>`
).join('');

document.getElementById('summaryContent').innerHTML = `

  <div style="
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:20px;
  ">
      <div>
        <b>最熱門上蓋</b>
        ${makeList(bladeTop)}
      </div>

```
  <div>
    <b>最熱門固鎖</b>
    ${makeList(ratchetTop)}
  </div>

  <div>
    <b>最熱門軸心</b>
    ${makeList(bitTop)}
  </div>
```

  </div>
  `;

},

renderTopCombos(rows){

const combos = {};

rows.forEach(r=>{

```
const combo =
  `${r.上蓋} ${r.固鎖} ${r.軸}`;

combos[combo] =
  (combos[combo] || 0) + 1;
```

});

const html =
Object.entries(combos)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)
.map(([k,v],i)=>
`<div style="padding:4px 0">
          ${i+1}. ${k}           <span style="float:right">
            ${v} 次得獎           </span>         </div>`
)
.join('');

document.getElementById('topCombos').innerHTML =
html || '無資料';

},

renderRankings(rows){

const renderList = (target,key)=>{

```
const total = rows.length || 1;

const html =
  Analysis.countBy(rows,key)
  .slice(0,10)
  .map(([name,count])=>{

    const pct =
      (count/total*100).toFixed(1);

    return `
    <div style="margin-bottom:8px">
      <div style="
        display:flex;
        justify-content:space-between;
      ">
        <span>${name}</span>
        <span>${pct}%</span>
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

document.getElementById(target).innerHTML =
  html;
```

};

renderList('bladeRanking','上蓋');
renderList('ratchetRanking','固鎖');
renderList('bitRanking','軸');

},

renderResults(rows){

document.getElementById('resultList').innerHTML =
rows.map(r=>`

```
  <div style="
    padding:8px 0;
    border-bottom:1px solid #eee;
  ">

    <b>${r.上蓋}</b>

    ${r.固鎖}

    ${r.軸}

    ${r.英文
      ? `(${r.英文})`
      : ''}

    ${r.名次
      ? ` - ${r.名次}`
      : ''}

  </div>

`).join('');
```

}

};

window.addEventListener('DOMContentLoaded',()=>{

document.getElementById('keyword')
.addEventListener('input',()=>UI.render());

document.getElementById('bladeSelect')
.addEventListener('change',()=>UI.render());

document.getElementById('ratchetSelect')
.addEventListener('change',()=>UI.render());

document.getElementById('bitSelect')
.addEventListener('change',()=>UI.render());

document.getElementById('clearAllButton')
.addEventListener('click',()=>{

```
  document.getElementById('keyword').value='';
  document.getElementById('bladeSelect').value='';
  document.getElementById('ratchetSelect').value='';
  document.getElementById('bitSelect').value='';

  UI.render();

});
```

});
