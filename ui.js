const UI = {

render() {

const keyword =
document.getElementById('keyword').value || '';

const blade =
document.getElementById('bladeSelect').value || '';

const ratchet =
document.getElementById('ratchetSelect').value || '';

const bit =
document.getElementById('bitSelect').value || '';

const rows = Analysis.filter({
keyword,
blade,
ratchet,
bit
});

document.getElementById('recordCount').textContent =
rows.length + ' 筆';

this.renderFilters();
this.renderResults(rows);

},

renderFilters() {

const allRows = Analysis.data;

const blades =
[...new Set(allRows.map(r=>r.上蓋).filter(Boolean))].sort();

const ratchets =
[...new Set(allRows.map(r=>r.固鎖).filter(Boolean))].sort();

const bits =
[...new Set(allRows.map(r=>r.軸).filter(Boolean))].sort();

const fill = (id,list,label)=>{

const sel=document.getElementById(id);

const current=sel.value;

sel.innerHTML=
`<option value="">全部${label}</option>`+
list.map(v=>`<option value="${v}">${v}</option>`).join('');

sel.value=current;

};

fill('bladeSelect',blades,'上蓋');
fill('ratchetSelect',ratchets,'固鎖');
fill('bitSelect',bits,'軸心');

},

renderResults(rows){

const result=document.getElementById('resultList');

result.innerHTML=rows.map(r=>`
<div class="result-item">
${r.上蓋} ${r.固鎖} ${r.軸}
${r.英文 ? '('+r.英文+')' : ''}
${r.名次 ? ' - '+r.名次 : ''}
</div>
`).join('');

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

document.getElementById('keyword').value='';
document.getElementById('bladeSelect').value='';
document.getElementById('ratchetSelect').value='';
document.getElementById('bitSelect').value='';

UI.render();

});

});
