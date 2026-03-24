
let medicines = JSON.parse(localStorage.getItem('medicines'))||[];

function saveData(){ localStorage.setItem('medicines', JSON.stringify(medicines)); }

const navButtons = document.querySelectorAll('.nav button');
const viewTitle = document.getElementById('view-title');
const viewContainer = document.getElementById('view-container');
const templates = {};
document.querySelectorAll('template').forEach(t=>templates[t.id.replace('tpl-','')]=t);

function setActiveView(view){
  navButtons.forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
  renderView(view);
}

navButtons.forEach(b=>b.addEventListener('click', ()=> setActiveView(b.dataset.view)));

function renderView(view){
  viewContainer.innerHTML='';
  const tpl=templates[view];
  if(!tpl){ viewContainer.textContent='Not Available'; return; }
  viewContainer.appendChild(tpl.content.cloneNode(true));
  if(view==='dashboard') renderDashboard();
  if(view==='add') bindAdd();
  if(view==='update') bindUpdate();
  if(view==='delete') bindDelete();
  if(view==='list') bindList();
}

// Dashboard
function renderDashboard(){
  document.getElementById('stat-total').textContent = medicines.length;
  const totalStock = medicines.reduce((sum,m)=>sum+(m.qty||0),0);
  document.getElementById('stat-stock').textContent = totalStock;

  const ctx=document.getElementById('stockChart').getContext('2d');
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:medicines.map(m=>m.mid),
      datasets:[{label:'Stock Quantity',data:medicines.map(m=>m.qty),backgroundColor:medicines.map(()=> 'rgba(40,167,69,0.7)')}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
  });
}

// Add Medicine
function bindAdd(){
  const form=document.getElementById('addForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.name.value.trim();
    const mid=form.mid.value.trim();
    const qty=parseInt(form.qty.value);
    const expiry=form.expiry.value;
    if(medicines.find(m=>m.mid==mid)){ alert('Medicine ID already exists'); return;}
    medicines.push({name,mid,qty,expiry});
    saveData(); alert('Medicine added'); form.reset(); renderDashboard();
  });
}

// Update Medicine
function bindUpdate(){
  const form=document.getElementById('updateForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const mid=form.mid.value.trim();
    const med=medicines.find(m=>m.mid==mid);
    if(!med){ alert('Medicine not found'); return;}
    if(form.name.value.trim()) med.name=form.name.value.trim();
    if(form.qty.value) med.qty=parseInt(form.qty.value);
    if(form.expiry.value) med.expiry=form.expiry.value;
    saveData(); alert('Medicine updated'); form.reset(); renderDashboard();
  });
}

// Delete Medicine
function bindDelete(){
  const form=document.getElementById('deleteForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const mid=form.mid.value.trim();
    const index=medicines.findIndex(m=>m.mid==mid);
    if(index===-1){ alert('Medicine not found'); return;}
    medicines.splice(index,1);
    saveData(); alert('Medicine deleted'); renderDashboard();
  });
}

// List Medicines
function bindList(){
  const tbody=document.getElementById('medTable');
  const searchInput=document.getElementById('searchMed');
  function renderList(){
    tbody.innerHTML='';
    const filter = searchInput.value.toLowerCase();
    medicines.filter(m=>m.mid.includes(filter)||m.name.toLowerCase().includes(filter)).forEach(m=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${m.name}</td><td>${m.mid}</td><td>${m.qty}</td><td>${m.expiry}</td>`;
      tbody.appendChild(tr);
    });
  }
  searchInput.addEventListener('input', renderList);
  renderList();
}

setActiveView('dashboard');