fetch('combos.json')
.then(r=>r.json())
.then(data=>{
Analysis.init(data);
UI.render();
});