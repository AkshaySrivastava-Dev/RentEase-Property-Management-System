/**
 * RentEase - Authentication Service
 * Handles user authentication, session state, registration, and role checks.
 */

const AuthService = {
  /**
   * Logs in a user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} { success: boolean, user?: Object, message?: string }
   */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = Storage.get(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email address or password.' };
    }

    // Clone user without sensitive password in active session
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      avatar: user.avatar || '',
      createdAt: user.createdAt
    };

    Storage.set(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return { success: true, user: sessionUser };
  },

  /**
   * Registers a new user
   * @param {Object} userData 
   * @returns {Object} { success: boolean, user?: Object, message?: string }
   */
  signup(userData) {
    const { name, email, password, role = ROLES.TENANT, phone = '' } = userData;

    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = Storage.get(STORAGE_KEYS.USERS, []);

    const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Helpers.generateId('usr'),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.TENANT,
      phone: phone.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=2563eb&color=fff`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Storage.set(STORAGE_KEYS.USERS, users);

    // Auto log-in after registration
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt
    };

    Storage.set(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return { success: true, user: sessionUser };
  },

  /**
   * Logs out current user and clears session
   */
  logout() {
    Storage.remove(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Gets the currently authenticated user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return Storage.get(STORAGE_KEYS.CURRENT_USER, null);
  },

  /**
   * Checks if user is currently logged in
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Checks if current user has Admin role
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === ROLES.ADMIN;
  },

  /**
   * Checks if current user has Tenant role
   * @returns {boolean}
   */
  isTenant() {
    const user = this.getCurrentUser();
    return user !== null && user.role === ROLES.TENANT;
  },

  /**
   * Guards a page route based on required role
   * @param {string} [requiredRole] 
   */
  requireAuth(requiredRole = null) {
    const user = this.getCurrentUser();

    if (!user) {
      const isSubdir = window.location.pathname.includes('/pages/admin/') || 
                       window.location.pathname.includes('/pages/tenant/');
      const loginPath = isSubdir ? '../login.html' : 'pages/login.html';
      window.location.href = loginPath;
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to proper role dashboard
      if (user.role === ROLES.ADMIN) {
        window.location.href = window.location.pathname.includes('/pages/') 
          ? 'admin/dashboard.html' 
          : 'pages/admin/dashboard.html';
      } else {
        window.location.href = window.location.pathname.includes('/pages/') 
          ? 'tenant/dashboard.html' 
          : 'pages/tenant/dashboard.html';
      }
      return false;
    }

    return true;
  },

  /**
   * Validates if current user possesses specified role
   * @param {string} role
   * @returns {boolean}
   */
  requireRole(role) {
    const user = this.getCurrentUser();
    if (!user || user.role !== role) {
      return false;
    }
    return true;
  }
};

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.authService = AuthService;
  window.AuthService = AuthService;
}

if (typeof global !== 'undefined') {
  global.AuthService = AuthService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.authService = AuthService;
  }
}
