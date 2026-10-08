/**
 * RentEase - Modal Component
 * Reusable modal popup manager for dialogs and dynamic forms.
 */

const Modal = {
  /**
   * Opens a modal by element ID
   * @param {string} modalId 
   */
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus first input or button
    const focusable = modal.querySelector('input, select, textarea, button:not(.btn-close)');
    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  },

  /**
   * Closes a modal by element ID
   * @param {string} modalId 
   */
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  },

  /**
   * Initializes backdrop clicks and close button triggers
   */
  init() {
    document.addEventListener('click', (e) => {
      // Handle close buttons with data-dismiss="modal"
      const closeBtn = e.target.closest('[data-dismiss="modal"], .modal-close');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal');
        if (modal) {
          Modal.close(modal.id);
        }
      }

      // Handle backdrop click
      if (e.target.classList.contains('modal') && e.target.classList.contains('is-open')) {
        Modal.close(e.target.id);
      }
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.is-open');
        if (openModal) {
          Modal.close(openModal.id);
        }
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.Modal = Modal;
  window.RentEase = window.RentEase || {};
  window.RentEase.modal = Modal;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Modal.init());
  } else {
    Modal.init();
  }
}

if (typeof global !== 'undefined') {
  global.Modal = Modal;
}

