const baseModules = [
  {id:'ia-civil', titulo:'IA educativa para Ingeniería Civil', duracion:'10 min', progreso:80, desc:'Uso pedagógico de IA para planificar, explicar y evaluar aprendizajes en Ingeniería Civil.', videos:[
    {nombre:'What is Artificial Intelligence?', url:'https://www.youtube.com/watch?v=ad79nYk2keg'},
    {nombre:'AI in Education', url:'https://www.youtube.com/watch?v=KYE5mD5s6VQ'}
  ]},
  {id:'prompts', titulo:'Prompts para diseño de actividades', duracion:'11 min', progreso:65, desc:'Diseño de instrucciones claras para generar actividades, casos y ejercicios aplicados.', videos:[
    {nombre:'Prompt Engineering Tutorial', url:'https://www.youtube.com/watch?v=_ZvnD73m40o'}
  ]},
  {id:'rubricas', titulo:'Evaluación auténtica con rúbricas', duracion:'12 min', progreso:40, desc:'Construcción de criterios, niveles de logro y evidencias aplicadas.', videos:[
    {nombre:'How to Create a Rubric', url:'https://www.youtube.com/watch?v=2vEldvPK6rc'}
  ]},
  {id:'suelos', titulo:'Simuladores para Mecánica de Suelos', duracion:'13 min', progreso:20, desc:'Uso de simuladores y casos para analizar comportamiento del suelo.', videos:[
    {nombre:'Soil Mechanics Introduction', url:'https://www.youtube.com/watch?v=Q2GZC6-qf78'}
  ]},
  {id:'retroalimentacion', titulo:'Retroalimentación asistida por IA', duracion:'14 min', progreso:15, desc:'Estrategias para ofrecer comentarios claros, oportunos y formativos.', videos:[
    {nombre:'Effective Feedback for Learning', url:'https://www.youtube.com/watch?v=Huju0xwNFKU'}
  ]},
  {id:'casos', titulo:'Diseño de casos aplicados', duracion:'15 min', progreso:0, desc:'Creación de escenarios contextualizados para cursos de Ingeniería Civil.', videos:[
    {nombre:'Case Based Learning', url:'https://www.youtube.com/watch?v=YvHhJg8nUqY'}
  ]}
];

let modules = cargarModulos();

function cargarModulos(){
  const saved = localStorage.getItem('microAcademiaModules');
  return saved ? JSON.parse(saved) : baseModules;
}
function guardarModulos(){localStorage.setItem('microAcademiaModules', JSON.stringify(modules));}
function youtubeEmbed(url){
  try{
    const u = new URL(url);
    let id = '';
    if(u.hostname.includes('youtu.be')) id = u.pathname.slice(1);
    else if(u.searchParams.get('v')) id = u.searchParams.get('v');
    else if(u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }catch(e){return url;}
}
function renderModules(){
  const cards = document.getElementById('moduleCards');
  cards.innerHTML = modules.map(m=>`
    <article class="card">
      <div>
        <span class="duration">${m.duracion}</span>
        <h3>${m.titulo}</h3>
        <p>${m.desc}</p>
        <div class="bar"><span style="width:${m.progreso}%"></span></div>
        <div class="percent">${m.progreso}% completado</div>
      </div>
      <button class="btn ghost" onclick="abrirModulo('${m.id}')">Abrir módulo</button>
    </article>`).join('');
  poblarSelects();
}
function abrirModulo(id){
  const m = modules.find(x=>x.id===id);
  document.getElementById('tituloModulo').textContent = m.titulo;
  document.getElementById('descripcionModulo').textContent = m.desc;
  const cont = document.getElementById('listaVideos');
  if(!m.videos.length){cont.innerHTML='<div class="empty">Este módulo aún no tiene videos. Añádelos desde el gestor.</div>'}
  else{
    cont.innerHTML = m.videos.map(v=>`
      <div class="video-card">
        <iframe src="${youtubeEmbed(v.url)}" title="${v.nombre}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h3>${v.nombre}</h3>
      </div>`).join('');
  }
  document.getElementById('modalVideos').style.display='flex';
}
function cerrarModulo(){document.getElementById('modalVideos').style.display='none';document.getElementById('listaVideos').innerHTML='';}
function poblarSelects(){
  ['adminModulo','adminModuloModal'].forEach(id=>{
    const sel=document.getElementById(id); if(!sel) return;
    sel.innerHTML = modules.map(m=>`<option value="${m.id}">${m.titulo}</option>`).join('');
  });
}
function agregarVideo(){
  const id=document.getElementById('adminModulo').value;
  const nombre=document.getElementById('videoTitulo').value.trim();
  const url=document.getElementById('videoUrl').value.trim();
  if(!nombre || !url){alert('Completa el título y la URL.');return;}
  modules.find(m=>m.id===id).videos.push({nombre,url});
  guardarModulos(); renderModules();
  document.getElementById('videoTitulo').value=''; document.getElementById('videoUrl').value='';
  alert('Video añadido al módulo.');
}
function abrirGestorVideos(){document.getElementById('modalAdmin').style.display='flex';poblarSelects();}
function cerrarGestorVideos(){document.getElementById('modalAdmin').style.display='none';}
function agregarVideoDesdeModal(){
  const id=document.getElementById('adminModuloModal').value;
  const nombre=document.getElementById('videoTituloModal').value.trim();
  const url=document.getElementById('videoUrlModal').value.trim();
  if(!nombre || !url){alert('Completa el título y la URL.');return;}
  modules.find(m=>m.id===id).videos.push({nombre,url});
  guardarModulos(); renderModules();
  document.getElementById('videoTituloModal').value=''; document.getElementById('videoUrlModal').value='';
  alert('Video añadido correctamente.');
}
function descargarGuia(){
  const unidad=document.getElementById('unidad').value;
  const contenido=`Guía de integración curricular\n\nMicro-Academia\nUnidad: ${unidad}\n\nObjetivo: aplicar IA educativa en una actividad de Ingeniería Civil.\n\nEvidencia: producto breve, rúbrica y reflexión docente.`;
  const blob=new Blob([contenido],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='guia-integracion-micro-academia.txt';a.click();
}
document.getElementById('diagnosticForm').addEventListener('submit',e=>{
  e.preventDefault();
  const nivel=document.getElementById('nivel').value;
  const curso=document.getElementById('curso').value;
  const objetivo=document.getElementById('objetivo').value;
  const result=document.getElementById('routeResult');
  result.classList.remove('hidden');
  result.innerHTML=`<strong>Ruta generada:</strong> Para nivel ${nivel}, en el curso ${curso}, se recomienda iniciar con “IA educativa para Ingeniería Civil”, continuar con “Prompts para diseño de actividades” y cerrar con “${objetivo}”.`;
});
document.getElementById('themeBtn').addEventListener('click',()=>{
  document.body.classList.toggle('light');
  document.getElementById('themeBtn').textContent=document.body.classList.contains('light')?'Modo oscuro':'Modo claro';
});
renderModules();
