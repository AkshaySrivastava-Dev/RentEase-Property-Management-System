/**
 * RentEase Storage Abstraction Layer
 * Centralized, safe localStorage interaction
 */

const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.error(`Storage error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage error writing key "${key}":`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`Storage error removing key "${key}":`, err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error('Storage error clearing localStorage:', err);
      return false;
    }
  },

  has(key) {
    return localStorage.getItem(key) !== null;
  },

  // Helper collection operations
  getAll(key) {
    const list = this.get(key, []);
    return Array.isArray(list) ? list : [];
  },

  getById(key, id) {
    const list = this.getAll(key);
    return list.find((item) => String(item.id) === String(id)) || null;
  },

  insert(key, item) {
    const list = this.getAll(key);
    list.unshift(item); // insert at top
    this.set(key, list);
    return item;
  },

  update(key, id, updates) {
    const list = this.getAll(key);
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    this.set(key, list);
    return list[index];
  },

  delete(key, id) {
    const list = this.getAll(key);
    const filtered = list.filter((item) => String(item.id) !== String(id));
    this.set(key, filtered);
    return filtered.length < list.length;
  },

  query(key, filterFn) {
    const list = this.getAll(key);
    if (typeof filterFn !== 'function') return list;
    return list.filter(filterFn);
  }
};

const Storage = storage;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.storage = storage;
  window.Storage = storage;
  window.storage = storage;
}

if (typeof global !== 'undefined') {
  global.Storage = storage;
  global.storage = storage;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.storage = storage;
  }
}
