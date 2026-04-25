/* =====================================================
   Sistema de Diseño Integrado de Circuitos v3.0
   GA7-220501096-AA3-EV01 — Módulo JS Global (app.js)
   Autor: Michael Ronald Olivares Giraldo
   SENA Ficha 3118306 — Marzo 2026
   Estándar: GA7-220501096-AA1-EV02
   ===================================================== */
'use strict';

// ── 1. Estado Global de Sesión ─────────────────────────────
/** @type {Object|null} Usuario actualmente autenticado */
let currentUser = null;

/**
 * Usuarios de demostración del sistema (simulan BD).
 * En producción este hash se valida en el backend.
 * Datos derivados de la tabla 'usuario' del script SQL.
 */
const DEMO_USERS = [
  {
    id: 1,
    nombre: 'Michael Olivares',
    email: 'michael.olivares@sena.edu.co',
    password: 'admin123',
    rol: 'administrador',
    nivel_acceso: 'total',
    estado: 'activo',
    initials: 'MO'
  }
];

// ── 2. Datos del Sistema (simulan respuestas de API) ───────
/** Proyectos — tabla 'proyecto' */
const DB_PROYECTOS = [
  {
    id: 1,
    nombre: 'Tarjeta de Control de Motor BLDC',
    descripcion: 'Diseño de PCB para control vectorial de motor BLDC trifásico con STM32F4 y FPGA Artix-7',
    tipo_circuito: 'mixto',
    estado: 'activo',
    version_actual: '1.3.0',
    id_usuario_creador: 1,
    creador: 'Michael Olivares',
    fecha_creacion: '2026-01-10',
    disenios: 2,
    simulaciones: 3,
    pruebas: 3,
    estandares: ['IPC-A-610', 'IPC-2221', 'IEC 61000']
  },
  {
    id: 2,
    nombre: 'Módulo IoT LoRaWAN para Medición Industrial',
    descripcion: 'Dispositivo de adquisición de datos con comunicación LoRaWAN para industria 4.0',
    tipo_circuito: 'microcontrolador',
    estado: 'activo',
    version_actual: '2.0.1',
    id_usuario_creador: 1,
    creador: 'Michael Olivares',
    fecha_creacion: '2025-11-05',
    disenios: 2,
    simulaciones: 2,
    pruebas: 2,
    estandares: ['IPC-A-610', 'IPC-2221', 'ISO 9001']
  },
  {
    id: 3,
    nombre: 'ASIC de Procesamiento de Señal Analógica',
    descripcion: 'Diseño de circuito integrado de aplicación específica para filtrado adaptativo',
    tipo_circuito: 'asic',
    estado: 'finalizado',
    version_actual: '3.1.0',
    id_usuario_creador: 1,
    creador: 'Michael Olivares',
    fecha_creacion: '2025-06-20',
    disenios: 1,
    simulaciones: 1,
    pruebas: 2,
    estandares: ['ISO 9001', 'MIL-STD-461']
  },
  {
    id: 4,
    nombre: 'Plataforma FPGA para Procesamiento de Imagen',
    descripcion: 'Implementación de algoritmos de visión artificial en Xilinx Artix-7',
    tipo_circuito: 'fpga',
    estado: 'activo',
    version_actual: '1.0.0',
    id_usuario_creador: 1,
    creador: 'Michael Olivares',
    fecha_creacion: '2026-02-01',
    disenios: 1,
    simulaciones: 1,
    pruebas: 1,
    estandares: ['IPC-2221', 'IEC 61000']
  }
];

/** Diseños — tabla 'diseno' */
const DB_DISENIOS = [
  { id:1, nombre:'Esquemático Principal Motor BLDC', tipo:'esquematico', formato:'KiCad 7.0', estado:'aprobado', id_proyecto:1, creador:'Michael Olivares', fecha:'2026-01-15', version:'v1.3', versiones:4, cifrado:false },
  { id:2, nombre:'PCB Capa 4 Motor BLDC',            tipo:'pcb',          formato:'KiCad 7.0', estado:'revision',  id_proyecto:1, creador:'Michael Olivares',     fecha:'2026-01-28', version:'v1.0', versiones:1, cifrado:true  },
  { id:3, nombre:'Esquemático Módulo LoRaWAN',       tipo:'esquematico', formato:'Altium 23',  estado:'aprobado', id_proyecto:2, creador:'Michael Olivares',  fecha:'2025-12-10', version:'v2.0', versiones:2, cifrado:false },
  { id:4, nombre:'PCB Módulo LoRaWAN',               tipo:'pcb',          formato:'Altium 23',  estado:'aprobado', id_proyecto:2, creador:'Michael Olivares',     fecha:'2026-01-05', version:'v2.0', versiones:1, cifrado:true  },
  { id:5, nombre:'Layout ASIC Filtro Analógico',     tipo:'layout',       formato:'Cadence',    estado:'aprobado', id_proyecto:3, creador:'Michael Olivares',  fecha:'2025-10-30', version:'v3.1', versiones:1, cifrado:true  },
  { id:6, nombre:'Esquemático FPGA Visión',          tipo:'esquematico', formato:'Vivado',     estado:'borrador', id_proyecto:4, creador:'Michael Olivares',     fecha:'2026-02-10', version:'v1.0', versiones:1, cifrado:false }
];

/** Componentes — tabla 'componente' */
const DB_COMPONENTES = [
  { id:1, nombre:'STM32F407VGT6',          categoria:'Microcontrolador', fabricante:'STMicroelectronics', modelo:'STM32F407VGT6', precio:8.50,  disponibilidad:true,  footprint:'LQFP-100' },
  { id:2, nombre:'Resistencia 10kΩ 1%',    categoria:'Resistor',         fabricante:'Yageo',              modelo:'RC0402FR-0710KL',precio:0.01, disponibilidad:true,  footprint:'0402' },
  { id:3, nombre:'Capacitor 100nF 50V',    categoria:'Capacitor',        fabricante:'Murata',             modelo:'GRM155R71H104K', precio:0.05, disponibilidad:true,  footprint:'0402' },
  { id:4, nombre:'LM7805 Regulador 5V',    categoria:'Regulador',        fabricante:'Texas Instruments',  modelo:'LM7805CT',       precio:0.65, disponibilidad:true,  footprint:'TO-220' },
  { id:5, nombre:'LM358N Op-Amp Dual',     categoria:'Amplificador',     fabricante:'Texas Instruments',  modelo:'LM358N',         precio:0.28, disponibilidad:true,  footprint:'DIP-8' },
  { id:6, nombre:'Artix-7 FPGA XC7A35T',  categoria:'FPGA',             fabricante:'Xilinx',             modelo:'XC7A35T-1CPG236C',precio:18.90,disponibilidad:false, footprint:'CPG236' },
  { id:7, nombre:'Crystal 8MHz HC-49S',    categoria:'Cristal',          fabricante:'Abracon',            modelo:'ABL-8.000MHZ',   precio:0.30, disponibilidad:true,  footprint:'HC-49S' },
  { id:8, nombre:'BC547 NPN Transistor',   categoria:'Transistor',       fabricante:'Fairchild',          modelo:'BC547B',         precio:0.04, disponibilidad:true,  footprint:'TO-92' }
];

/** Simulaciones — tabla 'simulacion' */
const DB_SIMULACIONES = [
  { id:1, tipo:'analogica',  estado:'completada', duracion:145, cumple:true,  id_diseno:1, metricas:'THD: 1.2%, Eficiencia: 94.5%' },
  { id:2, tipo:'digital',    estado:'completada', duracion:320, cumple:true,  id_diseno:1, metricas:'Freq máx: 168MHz, Propagación: 5.2ns' },
  { id:3, tipo:'mixta',      estado:'completada', duracion:860, cumple:true,  id_diseno:2, metricas:'Temp máx: 72°C en U1' },
  { id:4, tipo:'analogica',  estado:'completada', duracion:95,  cumple:true,  id_diseno:3, metricas:'Ganancia: 42.3dB, BW: 500kHz' },
  { id:5, tipo:'termica',    estado:'completada', duracion:420, cumple:true,  id_diseno:2, metricas:'Consumo activo: 245mW' },
  { id:6, tipo:'energetica', estado:'pendiente',  duracion:null,cumple:false, id_diseno:4, metricas:'Pendiente de ejecución' }
];

/** Proveedores — tabla 'proveedor' */
const DB_PROVEEDORES = [
  { id:1, nombre:'Mouser Electronics',    contacto:'sales@mouser.com',    calificacion:4.9, tiempo_entrega:3 },
  { id:2, nombre:'Digi-Key Electronics',  contacto:'orders@digikey.com',  calificacion:4.8, tiempo_entrega:4 },
  { id:3, nombre:'Arrow Electronics',     contacto:'info@arrow.com',       calificacion:4.5, tiempo_entrega:7 },
  { id:4, nombre:'Electronilab SAS',      contacto:'ventas@electronilab.co',calificacion:4.2,tiempo_entrega:2 }
];

// ── 3. Navegación ──────────────────────────────────────────
/**
 * Navega a otra página de la aplicación.
 * @param {string} url - Ruta relativa de la página destino.
 * @returns {void}
 */
function navigate(url) {
  window.location.href = url;
}

/**
 * Cierra la sesión del usuario y redirige al login.
 * @returns {void}
 */
function logout() {
  try {
    localStorage.removeItem('sdc_session');
    localStorage.removeItem('sdc_user');
  } catch (e) {
    console.error('Error al cerrar sesión:', e);
  }
  navigate('index.html');
}

// ── 4. Autenticación ───────────────────────────────────────
/**
 * Autentifica al usuario validando credenciales contra DEMO_USERS.
 * @param {string} email    - Correo electrónico ingresado.
 * @param {string} password - Contraseña en texto plano.
 * @returns {{ ok: boolean, user?: Object, error?: string }}
 */
function authenticate(email, password) {
  if (!validateEmail(email))    return { ok: false, error: 'Formato de correo inválido.' };
  if (!validateRequired(password)) return { ok: false, error: 'La contraseña es requerida.' };

  const found = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!found) return { ok: false, error: 'Credenciales incorrectas. Verifique su correo y contraseña.' };
  if (found.estado !== 'activo') return { ok: false, error: 'Cuenta suspendida. Contacte al administrador.' };

  return { ok: true, user: found };
}

/**
 * Guarda la sesión en memoria y redirige al dashboard.
 * @param {Object} user - Objeto usuario autenticado.
 * @returns {void}
 */
function saveSession(user) {
  currentUser = user;
  // Nota: en producción usaría sessionStorage + token JWT, no localStorage con datos
  try {
    sessionStorage.setItem('sdc_user', JSON.stringify(user));
  } catch (e) {
    console.error('Error guardando sesión:', e);
  }
}

/**
 * Recupera la sesión activa. Redirige al login si no existe.
 * @returns {Object|null} Usuario de la sesión o null.
 */
function requireAuth() {
  try {
    const raw = sessionStorage.getItem('sdc_user');
    if (raw) {
      currentUser = JSON.parse(raw);
      return currentUser;
    }
  } catch (e) {
    console.error('Error leyendo sesión:', e);
  }
  navigate('index.html');
  return null;
}

// ── 5. Sistema de Toast Notifications ─────────────────────
/**
 * Muestra una notificación toast en la esquina inferior derecha.
 * @param {string} message - Texto a mostrar al usuario.
 * @param {'success'|'error'|'info'|'warning'} type - Tipo semántico.
 * @param {number} [duration=3400] - Duración en milisegundos.
 * @returns {void}
 */
function showToast(message, type = 'info', duration = 3400) {
  const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  let container = document.getElementById('toastContainer');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] ?? 'ℹ️'}</span>
    <span style="flex:1">${message}</span>
    <button class="toast-close" aria-label="Cerrar notificación">✕</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  });

  container.appendChild(toast);

  // Doble rAF para asegurar que el elemento esté en el DOM antes de animar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── 6. Gestión de Modales ──────────────────────────────────
/**
 * Abre un modal por su ID de overlay.
 * @param {string} id - ID del elemento .modal-overlay.
 * @returns {void}
 */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra un modal por su ID de overlay.
 * @param {string} id - ID del elemento .modal-overlay.
 * @returns {void}
 */
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

// ── 7. Panel de Detalle ────────────────────────────────────
/**
 * Abre el panel lateral de detalle.
 * @param {string} [panelId='detailPanel'] - ID del panel.
 * @returns {void}
 */
function openDetailPanel(panelId = 'detailPanel') {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('open');
}

/**
 * Cierra el panel lateral de detalle.
 * @param {string} [panelId='detailPanel'] - ID del panel.
 * @returns {void}
 */
function closeDetailPanel(panelId = 'detailPanel') {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('open');
}

// ── 8. Sidebar Responsivo ──────────────────────────────────
/**
 * Alterna la visibilidad del sidebar en móvil.
 * @returns {void}
 */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

// ── 9. Utilidades de Formato ──────────────────────────────
/**
 * Formatea una cadena de fecha a formato legible en español.
 * @param {string} dateStr - Fecha en formato ISO 8601.
 * @returns {string} Fecha formateada o cadena vacía.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Formatea un número con separadores de miles.
 * @param {number} n - Número a formatear.
 * @returns {string} Número formateado.
 */
function fmtNum(n) {
  return new Intl.NumberFormat('es-CO').format(n);
}

/**
 * Formatea un valor monetario en COP.
 * @param {number} val - Valor a formatear.
 * @returns {string} Precio formateado con símbolo.
 */
function fmtPrice(val) {
  if (val === null || val === undefined) return '—';
  return `$${val.toFixed(2)} USD`;
}

/**
 * Anima el contador de un elemento del DOM desde 0 hasta target.
 * @param {HTMLElement} el       - Elemento cuyo textContent se actualizará.
 * @param {number}      target   - Valor final del contador.
 * @param {number}      [duration=900] - Duración en ms.
 * @returns {void}
 */
function animateCounter(el, target, duration = 900) {
  if (!el) return;
  const start     = performance.now();
  const startVal  = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Función de easing: ease-out-quad
    const eased    = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ── 10. Validación de Formularios ─────────────────────────
/**
 * Valida el formato básico de un correo electrónico.
 * @param {string} email - Correo a validar.
 * @returns {boolean} Verdadero si el formato es válido.
 */
function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida que un valor no sea nulo, indefinido o cadena vacía.
 * @param {*} value - Valor a validar.
 * @returns {boolean} Verdadero si el valor tiene contenido.
 */
function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Muestra u oculta el mensaje de error asociado a un campo.
 * @param {string}  fieldId - ID del input.
 * @param {string}  errId   - ID del span de error.
 * @param {boolean} show    - Mostrar (true) u ocultar (false) el error.
 * @returns {void}
 */
function setFieldError(fieldId, errId, show) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.toggle('error', show);
  if (err)   err.classList.toggle('show', show);
}

// ── 11. Renderizado de UI del Sidebar ─────────────────────
/**
 * Renderiza la información del usuario autenticado en el sidebar.
 * @param {Object} user - Objeto usuario con nombre, rol e initials.
 * @returns {void}
 */
function renderSidebarUser(user) {
  const nameEl  = document.getElementById('sidebarUserName');
  const roleEl  = document.getElementById('sidebarUserRole');
  const initEl  = document.getElementById('sidebarUserInit');

  if (nameEl)  nameEl.textContent  = user.nombre;
  if (roleEl)  roleEl.textContent  = capitalizeFirst(user.rol);
  if (initEl)  initEl.textContent  = user.initials;
}

/**
 * Pone en mayúscula la primera letra de una cadena.
 * @param {string} str - Cadena a formatear.
 * @returns {string}
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Devuelve la clase CSS de badge según el estado de un diseño/proyecto.
 * @param {string} estado - Estado ('aprobado', 'revision', 'borrador', etc.).
 * @returns {string} Clase CSS del badge.
 */
function getBadgeClass(estado) {
  const MAP = {
    aprobado:   'badge-success',
    activo:     'badge-success',
    completada: 'badge-success',
    exitosa:    'badge-success',
    revision:   'badge-warning',
    pendiente:  'badge-warning',
    borrador:   'badge-neutral',
    finalizado: 'badge-info',
    error:      'badge-error',
    inactivo:   'badge-neutral',
    archivado:  'badge-neutral',
    suspendido: 'badge-error'
  };
  return MAP[estado] ?? 'badge-neutral';
}

/**
 * Devuelve el emoji de icono según el tipo de circuito.
 * @param {string} tipo - Tipo de circuito.
 * @returns {string} Emoji representativo.
 */
function getTipoIcon(tipo) {
  const MAP = {
    mixto:           '⚡',
    microcontrolador:'🔬',
    asic:            '💎',
    fpga:            '🔷',
    analogico:       '〰️',
    esquematico:     '📐',
    pcb:             '🟢',
    layout:          '🗺️',
    analogica:       '〰️',
    digital:         '🔢',
    termica:         '🌡️',
    energetica:      '🔋'
  };
  return MAP[tipo] ?? '🔧';
}

// ── 12. Inicialización común de páginas ───────────────────
/**
 * Inicializa el comportamiento común del sidebar en todas las páginas.
 * Debe llamarse desde DOMContentLoaded de cada pantalla.
 * @returns {void}
 */
function initCommon() {
  // Botón hamburger para móvil
  const hamBtn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('sidebarOverlay');

  if (hamBtn) hamBtn.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  // Cerrar modales al hacer clic en el overlay
  document.querySelectorAll('.modal-overlay').forEach(mo => {
    mo.addEventListener('click', e => {
      if (e.target === mo) closeModal(mo.id);
    });
  });

  // Marcar ítem de nav activo según la página actual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === currentPage) {
      item.classList.add('active');
    }
  });
}

// ── 13. Clase de Repositorio (Abstracción OOP) ────────────
/**
 * Repositorio genérico que abstrae filtrado y búsqueda sobre
 * colecciones en memoria. Aplica principio de abstracción POO.
 */
class Repository {
  /** @type {Array} Colección interna de elementos */
  #items;

  /**
   * @param {Array} initialItems - Colección inicial.
   */
  constructor(initialItems = []) {
    this.#items = [...initialItems];
  }

  /** @returns {number} Total de elementos en el repositorio. */
  get total() { return this.#items.length; }

  /** @returns {Array} Copia de todos los elementos. */
  getAll() { return [...this.#items]; }

  /**
   * Busca un elemento por su ID.
   * @param {number} id - ID a buscar.
   * @returns {Object|undefined}
   */
  findById(id) { return this.#items.find(item => item.id === id); }

  /**
   * Filtra elementos según una función predicado.
   * @param {Function} predicate - Función de filtrado.
   * @returns {Array}
   */
  filter(predicate) { return this.#items.filter(predicate); }

  /**
   * Agrega un nuevo elemento al repositorio con ID autogenerado.
   * @param {Object} item - Objeto a insertar (sin ID).
   * @returns {Object} Elemento insertado con ID asignado.
   */
  add(item) {
    const maxId = this.#items.reduce((max, i) => Math.max(max, i.id), 0);
    const newItem = { ...item, id: maxId + 1 };
    this.#items.push(newItem);
    return newItem;
  }

  /**
   * Actualiza un elemento existente por ID.
   * @param {number}  id      - ID del elemento.
   * @param {Object}  changes - Propiedades a actualizar.
   * @returns {Object|null} Elemento actualizado o null si no existe.
   */
  update(id, changes) {
    const idx = this.#items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    this.#items[idx] = { ...this.#items[idx], ...changes };
    return this.#items[idx];
  }

  /**
   * Elimina un elemento por ID.
   * @param {number} id - ID a eliminar.
   * @returns {boolean} Verdadero si se eliminó.
   */
  remove(id) {
    const idx = this.#items.findIndex(item => item.id === id);
    if (idx === -1) return false;
    this.#items.splice(idx, 1);
    return true;
  }
}

// Instancias del repositorio para cada entidad principal
const repoProyectos   = new Repository(DB_PROYECTOS);
const repoDisenios    = new Repository(DB_DISENIOS);
const repoComponentes = new Repository(DB_COMPONENTES);
const repoSimulaciones= new Repository(DB_SIMULACIONES);
const repoProveedores = new Repository(DB_PROVEEDORES);

// ── 14. Exportaciones globales ─────────────────────────────
// Expone las funciones necesarias en window para acceso desde HTML inline
window.navigate        = navigate;
window.logout          = logout;
window.authenticate    = authenticate;
window.saveSession     = saveSession;
window.requireAuth     = requireAuth;
window.showToast       = showToast;
window.openModal       = openModal;
window.closeModal      = closeModal;
window.openDetailPanel = openDetailPanel;
window.closeDetailPanel= closeDetailPanel;
window.toggleSidebar   = toggleSidebar;
window.formatDate      = formatDate;
window.fmtNum          = fmtNum;
window.fmtPrice        = fmtPrice;
window.animateCounter  = animateCounter;
window.validateEmail   = validateEmail;
window.validateRequired= validateRequired;
window.setFieldError   = setFieldError;
window.renderSidebarUser = renderSidebarUser;
window.getBadgeClass   = getBadgeClass;
window.getTipoIcon     = getTipoIcon;
window.capitalizeFirst = capitalizeFirst;
window.initCommon      = initCommon;

// Repositorios
window.repoProyectos    = repoProyectos;
window.repoDisenios     = repoDisenios;
window.repoComponentes  = repoComponentes;
window.repoSimulaciones = repoSimulaciones;
window.repoProveedores  = repoProveedores;
