/**
 * RentEase Formatters
 */
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '';
  }
};

const getStatusBadge = (status) => {
  if (!status) return '';
  const s = String(status).toLowerCase();
  let badgeClass = 'badge-neutral';

  if (['paid', 'active', 'available', 'resolved'].includes(s)) {
    badgeClass = 'badge-success';
  } else if (['pending', 'upcoming', 'in progress'].includes(s)) {
    badgeClass = 'badge-warning';
  } else if (['overdue', 'expired', 'urgent', 'danger', 'open'].includes(s)) {
    badgeClass = 'badge-danger';
  } else if (['occupied', 'medium', 'high', 'maintenance', 'info'].includes(s)) {
    badgeClass = 'badge-info';
  }

  return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${status}</span>`;
};

window.RentEase = window.RentEase || {};
window.RentEase.formatters = {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  getStatusBadge
};

const Formatters = {
  ...window.RentEase.formatters,
  currency: formatCurrency,
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  relativeTime: (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffSecs = Math.floor((now - d) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch (e) {
      return formatDate(dateStr);
    }
  }
};

if (typeof window !== 'undefined') {
  window.Formatters = Formatters;
}
if (typeof global !== 'undefined') {
  global.Formatters = Formatters;
}
