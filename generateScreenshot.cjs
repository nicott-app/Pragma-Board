const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sprinto Mock</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f5f8; margin: 0; padding: 0; overflow: hidden; }
    .material-symbols-outlined { font-size: 18px; }
    .card-shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .col-header { border-top-width: 3px; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="w-[1440px] h-[800px] flex flex-col">
  
  <!-- Topbar -->
  <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded bg-emerald-500 transform rotate-45"></div>
        <span class="font-bold text-xl text-slate-800 tracking-tight">Sprinto</span>
      </div>
      <div class="h-6 w-px bg-gray-300"></div>
      <button class="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded-md text-sm font-medium text-slate-700">
        Proyecto DEMO
        <span class="material-symbols-outlined text-[16px]">expand_more</span>
      </button>
      <div class="relative ml-2">
        <span class="material-symbols-outlined absolute left-3 top-2 text-gray-400">search</span>
        <input type="text" placeholder="Buscar tickets..." class="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <div class="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
        <button class="p-1 bg-white shadow-sm rounded-md"><span class="material-symbols-outlined text-gray-700">view_kanban</span></button>
        <button class="p-1 rounded-md hover:bg-gray-200"><span class="material-symbols-outlined text-gray-500">format_list_bulleted</span></button>
      </div>
      <div class="h-6 w-px bg-gray-300 mx-1"></div>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">bar_chart</span></button>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">account_tree</span></button>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">inventory_2</span></button>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">analytics</span></button>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">help</span></button>
      <button class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"><span class="material-symbols-outlined">settings</span></button>
      <div class="w-10 h-5 bg-indigo-100 rounded-full flex items-center p-0.5 relative ml-2">
        <div class="w-4 h-4 bg-indigo-600 rounded-full text-white flex items-center justify-center absolute right-0.5"><span class="material-symbols-outlined text-[12px]">dark_mode</span></div>
      </div>
      <div class="flex items-center gap-2 ml-2">
        <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">N</div>
        <button class="flex items-center gap-1 text-sm font-medium text-gray-700"><span class="material-symbols-outlined">group</span> Usuarios</button>
        <button class="flex items-center gap-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md ml-2">Salir <span class="material-symbols-outlined text-[16px]">logout</span></button>
      </div>
    </div>
  </div>

  <!-- Subbar -->
  <div class="h-12 bg-[#f4f5f8] flex items-center px-6 border-b border-gray-200 shrink-0 gap-6">
    <button class="flex items-center gap-1 text-sm font-semibold text-indigo-600"><span class="material-symbols-outlined text-[18px]">search</span> Filtros avanzados</button>
    <div class="flex items-center gap-2 text-sm text-gray-500 font-medium">
      AGRUPAR POR 
      <button class="flex items-center gap-1 text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">Ninguno <span class="material-symbols-outlined text-[16px]">expand_more</span></button>
    </div>
  </div>

  <!-- Board -->
  <div class="flex-1 overflow-x-auto p-6 flex gap-4 scrollbar-hide items-start">
    
    <!-- Column: BACKLOG -->
    <div class="w-[300px] shrink-0 flex flex-col gap-3">
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 col-header border-t-gray-400 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-gray-700 text-sm">
          <span class="material-symbols-outlined text-[16px] text-gray-400">filter_list</span> BACKLOG
        </div>
        <div class="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">1 / 8</div>
      </div>
      
      <!-- Ticket Backlog 1 -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 border-l-4 border-l-gray-400">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium">TASK-001</span>
          <span class="material-symbols-outlined text-[16px] text-gray-300">delete</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 mb-2">Diseñar nueva landing page</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">edit</span> TAREA</span>
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div> 4 H</span>
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="flex gap-1 text-[11px] text-gray-400 font-medium items-center">
            <span class="material-symbols-outlined text-[14px]">chat_bubble</span> 0
          </div>
          <div class="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">N</div>
        </div>
      </div>
    </div>

    <!-- Column: EN PROGRESO -->
    <div class="w-[300px] shrink-0 flex flex-col gap-3">
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 col-header border-t-blue-500 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-blue-700 text-sm">
          <span class="material-symbols-outlined text-[16px] text-blue-500">play_circle</span> EN PROGRESO
        </div>
        <div class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 / 5</div>
      </div>

      <!-- Ticket Progreso 1 -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 border-l-4 border-l-blue-500">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium">TASK-002</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 mb-2">Implementar sistema de login con Google</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">trending_up</span> MEJORA</span>
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 8 H</span>
          <span class="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">calendar_today</span> 18/9/2026</span>
        </div>
        <div class="flex items-center gap-1 mb-3">
          <span class="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">warning</span> SIN AVANCE</span>
        </div>
        <div class="flex items-center gap-1 flex-wrap mb-2">
          <span class="text-[9px] text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">Frontend</span>
          <span class="text-[9px] text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">Auth</span>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div class="flex gap-2 text-[11px] text-gray-400 font-medium items-center">
            <span class="flex items-center gap-0.5 text-indigo-500"><span class="material-symbols-outlined text-[14px]">auto_awesome</span> IA</span>
          </div>
          <div class="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-[10px]">NI</div>
        </div>
      </div>

      <!-- Ticket Progreso 2 -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 border-l-4 border-l-blue-500">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium">TASK-003</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 mb-2">Error en el carrito de compras</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">code</span> DESARROLLO</span>
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 12 H</span>
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="w-full bg-gray-200 rounded-full h-1.5 mb-1">
            <div class="bg-blue-500 h-1.5 rounded-full" style="width: 45%"></div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="text-[10px] font-medium text-gray-500">45% completado</div>
          <div class="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">NT</div>
        </div>
      </div>
    </div>

    <!-- Column: BLOQUEADO -->
    <div class="w-[300px] shrink-0 flex flex-col gap-3">
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 col-header border-t-red-500 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-red-600 text-sm">
          <span class="material-symbols-outlined text-[16px] text-red-500">block</span> BLOQUEADO
        </div>
        <div class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">1 / 4</div>
      </div>

      <!-- Ticket Bloqueado -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-red-200 border-l-4 border-l-red-500 bg-red-50/30">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium">TASK-004</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 mb-2">Migración de base de datos a PostgreSQL</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">bug_report</span> BUG</span>
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> 2 H</span>
        </div>
        <p class="text-[11px] text-red-600 font-medium mb-2 leading-tight">Falta validación de QA en entorno Staging.</p>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-red-100">
          <div class="flex gap-2 text-[11px] text-gray-400 font-medium items-center">
            <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">chat</span> 3</span>
          </div>
          <div class="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-[10px]">--</div>
        </div>
      </div>
    </div>

    <!-- Column: EN REVISIÓN -->
    <div class="w-[300px] shrink-0 flex flex-col gap-3">
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 col-header border-t-amber-400 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-amber-600 text-sm">
          <span class="material-symbols-outlined text-[16px] text-amber-500">search</span> EN REVISIÓN
        </div>
        <div class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">1 / 5</div>
      </div>

      <!-- Ticket Revisión -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-amber-200 border-l-4 border-l-amber-400">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium">TASK-005</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-800 mb-2">Optimización de tiempos de carga</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">code</span> DESARROLLO</span>
          <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 8 H</span>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div class="flex gap-2 text-[11px] text-gray-400 font-medium items-center">
            <span class="flex items-center gap-0.5 text-blue-500"><span class="material-symbols-outlined text-[14px]">checklist</span> 6/6</span>
            <span class="flex items-center gap-0.5 text-indigo-500"><span class="material-symbols-outlined text-[14px]">auto_awesome</span> IA</span>
          </div>
          <div class="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-[10px]">NI</div>
        </div>
      </div>
    </div>

    <!-- Column: HECHO -->
    <div class="w-[300px] shrink-0 flex flex-col gap-3">
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 col-header border-t-emerald-500 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-emerald-600 text-sm">
          <span class="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span> HECHO
        </div>
        <div class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">92</div>
      </div>

      <!-- Ticket Hecho 1 -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 border-l-4 border-l-emerald-500 opacity-70">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium line-through">TASK-006</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-500 line-through mb-2">Actualizar dependencias de React</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">bug_report</span> BUG</span>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div class="flex gap-2 text-[11px] text-gray-400 font-medium items-center">
            <span class="flex items-center gap-0.5 text-emerald-500"><span class="material-symbols-outlined text-[14px]">check</span> Listo</span>
          </div>
          <div class="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-[10px]">NI</div>
        </div>
      </div>
      
      <!-- Ticket Hecho 2 -->
      <div class="bg-white rounded-xl card-shadow p-3 border border-gray-200 border-l-4 border-l-emerald-500 opacity-70">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[11px] text-gray-400 font-medium line-through">TASK-007</span>
        </div>
        <h4 class="text-sm font-semibold text-gray-500 line-through mb-2">Redactar documentación de la API</h4>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">inventory_2</span> ENTREGABLE</span>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div class="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-[10px]">NI</div>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'mock.html'), htmlContent);

(async () => {
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // High res screenshot setup
  await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'mock.html'), { waitUntil: 'networkidle0' });
  
  // Give it a tiny bit of time to ensure fonts load
  await new Promise(r => setTimeout(r, 1000));

  console.log("Taking screenshot...");
  await page.screenshot({ path: path.join(__dirname, 'public', 'captura-app-v2.png') });
  
  await browser.close();
  fs.unlinkSync(path.join(__dirname, 'mock.html'));
  console.log("Screenshot generated at public/captura-app-v2.png!");
})();
