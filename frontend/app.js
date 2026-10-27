/* ============================================
   WarrantyVault — Vanilla JavaScript App
   No React, no frameworks.
   Simple, readable, human-written code.
   ============================================ */

// ─── SVG Icons (inline strings) ───
const ICONS = {
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  layoutDashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/></svg>`,
  logOut: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  filter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  errorCircle: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`,
  successCircle: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
  closeSm: `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`,
};

// ─── API Layer (replaces axios) ───
const API = {
  baseURL: '/api',

  async request(method, url, data = null, options = {}) {
    const config = {
      method,
      headers: {},
      credentials: 'include', // send cookies
    };

    if (data instanceof FormData) {
      config.body = data;
    } else if (data) {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(data);
    }

    if (options.responseType === 'blob') {
      // handled below
    }

    const response = await fetch(this.baseURL + url, config);

    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch { errorData = {}; }
      const message = errorData?.error?.message || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    if (options.responseType === 'blob') {
      return { data: await response.blob() };
    }
    return { data: await response.json() };
  },

  get(url, params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) qs.set(k, v);
    });
    const queryString = qs.toString();
    return this.request('GET', url + (queryString ? '?' + queryString : ''));
  },
  post(url, data) { return this.request('POST', url, data); },
  patch(url, data) { return this.request('PATCH', url, data); },
  delete(url) { return this.request('DELETE', url); },
  upload(url, formData) { return this.request('POST', url, formData); },
  downloadBlob(url) { return this.request('GET', url, null, { responseType: 'blob' }); },
};

// ─── Format Utilities ───
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
    });
  } catch { return dateStr; }
}

function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount);
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDaysRemaining(days) {
  if (days === null || days === undefined) return '—';
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

function daysClass(days) {
  if (days === null || days === undefined) return 'days-normal';
  if (days < 0) return 'days-danger';
  if (days <= 7) return 'days-danger';
  if (days <= 30) return 'days-warning';
  return 'days-good';
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function statusBadgeHTML(status) {
  const classes = { active: 'badge-active', expiring: 'badge-expiring', expired: 'badge-expired' };
  const labels = { active: 'Active', expiring: 'Expiring', expired: 'Expired' };
  return `<span class="badge ${classes[status] || ''}">${labels[status] || status || 'Unknown'}</span>`;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── App State ───
const AppState = {
  user: null,
  loading: true,
  currentPage: null,
  mobileMenuOpen: false,
};

// ─── Toast Manager ───
let toastTimer = null;
function showToast(message, type = 'success') {
  removeToast();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = 'app-toast';
  toast.innerHTML = `<span>${escapeHTML(message)}</span><button class="toast-close" onclick="removeToast()">✕</button>`;
  document.body.appendChild(toast);
  toastTimer = setTimeout(removeToast, 4000);
}
function removeToast() {
  clearTimeout(toastTimer);
  const el = document.getElementById('app-toast');
  if (el) el.remove();
}

// ─── Modal Manager ───
function showConfirmDialog(title, message, confirmLabel, onConfirm, danger = true) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'confirm-dialog';
  overlay.innerHTML = `
    <div class="modal-backdrop" onclick="closeConfirmDialog()"></div>
    <div class="modal-content">
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(message)}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeConfirmDialog()">Cancel</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirm-dialog-ok">${escapeHTML(confirmLabel)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('confirm-dialog-ok').addEventListener('click', async () => {
    document.getElementById('confirm-dialog-ok').disabled = true;
    document.getElementById('confirm-dialog-ok').textContent = 'Please wait…';
    await onConfirm();
    closeConfirmDialog();
  });
}
function closeConfirmDialog() {
  const el = document.getElementById('confirm-dialog');
  if (el) el.remove();
}

// ─── Simple Hash Router ───
function navigateTo(path) {
  window.location.hash = '#' + path;
}

function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/dashboard';
  return hash;
}

function parseRoute(route) {
  // Match known patterns
  if (route === '/login') return { page: 'login' };
  if (route === '/register') return { page: 'register' };
  if (route === '/dashboard') return { page: 'dashboard' };
  if (route === '/products/new') return { page: 'productForm', id: null };
  if (route.match(/^\/products\/([a-f0-9]+)\/edit$/)) {
    return { page: 'productForm', id: route.match(/^\/products\/([a-f0-9]+)\/edit$/)[1] };
  }
  if (route.match(/^\/products\/([a-f0-9]+)$/)) {
    return { page: 'productDetail', id: route.match(/^\/products\/([a-f0-9]+)$/)[1] };
  }
  if (route === '/products') return { page: 'products' };
  return { page: 'notFound' };
}

// ─── Router Handler ───
async function handleRouteChange() {
  const route = getCurrentRoute();
  const parsed = parseRoute(route);

  // Auth guard: if not logged in and not on auth pages, redirect to login
  if (!AppState.user && parsed.page !== 'login' && parsed.page !== 'register') {
    navigateTo('/login');
    return;
  }
  // If logged in and on auth pages, redirect to dashboard
  if (AppState.user && (parsed.page === 'login' || parsed.page === 'register')) {
    navigateTo('/dashboard');
    return;
  }

  AppState.currentPage = parsed.page;

  // Show/hide app shell vs auth layout
  if (parsed.page === 'login' || parsed.page === 'register') {
    renderAuthLayout(parsed.page);
  } else if (parsed.page === 'notFound') {
    renderNotFound();
  } else {
    renderAppLayout(parsed);
  }

  // Close mobile menu on navigation
  AppState.mobileMenuOpen = false;
  updateMobileMenu();
}

// ─── Render App Shell (sidebar + content) ───
function renderAppLayout(parsed) {
  const root = document.getElementById('root');
  root.innerHTML = `
    <!-- Desktop Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">${ICONS.shield}</div>
        <div>
          <div class="sidebar-logo-text">WarrantyVault</div>
          <div class="sidebar-logo-sub">Warranty Manager</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a href="#/dashboard" class="sidebar-nav-link ${parsed.page === 'dashboard' ? 'active' : ''}" data-page="dashboard">
          ${ICONS.layoutDashboard} Dashboard
        </a>
        <a href="#/products" class="sidebar-nav-link ${parsed.page === 'products' || parsed.page === 'productForm' || parsed.page === 'productDetail' ? 'active' : ''}" data-page="products">
          ${ICONS.package} Products
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${AppState.user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style="min-width:0">
            <div class="sidebar-user-name">${escapeHTML(AppState.user?.name)}</div>
            <div class="sidebar-user-email">${escapeHTML(AppState.user?.email)}</div>
          </div>
        </div>
        <button class="sidebar-logout" id="logout-btn" onclick="handleLogout()">
          ${ICONS.logOut} Sign out
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="mobile-header" id="mobile-header">
      <div class="mobile-header-logo">
        <div class="mobile-header-logo-icon">${ICONS.shield}</div>
        <span>WarrantyVault</span>
      </div>
      <button class="mobile-menu-btn" id="mobile-menu-toggle" onclick="toggleMobileMenu()">
        ${ICONS.menu}
      </button>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" onclick="closeMobileMenu()">
      <div class="mobile-menu" onclick="event.stopPropagation()">
        <a href="#/dashboard" class="sidebar-nav-link ${parsed.page === 'dashboard' ? 'active' : ''}" onclick="closeMobileMenu()">
          ${ICONS.layoutDashboard} Dashboard
        </a>
        <a href="#/products" class="sidebar-nav-link ${parsed.page === 'products' ? 'active' : ''}" onclick="closeMobileMenu()">
          ${ICONS.package} Products
        </a>
        <button class="sidebar-nav-link" onclick="handleLogout()" style="width:100%;text-align:left;">
          ${ICONS.logOut} Sign out
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="main-inner" id="page-content">
        <div class="loading-row"><div class="spinner spinner-md"></div><span>Loading…</span></div>
      </div>
    </main>
  `;

  // Render the specific page
  const content = document.getElementById('page-content');
  switch (parsed.page) {
    case 'dashboard': renderDashboard(content); break;
    case 'products': renderProducts(content); break;
    case 'productForm': renderProductForm(content, parsed.id); break;
    case 'productDetail': renderProductDetail(content, parsed.id); break;
  }
}

// ─── Auth Layout ───
function renderAuthLayout(page) {
  const root = document.getElementById('root');
  if (page === 'login') {
    renderLoginPage(root);
  } else {
    renderRegisterPage(root);
  }
}

// ─── Login Page ───
function renderLoginPage(container) {
  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-logo">
          <div class="auth-logo-icon">${ICONS.shield}</div>
          <h1>WarrantyVault</h1>
          <p>Sign in to manage your warranties</p>
        </div>
        <div class="auth-card">
          <h2>Welcome back</h2>
          <div id="login-error"></div>
          <form id="login-form" class="auth-form" novalidate>
            <div>
              <label for="email" class="label">Email address</label>
              <div class="input-group">
                <span class="input-icon">${ICONS.mail}</span>
                <input id="email" name="email" type="email" autocomplete="email" required
                  class="input input-with-icon" placeholder="you@example.com">
              </div>
            </div>
            <div>
              <label for="password" class="label">Password</label>
              <div class="input-group">
                <span class="input-icon">${ICONS.lock}</span>
                <input id="password" name="password" type="password" autocomplete="current-password" required
                  class="input input-with-icon input-with-icon-right" placeholder="Enter your password">
                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password', this)" aria-label="Show password">
                  ${ICONS.eye}
                </button>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;padding:0.625rem 1rem;margin-top:0.5rem" id="login-submit-btn">
              Sign in
            </button>
          </form>
          <p class="auth-footer">
            Don't have an account? <a href="#/register">Create account</a>
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-submit-btn');
    const errorDiv = document.getElementById('login-error');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    btn.disabled = true;
    btn.textContent = 'Signing in…';
    errorDiv.innerHTML = '';

    try {
      const res = await API.post('/auth/login', { email, password });
      AppState.user = res.data.data.user;
      navigateTo('/dashboard');
    } catch (err) {
      errorDiv.innerHTML = errorAlertHTML(err.message || 'Login failed. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Sign in';
    }
  });
}

// ─── Register Page ───
function renderRegisterPage(container) {
  container.innerHTML = `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-logo">
          <div class="auth-logo-icon">${ICONS.shield}</div>
          <h1>WarrantyVault</h1>
          <p>Create your free account</p>
        </div>
        <div class="auth-card">
          <h2>Create account</h2>
          <div id="register-error"></div>
          <form id="register-form" class="auth-form" novalidate>
            <div>
              <label for="name" class="label">Full name</label>
              <div class="input-group">
                <span class="input-icon">${ICONS.user}</span>
                <input id="name" name="name" type="text" autocomplete="name" required minlength="2"
                  class="input input-with-icon" placeholder="Your name">
              </div>
            </div>
            <div>
              <label for="email" class="label">Email address</label>
              <div class="input-group">
                <span class="input-icon">${ICONS.mail}</span>
                <input id="email" name="email" type="email" autocomplete="email" required
                  class="input input-with-icon" placeholder="you@example.com">
              </div>
            </div>
            <div>
              <label for="password" class="label">Password</label>
              <div class="input-group">
                <span class="input-icon">${ICONS.lock}</span>
                <input id="password" name="password" type="password" autocomplete="new-password" required minlength="8"
                  class="input input-with-icon input-with-icon-right" placeholder="At least 8 characters">
                <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password', this)" aria-label="Show password">
                  ${ICONS.eye}
                </button>
              </div>
              <p class="password-hint">Must be at least 8 characters.</p>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;padding:0.625rem 1rem;margin-top:0.5rem" id="register-submit-btn">
              Create account
            </button>
          </form>
          <p class="auth-footer">
            Already have an account? <a href="#/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('register-submit-btn');
    const errorDiv = document.getElementById('register-error');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 8) {
      errorDiv.innerHTML = errorAlertHTML('Password must be at least 8 characters.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creating account…';
    errorDiv.innerHTML = '';

    try {
      const res = await API.post('/auth/register', { name, email, password });
      AppState.user = res.data.data.user;
      navigateTo('/dashboard');
    } catch (err) {
      errorDiv.innerHTML = errorAlertHTML(err.message || 'Registration failed. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });
}

// ─── Dashboard Page ───
async function renderDashboard(container) {
  container.innerHTML = `<div class="loading-row"><div class="spinner spinner-md"></div><span>Loading dashboard…</span></div>`;

  try {
    const res = await API.get('/dashboard/summary');
    const data = res.data.data;
    const summary = data?.summary;
    const upcoming = data?.upcoming || [];
    const reminders = upcoming.filter(p => p.reminderDays?.length > 0);
    const firstName = AppState.user?.name?.split(' ')[0] || 'User';

    let upcomingHTML = '';
    if (upcoming.length === 0) {
      upcomingHTML = `
        <div class="empty-state">
          ${ICONS.shield}
          <h3>No upcoming expirations</h3>
          <p>All your warranties are in good standing.</p>
        </div>`;
    } else {
      upcomingHTML = upcoming.map(p => `
        <div class="upcoming-item" onclick="navigateTo('/products/${p._id}')">
          <div class="product-icon-box">${ICONS.package}</div>
          <div class="upcoming-info">
            <div class="name">${escapeHTML(p.name)}</div>
            <div class="meta">${escapeHTML(p.brand)} · ${escapeHTML(p.category)}</div>
          </div>
          <div class="upcoming-expiry">
            <div class="date">${formatDate(p.warrantyExpiryDate)}</div>
            <div class="days ${daysClass(p.daysRemaining)}">${formatDaysRemaining(p.daysRemaining)}</div>
          </div>
          ${statusBadgeHTML(p.warrantyStatus)}
          <div class="upcoming-chevron">${ICONS.chevronRight}</div>
        </div>
      `).join('');
    }

    let remindersHTML = '';
    if (reminders.length > 0) {
      remindersHTML = `
        <div class="reminder-banner">
          <div class="reminder-banner-header">
            ${ICONS.bell}
            <h3>Warranty Reminders</h3>
          </div>
          <ul class="reminder-list">
            ${reminders.map(p => `
              <li>
                <strong>${escapeHTML(p.name)}</strong>
                <span class="days"> — ${p.daysRemaining === 0 ? 'expires TODAY' : `${p.daysRemaining} days remaining`}</span>
              </li>
            `).join('')}
          </ul>
        </div>`;
    }

    let welcomeHTML = '';
    if (summary?.total === 0) {
      welcomeHTML = `
        <div class="card welcome-card">
          <div class="welcome-icon">${ICONS.shield}</div>
          <h3>Start tracking warranties</h3>
          <p>Add your first product to track its warranty, upload receipts, and get expiry reminders.</p>
          <a href="#/products/new" class="btn btn-primary">${ICONS.plus} Add your first product</a>
        </div>`;
    }

    container.innerHTML = `
      <div class="space-y-6">
        <div class="page-header">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p>Welcome back, ${escapeHTML(firstName)}</p>
          </div>
          <a href="#/products/new" class="btn btn-primary" id="dashboard-add-product-btn">${ICONS.plus} Add Product</a>
        </div>

        <div class="stats-grid">
          <div class="card stat-card">
            <div class="stat-icon blue">${ICONS.package}</div>
            <div>
              <div class="stat-value">${summary?.total ?? '—'}</div>
              <div class="stat-label">Total Products</div>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon green">${ICONS.shield}</div>
            <div>
              <div class="stat-value">${summary?.active ?? '—'}</div>
              <div class="stat-label">Active</div>
              <div class="stat-desc">Warranty valid</div>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon amber">${ICONS.alertTriangle}</div>
            <div>
              <div class="stat-value">${summary?.expiring ?? '—'}</div>
              <div class="stat-label">Expiring Soon</div>
              <div class="stat-desc">Within 30 days</div>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon red">${ICONS.xCircle}</div>
            <div>
              <div class="stat-value">${summary?.expired ?? '—'}</div>
              <div class="stat-label">Expired</div>
            </div>
          </div>
        </div>

        ${remindersHTML}

        <div class="card">
          <div class="upcoming-header">
            <h2 class="section-title">Upcoming Expirations</h2>
            <a href="#/products">View all ${ICONS.chevronRight}</a>
          </div>
          ${upcomingHTML}
        </div>

        ${welcomeHTML}
      </div>
    `;
  } catch (err) {
    container.innerHTML = errorAlertHTML(err.message || 'Failed to load dashboard.');
  }
}

// ─── Products Page ───
const CATEGORIES = ['Electronics', 'Appliances', 'Computers', 'Accessories', 'Furniture', 'Automotive', 'Other'];

async function renderProducts(container) {
  // Parse query params from hash
  const hashParts = window.location.hash.split('?');
  const params = new URLSearchParams(hashParts[1] || '');
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || 'expiry_asc';
  const page = parseInt(params.get('page') || '1', 10);
  const hasFilters = q || category || status;

  container.innerHTML = `<div class="loading-row"><div class="spinner spinner-md"></div><span>Loading products…</span></div>`;

  try {
    const res = await API.get('/products', { q, category, status, sort, page, limit: 20 });
    const products = res.data.data.products;
    const pagination = res.data.data.pagination;

    let tableHTML = '';
    let mobileHTML = '';

    if (products.length === 0) {
      const emptyMsg = hasFilters
        ? { title: 'No products match your filters', desc: 'Try adjusting your search or filters.', action: '' }
        : { title: 'No products yet', desc: 'Add your first product to start tracking warranties.', action: `<a href="#/products/new" class="btn btn-primary">${ICONS.plus} Add Product</a>` };
      tableHTML = `<div class="empty-state">${ICONS.package}<h3>${emptyMsg.title}</h3><p>${emptyMsg.desc}</p>${emptyMsg.action}</div>`;
    } else {
      tableHTML = `
        <div class="product-table-wrapper">
          <table class="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>
                    <div class="product-name">${escapeHTML(p.name)}</div>
                    <div class="product-brand">${escapeHTML(p.brand)} ${p.model ? `· ${escapeHTML(p.model)}` : ''}</div>
                  </td>
                  <td>${escapeHTML(p.category)}</td>
                  <td>${formatDate(p.purchaseDate)}</td>
                  <td>
                    <div>${formatDate(p.warrantyExpiryDate)}</div>
                    <div class="days ${daysClass(p.daysRemaining)}" style="font-size:0.75rem;margin-top:2px">${formatDaysRemaining(p.daysRemaining)}</div>
                  </td>
                  <td>${statusBadgeHTML(p.warrantyStatus)}</td>
                  <td>${formatCurrency(p.purchasePrice, p.currency)}</td>
                  <td>
                    <div class="table-actions">
                      <a href="#/products/${p._id}" class="action-btn" title="View details">${ICONS.eye}</a>
                      <a href="#/products/${p._id}/edit" class="action-btn" title="Edit">${ICONS.edit}</a>
                      <button class="action-btn danger" title="Delete" onclick="event.stopPropagation(); deleteProduct('${p._id}', '${escapeHTML(p.name).replace(/'/g, "\\'")}')">${ICONS.trash2}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      mobileHTML = `
        <div class="product-mobile-list">
          ${products.map(p => `
            <div class="product-mobile-item" onclick="navigateTo('/products/${p._id}')">
              <div class="product-icon-box">${ICONS.package}</div>
              <div class="product-mobile-info">
                <div class="name">${escapeHTML(p.name)}</div>
                <div class="meta">${escapeHTML(p.brand)} · ${escapeHTML(p.category)}</div>
                <div class="expiry">Expires ${formatDate(p.warrantyExpiryDate)}</div>
              </div>
              ${statusBadgeHTML(p.warrantyStatus)}
            </div>
          `).join('')}
        </div>
      `;
    }

    let paginationHTML = '';
    if (pagination.pages > 1) {
      paginationHTML = `
        <div class="pagination">
          <span class="pagination-info">Page ${pagination.page} of ${pagination.pages}</span>
          <div class="pagination-btns">
            <button class="btn btn-secondary pagination-btn" ${pagination.page <= 1 ? 'disabled' : ''} onclick="updateProductsParam('page', ${pagination.page - 1})">Previous</button>
            <button class="btn btn-secondary pagination-btn" ${pagination.page >= pagination.pages ? 'disabled' : ''} onclick="updateProductsParam('page', ${pagination.page + 1})">Next</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="space-y-5">
        <div class="page-header">
          <div>
            <h1 class="page-title">Products</h1>
            <p>${pagination.total ?? 0} total products</p>
          </div>
          <a href="#/products/new" class="btn btn-primary" id="products-add-btn">${ICONS.plus} Add Product</a>
        </div>

        <div class="card filters-card">
          <div class="filters-row">
            <div class="search-wrapper">
              ${ICONS.search}
              <input id="products-search" type="search" placeholder="Search by name or brand…" class="input" value="${escapeHTML(q)}" oninput="debounceProductSearch(this.value)">
            </div>
            <select id="products-category-filter" class="input filter-select" value="${escapeHTML(category)}" onchange="updateProductsParam('category', this.value)">
              <option value="">All Categories</option>
              ${CATEGORIES.map(c => `<option value="${c}" ${category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <select id="products-status-filter" class="input filter-select" onchange="updateProductsParam('status', this.value)">
              <option value="" ${!status ? 'selected' : ''}>All Statuses</option>
              <option value="active" ${status === 'active' ? 'selected' : ''}>Active</option>
              <option value="expiring" ${status === 'expiring' ? 'selected' : ''}>Expiring Soon</option>
              <option value="expired" ${status === 'expired' ? 'selected' : ''}>Expired</option>
            </select>
            <select id="products-sort" class="input filter-select" onchange="updateProductsParam('sort', this.value)">
              <option value="expiry_asc" ${sort === 'expiry_asc' ? 'selected' : ''}>Expiry ↑ (soonest)</option>
              <option value="expiry_desc" ${sort === 'expiry_desc' ? 'selected' : ''}>Expiry ↓ (latest)</option>
              <option value="newest" ${sort === 'newest' ? 'selected' : ''}>Newest first</option>
            </select>
            ${hasFilters ? `<button class="btn btn-ghost" onclick="clearProductFilters()">${ICONS.x} Clear</button>` : ''}
          </div>
        </div>

        <div class="card">
          ${tableHTML}
          ${mobileHTML}
          ${paginationHTML}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = errorAlertHTML(err.message || 'Failed to load products.');
  }
}

let searchDebounceTimer = null;
function debounceProductSearch(value) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => updateProductsParam('q', value), 300);
}

function updateProductsParam(key, value) {
  const hashParts = window.location.hash.split('?');
  const params = new URLSearchParams(hashParts[1] || '');
  if (value) params.set(key, value);
  else params.delete(key);
  if (key !== 'page') params.delete('page');
  const qs = params.toString();
  window.location.hash = '#/products' + (qs ? '?' + qs : '');
}

function clearProductFilters() {
  window.location.hash = '#/products';
}

function deleteProduct(id, name) {
  showConfirmDialog(
    'Delete Product',
    `Delete "${name}"? This will also remove all receipts and service records. This cannot be undone.`,
    'Delete Product',
    async () => {
      try {
        await API.delete(`/products/${id}`);
        showToast(`"${name}" deleted.`, 'success');
        handleRouteChange(); // refresh
      } catch (err) {
        showToast(err.message || 'Delete failed.', 'error');
      }
    }
  );
}

// ─── Product Form Page ───
async function renderProductForm(container, editId) {
  const isEditing = Boolean(editId);
  const DEFAULT_FORM = {
    name: '', brand: '', model: '', category: 'Electronics',
    serialNumber: '', seller: '', purchaseDate: todayString(),
    warrantyMonths: 12, purchasePrice: '', currency: 'INR', notes: '',
  };

  let formData = { ...DEFAULT_FORM };

  if (isEditing) {
    container.innerHTML = `<div class="loading-row"><div class="spinner spinner-md"></div><span>Loading product…</span></div>`;
    try {
      const res = await API.get(`/products/${editId}`);
      const p = res.data.data.product;
      formData = {
        name: p.name || '', brand: p.brand || '', model: p.model || '',
        category: p.category || 'Electronics', serialNumber: p.serialNumber || '',
        seller: p.seller || '', purchaseDate: p.purchaseDate || todayString(),
        warrantyMonths: p.warrantyMonths ?? 12, purchasePrice: p.purchasePrice ?? '',
        currency: p.currency || 'INR', notes: p.notes || '',
      };
    } catch (err) {
      container.innerHTML = `<div class="form-container space-y-5">${errorAlertHTML(err.message)}<button class="btn btn-secondary" onclick="history.back()">← Back</button></div>`;
      return;
    }
  }

  container.innerHTML = `
    <div class="form-container space-y-5">
      <button class="back-link" onclick="history.back()">${ICONS.chevronLeft} Back</button>

      <div>
        <h1 class="page-title">${isEditing ? 'Edit Product' : 'Add Product'}</h1>
        <p style="color:var(--slate-500);font-size:0.875rem">${isEditing ? 'Update the product details below.' : 'Fill in the product details to start tracking its warranty.'}</p>
      </div>

      <div id="product-form-messages"></div>

      <div class="card form-card">
        <form id="product-form" class="space-y-5" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="name" class="label">Product Name *</label>
              <input id="name" name="name" type="text" required class="input" placeholder="e.g. Samsung Galaxy S24" value="${escapeHTML(formData.name)}" maxlength="120">
            </div>
            <div class="form-group">
              <label for="brand" class="label">Brand *</label>
              <input id="brand" name="brand" type="text" required class="input" placeholder="e.g. Samsung" value="${escapeHTML(formData.brand)}" maxlength="80">
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="model" class="label">Model <span class="optional">(optional)</span></label>
              <input id="model" name="model" type="text" class="input" placeholder="e.g. SM-S921B" value="${escapeHTML(formData.model)}" maxlength="80">
            </div>
            <div class="form-group">
              <label for="category" class="label">Category *</label>
              <select id="category" name="category" required class="input">
                ${CATEGORIES.map(c => `<option value="${c}" ${formData.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="purchaseDate" class="label">Purchase Date *</label>
              <input id="purchaseDate" name="purchaseDate" type="date" required class="input" value="${formData.purchaseDate}" max="${todayString()}">
            </div>
            <div class="form-group">
              <label for="warrantyMonths" class="label">Warranty Duration (months) *</label>
              <input id="warrantyMonths" name="warrantyMonths" type="number" required class="input" placeholder="12" min="0" max="240" value="${formData.warrantyMonths}">
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="purchasePrice" class="label">Purchase Price (INR) *</label>
              <input id="purchasePrice" name="purchasePrice" type="number" required class="input" placeholder="e.g. 79999" min="0" step="0.01" value="${formData.purchasePrice}">
            </div>
            <div class="form-group">
              <label for="serialNumber" class="label">Serial Number <span class="optional">(optional)</span></label>
              <input id="serialNumber" name="serialNumber" type="text" class="input" placeholder="e.g. R5CW000000A" value="${escapeHTML(formData.serialNumber)}" maxlength="100">
            </div>
          </div>

          <div class="form-group">
            <label for="seller" class="label">Seller / Store <span class="optional">(optional)</span></label>
            <input id="seller" name="seller" type="text" class="input" placeholder="e.g. Amazon India, Reliance Digital" value="${escapeHTML(formData.seller)}" maxlength="120">
          </div>

          <div class="form-group">
            <label for="notes" class="label">Notes <span class="optional">(optional)</span></label>
            <textarea id="notes" name="notes" rows="3" class="input" placeholder="Any additional notes about this product…" maxlength="1000">${escapeHTML(formData.notes)}</textarea>
            <div class="notes-counter"><span id="notes-count">${formData.notes.length}</span>/1000</div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="product-form-submit-btn" style="flex:1;padding:0.625rem 1rem;">
              ${isEditing ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" class="btn btn-secondary" onclick="history.back()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Notes counter
  document.getElementById('notes').addEventListener('input', (e) => {
    document.getElementById('notes-count').textContent = e.target.value.length;
  });

  // Form submit
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('product-form-submit-btn');
    const messagesDiv = document.getElementById('product-form-messages');
    btn.disabled = true;
    btn.innerHTML = `<div class="spinner spinner-sm"></div> Saving…`;
    messagesDiv.innerHTML = '';

    const payload = {
      name: document.getElementById('name').value,
      brand: document.getElementById('brand').value,
      model: document.getElementById('model').value,
      category: document.getElementById('category').value,
      serialNumber: document.getElementById('serialNumber').value,
      seller: document.getElementById('seller').value,
      purchaseDate: document.getElementById('purchaseDate').value,
      warrantyMonths: parseInt(document.getElementById('warrantyMonths').value, 10),
      purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
      currency: 'INR',
      notes: document.getElementById('notes').value,
    };

    try {
      if (isEditing) {
        await API.patch(`/products/${editId}`, payload);
        messagesDiv.innerHTML = successAlertHTML('Product updated successfully.');
        setTimeout(() => navigateTo(`/products/${editId}`), 800);
      } else {
        const res = await API.post('/products', payload);
        messagesDiv.innerHTML = successAlertHTML('Product created successfully.');
        setTimeout(() => navigateTo(`/products/${res.data.data.product._id}`), 800);
      }
    } catch (err) {
      messagesDiv.innerHTML = errorAlertHTML(err.message || 'Failed to save product.');
      btn.disabled = false;
      btn.textContent = isEditing ? 'Save Changes' : 'Add Product';
    }
  });
}

// ─── Product Detail Page ───
async function renderProductDetail(container, id) {
  container.innerHTML = `<div class="loading-row"><div class="spinner spinner-md"></div><span>Loading product…</span></div>`;

  try {
    const res = await API.get(`/products/${id}`);
    const product = res.data.data.product;

    const detailFields = [
      { label: 'Purchase Date', value: formatDate(product.purchaseDate) },
      { label: 'Warranty', value: `${product.warrantyMonths} months` },
      { label: 'Purchase Price', value: formatCurrency(product.purchasePrice, product.currency) },
    ];
    if (product.serialNumber) detailFields.push({ label: 'Serial Number', value: `<span class="font-mono">${escapeHTML(product.serialNumber)}</span>` });
    if (product.seller) detailFields.push({ label: 'Seller', value: escapeHTML(product.seller) });
    detailFields.push({ label: 'Added', value: formatDate(product.createdAt?.slice(0, 10)) });

    let notesHTML = '';
    if (product.notes) {
      notesHTML = `
        <div class="detail-notes">
          <label>Notes</label>
          <p>${escapeHTML(product.notes)}</p>
        </div>`;
    }

    let reminderHTML = '';
    if (product.reminderDays?.length > 0) {
      reminderHTML = `
        <div class="reminder-notice">
          <div class="reminder-notice-inner">
            ${ICONS.alertCircle}
            <p>⚠ Warranty reminder: ${product.daysRemaining} day${product.daysRemaining !== 1 ? 's' : ''} remaining. Consider renewing or noting down service contacts.</p>
          </div>
        </div>`;
    }

    container.innerHTML = `
      <div class="detail-container space-y-6">
        <div class="detail-header-actions">
          <button class="back-link" onclick="history.back()">${ICONS.chevronLeft} Back</button>
          <div class="actions">
            <a href="#/products/${id}/edit" class="btn btn-secondary">${ICONS.edit} Edit</a>
            <button class="btn btn-danger" onclick="deleteProductAndRedirect('${id}', '${escapeHTML(product.name).replace(/'/g, "\\'")}')">${ICONS.trash2} Delete</button>
          </div>
        </div>

        <div class="card detail-hero">
          <div class="detail-hero-top">
            <div class="product-icon-box large">${ICONS.package}</div>
            <div class="detail-hero-info">
              <div class="name-row">
                <h1>${escapeHTML(product.name)}</h1>
                ${statusBadgeHTML(product.warrantyStatus)}
              </div>
              <p class="meta-text">${escapeHTML(product.brand)} ${product.model ? `· ${escapeHTML(product.model)}` : ''} · ${escapeHTML(product.category)}</p>
            </div>
            <div class="detail-hero-expiry">
              <div class="days-remaining ${daysClass(product.daysRemaining)}">${formatDaysRemaining(product.daysRemaining)}</div>
              <div class="expiry-date">Warranty expiry: ${formatDate(product.warrantyExpiryDate)}</div>
            </div>
          </div>

          <div class="detail-grid">
            ${detailFields.map(f => `<div class="detail-field"><label>${f.label}</label><p>${f.value}</p></div>`).join('')}
          </div>

          ${notesHTML}
          ${reminderHTML}
        </div>

        <div id="receipts-section"></div>
        <div id="services-section"></div>
      </div>
    `;

    // Load receipts and services
    renderReceiptsSection(id);
    renderServicesSection(id);
  } catch (err) {
    container.innerHTML = `
      <div class="form-container space-y-5">
        ${errorAlertHTML(err.message || 'Product not found.')}
        <button class="btn btn-secondary" onclick="navigateTo('/products')">← Back to Products</button>
      </div>`;
  }
}

function deleteProductAndRedirect(id, name) {
  showConfirmDialog(
    'Delete Product',
    `Delete "${name}"? All receipts and service records will also be permanently deleted. This cannot be undone.`,
    'Delete Product',
    async () => {
      try {
        await API.delete(`/products/${id}`);
        navigateTo('/products');
        showToast(`"${name}" deleted.`);
      } catch (err) {
        showToast(err.message || 'Delete failed.', 'error');
      }
    }
  );
}

// ─── Receipts Section ───
async function renderReceiptsSection(productId) {
  const section = document.getElementById('receipts-section');
  section.innerHTML = `
    <div class="card">
      <div class="section-header">
        <h2 class="section-title">${ICONS.fileText} Receipts & Documents</h2>
        <label class="btn btn-primary upload-label" id="receipt-upload-label">
          ${ICONS.upload} Upload File
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" id="receipt-upload-input">
        </label>
      </div>
      <div class="section-body">
        <p class="file-hint">Accepts JPEG, PNG, WEBP, PDF • Max 5 MB each</p>
        <div id="receipts-list"><div class="loading-row"><div class="spinner spinner-sm"></div><span>Loading…</span></div></div>
      </div>
      <div id="ocr-panel-container"></div>
    </div>`;

  const listContainer = document.getElementById('receipts-list');

  async function loadReceipts() {
    try {
      const res = await API.get(`/products/${productId}/receipts`);
      const receipts = res.data.data.receipts;
      if (receipts.length === 0) {
        listContainer.innerHTML = `<div class="empty-state">${ICONS.fileText}<h3>No receipts uploaded</h3><p>Upload a receipt or warranty document for this product.</p></div>`;
      } else {
        listContainer.innerHTML = receipts.map(r => `
          <div class="receipt-item">
            <div class="receipt-file-icon">${ICONS.fileText}</div>
            <div class="receipt-info">
              <div class="file-name">${escapeHTML(r.originalName)}</div>
              <div class="file-meta">${formatFileSize(r.sizeBytes)} · ${formatDate(r.createdAt?.slice(0, 10))} · ${r.mimeType}</div>
              ${r.ocrStatus === 'complete' ? `<div class="ocr-status complete">${ICONS.checkCircle} OCR complete</div>` : ''}
              ${r.ocrStatus === 'failed' ? `<div class="ocr-status failed">${ICONS.alertCircle} OCR failed</div>` : ''}
            </div>
            <div class="receipt-actions">
              <button class="action-btn" title="Download" onclick="downloadReceipt('${r._id}', '${escapeHTML(r.originalName).replace(/'/g, "\\'")}')">${ICONS.download}</button>
              ${r.mimeType !== 'application/pdf' ? `<button class="action-btn" title="Run OCR" onclick="runOcr('${r._id}', '${escapeHTML(r.originalName).replace(/'/g, "\\'")}')">${ICONS.camera}</button>` : ''}
              <button class="action-btn danger" title="Delete" onclick="deleteReceipt('${r._id}', '${escapeHTML(r.originalName).replace(/'/g, "\\'")}', '${productId}')">${ICONS.trash2}</button>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      listContainer.innerHTML = errorAlertHTML(err.message);
    }
  }

  loadReceipts();

  // Upload handler
  document.getElementById('receipt-upload-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = document.getElementById('receipt-upload-label');
    label.classList.add('disabled');
    label.innerHTML = `${ICONS.upload} Uploading…<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" id="receipt-upload-input" disabled>`;

    const formData = new FormData();
    formData.append('receipt', file);
    try {
      await API.upload(`/products/${productId}/receipts`, formData);
      showToast('Receipt uploaded successfully.');
      renderReceiptsSection(productId);
    } catch (err) {
      showToast(err.message || 'Upload failed.', 'error');
      label.classList.remove('disabled');
      label.innerHTML = `${ICONS.upload} Upload File<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" id="receipt-upload-input">`;
    }
  });

  // Store productId for receipt actions
  window._currentReceiptsProductId = productId;
}

async function downloadReceipt(receiptId, fileName) {
  try {
    const res = await API.downloadBlob(`/receipts/${receiptId}/download`);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    showToast('Download failed.', 'error');
  }
}

async function runOcr(receiptId, fileName) {
  const panel = document.getElementById('ocr-panel-container');
  panel.innerHTML = `
    <div class="ocr-panel">
      <div class="ocr-panel-header">
        <h3>${ICONS.camera} OCR Review — ${escapeHTML(fileName)}</h3>
        <button onclick="document.getElementById('ocr-panel-container').innerHTML=''">Close</button>
      </div>
      <div class="loading-row"><div class="spinner spinner-sm"></div><span>Running OCR…</span></div>
    </div>`;

  try {
    const res = await API.post(`/receipts/${receiptId}/ocr`);
    const ocrResult = res.data.data;
    let candidatesHTML = '';
    if (ocrResult.candidates && Object.keys(ocrResult.candidates).length > 0) {
      const items = [];
      if (ocrResult.candidates.merchantHint) items.push({ label: 'Merchant:', value: ocrResult.candidates.merchantHint.value });
      if (ocrResult.candidates.dateHint) items.push({ label: 'Date found:', value: ocrResult.candidates.dateHint.value });
      if (ocrResult.candidates.amountHint) items.push({ label: 'Amount:', value: '₹ ' + ocrResult.candidates.amountHint.value });
      if (ocrResult.candidates.productHint) items.push({ label: 'Product line:', value: ocrResult.candidates.productHint.value });

      candidatesHTML = `
        <div style="margin-top:1rem">
          <p class="ocr-raw-label">Suggested Fields (review before using)</p>
          ${items.map(i => `<div class="ocr-candidate"><span class="ocr-candidate-label">${i.label}</span><span class="ocr-candidate-value">${escapeHTML(i.value)}</span></div>`).join('')}
          <p class="ocr-hint">Use these values to manually update the product fields. All fields marked italic are uncertain.</p>
        </div>`;
    }

    panel.innerHTML = `
      <div class="ocr-panel">
        <div class="ocr-panel-header">
          <h3>${ICONS.camera} OCR Review — ${escapeHTML(fileName)}</h3>
          <button onclick="document.getElementById('ocr-panel-container').innerHTML=''">Close</button>
        </div>
        <div class="ocr-warning"><strong>⚠ Important:</strong> OCR results are tentative suggestions. Review and correct them carefully before use. Confidence: ${ocrResult.confidence}%</div>
        <p class="ocr-raw-label">Raw Extracted Text</p>
        <pre class="ocr-raw-text">${escapeHTML(ocrResult.rawText) || '(No text detected)'}</pre>
        ${candidatesHTML}
      </div>`;
  } catch (err) {
    panel.innerHTML = `<div class="ocr-panel">${errorAlertHTML(err.message || 'OCR failed.')}<button class="btn btn-ghost" onclick="document.getElementById('ocr-panel-container').innerHTML=''">Close</button></div>`;
  }
}

function deleteReceipt(receiptId, fileName, productId) {
  showConfirmDialog(
    'Delete Receipt',
    `Delete "${fileName}"? This action cannot be undone.`,
    'Delete Receipt',
    async () => {
      try {
        await API.delete(`/receipts/${receiptId}`);
        showToast('Receipt deleted.');
        renderReceiptsSection(productId);
      } catch (err) {
        showToast(err.message || 'Delete failed.', 'error');
      }
    }
  );
}

// ─── Services Section ───
async function renderServicesSection(productId) {
  const section = document.getElementById('services-section');
  section.innerHTML = `
    <div class="card">
      <div class="section-header">
        <h2 class="section-title">${ICONS.wrench} Service History</h2>
        <button class="btn btn-primary" onclick="showServiceForm('${productId}')">${ICONS.plus} Add Record</button>
      </div>
      <div id="service-form-container"></div>
      <div class="section-body" id="services-list">
        <div class="loading-row"><div class="spinner spinner-sm"></div><span>Loading…</span></div>
      </div>
    </div>`;

  window._currentServicesProductId = productId;
  loadServices(productId);
}

async function loadServices(productId) {
  const listContainer = document.getElementById('services-list');
  try {
    const res = await API.get(`/products/${productId}/services`);
    const services = res.data.data.services;
    if (services.length === 0) {
      listContainer.innerHTML = `<div class="empty-state">${ICONS.wrench}<h3>No service records</h3><p>Track repairs and maintenance for this product.</p></div>`;
    } else {
      listContainer.innerHTML = services.map(svc => `
        <div class="service-item">
          <div class="service-date-icon">${ICONS.calendar}</div>
          <div class="service-info">
            <div class="desc-row">
              <span class="desc">${escapeHTML(svc.description)}</span>
              <span class="service-status ${svc.status}">${svc.status}</span>
            </div>
            <div class="service-meta">
              ${formatDate(svc.serviceDate)}
              ${svc.provider ? ` · ${escapeHTML(svc.provider)}` : ''}
              ${svc.cost !== null && svc.cost !== undefined ? ` · ${formatCurrency(svc.cost)}` : ''}
            </div>
            ${svc.notes ? `<div class="service-notes">${escapeHTML(svc.notes)}</div>` : ''}
          </div>
          <div class="service-item-actions">
            <button class="action-btn" title="Edit" onclick="showServiceForm('${productId}', ${JSON.stringify(svc).replace(/"/g, '&quot;')})">${ICONS.edit}</button>
            <button class="action-btn danger" title="Delete" onclick="deleteService('${svc._id}', '${productId}')">${ICONS.trash2}</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    listContainer.innerHTML = errorAlertHTML(err.message);
  }
}

function showServiceForm(productId, editData = null) {
  const formContainer = document.getElementById('service-form-container');
  const isEdit = Boolean(editData);
  const data = editData || {
    serviceDate: todayString(),
    provider: '', description: '',
    cost: '', status: 'completed', notes: '',
  };

  formContainer.innerHTML = `
    <div class="service-form">
      <div id="service-form-error"></div>
      <h3>${isEdit ? 'Edit Service Record' : 'Add Service Record'}</h3>
      <form id="service-form-inner" class="space-y-4">
        <div class="form-grid">
          <div class="form-group">
            <label class="label">Service Date *</label>
            <input type="date" required class="input" id="svc-date" value="${data.serviceDate}">
          </div>
          <div class="form-group">
            <label class="label">Status</label>
            <select class="input" id="svc-status">
              <option value="completed" ${data.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="requested" ${data.status === 'requested' ? 'selected' : ''}>Requested</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="label">Description *</label>
          <input type="text" required class="input" id="svc-description" placeholder="e.g. Screen replacement" value="${escapeHTML(data.description)}" maxlength="1000">
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="label">Provider / Technician <span class="optional">(optional)</span></label>
            <input type="text" class="input" id="svc-provider" placeholder="e.g. Samsung Service Center" value="${escapeHTML(data.provider || '')}" maxlength="120">
          </div>
          <div class="form-group">
            <label class="label">Cost (INR) <span class="optional">(optional)</span></label>
            <input type="number" class="input" id="svc-cost" placeholder="e.g. 2500" min="0" value="${data.cost ?? ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="label">Notes <span class="optional">(optional)</span></label>
          <textarea rows="2" class="input" id="svc-notes" placeholder="Additional notes…" maxlength="1000">${escapeHTML(data.notes || '')}</textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="svc-submit-btn">${isEdit ? 'Save Changes' : 'Add Record'}</button>
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('service-form-container').innerHTML=''">Cancel</button>
        </div>
      </form>
    </div>`;

  document.getElementById('service-form-inner').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('svc-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    const payload = {
      serviceDate: document.getElementById('svc-date').value,
      status: document.getElementById('svc-status').value,
      description: document.getElementById('svc-description').value,
      provider: document.getElementById('svc-provider').value,
      cost: document.getElementById('svc-cost').value === '' ? null : parseFloat(document.getElementById('svc-cost').value),
      notes: document.getElementById('svc-notes').value,
    };

    try {
      if (isEdit) {
        await API.patch(`/services/${editData._id}`, payload);
        showToast('Service record updated.');
      } else {
        await API.post(`/products/${productId}/services`, payload);
        showToast('Service record added.');
      }
      document.getElementById('service-form-container').innerHTML = '';
      loadServices(productId);
    } catch (err) {
      document.getElementById('service-form-error').innerHTML = errorAlertHTML(err.message || 'Save failed.');
      btn.disabled = false;
      btn.textContent = isEdit ? 'Save Changes' : 'Add Record';
    }
  });
}

function deleteService(serviceId, productId) {
  showConfirmDialog(
    'Delete Service Record',
    'Delete this service record? This cannot be undone.',
    'Delete',
    async () => {
      try {
        await API.delete(`/services/${serviceId}`);
        showToast('Service record deleted.');
        loadServices(productId);
      } catch (err) {
        showToast(err.message || 'Delete failed.', 'error');
      }
    }
  );
}

// ─── 404 Not Found ───
function renderNotFound() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="not-found-page">
      <div class="not-found-inner">
        <div class="not-found-icon">${ICONS.shield}</div>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
      </div>
    </div>
  `;
}

// ─── Alert HTML Helpers ───
function errorAlertHTML(message) {
  if (!message) return '';
  return `<div class="alert alert-error">${ICONS.errorCircle}<p>${escapeHTML(message)}</p></div>`;
}
function successAlertHTML(message) {
  if (!message) return '';
  return `<div class="alert alert-success">${ICONS.successCircle}<p>${escapeHTML(message)}</p></div>`;
}

// ─── Toggle Password Visibility ───
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = ICONS.eyeOff;
  } else {
    input.type = 'password';
    btn.innerHTML = ICONS.eye;
  }
}

// ─── Mobile Menu ───
function toggleMobileMenu() {
  AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
  updateMobileMenu();
}
function closeMobileMenu() {
  AppState.mobileMenuOpen = false;
  updateMobileMenu();
}
function updateMobileMenu() {
  const overlay = document.getElementById('mobile-menu-overlay');
  const btn = document.getElementById('mobile-menu-toggle');
  if (overlay) {
    if (AppState.mobileMenuOpen) {
      overlay.classList.add('open');
      if (btn) btn.innerHTML = ICONS.x;
    } else {
      overlay.classList.remove('open');
      if (btn) btn.innerHTML = ICONS.menu;
    }
  }
}

// ─── Logout ───
async function handleLogout() {
  try {
    await API.post('/auth/logout');
  } catch {
    // ignore logout errors
  }
  AppState.user = null;
  navigateTo('/login');
}

// ─── App Init ───
async function initApp() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="loading-page">
      <div class="loading-page-inner">
        <div class="spinner spinner-xl"></div>
        <p>Loading…</p>
      </div>
    </div>`;

  // Check if user is already logged in
  try {
    const res = await API.get('/auth/me');
    AppState.user = res.data.data.user;
  } catch {
    AppState.user = null;
  }

  AppState.loading = false;

  // Set default route
  if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
    window.location.hash = AppState.user ? '#/dashboard' : '#/login';
  }

  handleRouteChange();
}

// ─── Listen for hash changes ───
window.addEventListener('hashchange', handleRouteChange);

// ─── Start the app ───
document.addEventListener('DOMContentLoaded', initApp);
