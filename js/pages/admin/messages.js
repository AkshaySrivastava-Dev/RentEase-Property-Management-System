/**
 * RentEase - Admin Messages Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!AuthService.requireAuth(ROLES.ADMIN)) return;

  Navbar.render('#app-header');
  Sidebar.render('#app-sidebar', 'messages');

  const currentUser = AuthService.getCurrentUser();
  const tenantsListContainer = document.getElementById('chat-conversations-list');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatHeaderName = document.getElementById('active-chat-user-name');

  const urlParams = new URLSearchParams(window.location.search);
  let activeTenantId = urlParams.get('tenantId') || null;

  initChat();

  function initChat() {
    const tenants = TenantService.getAll();
    if (tenants.length === 0) {
      if (tenantsListContainer) {
        tenantsListContainer.innerHTML = '<div style="padding: 1rem; color: var(--color-gray-500); font-size: var(--font-sm);">No registered residents to message.</div>';
      }
      return;
    }

    if (!activeTenantId && tenants.length > 0) {
      activeTenantId = tenants[0].id;
    }

    renderTenantList(tenants);
    renderConversation();
  }

  function renderTenantList(tenants) {
    if (!tenantsListContainer) return;

    tenantsListContainer.innerHTML = tenants.map(t => {
      const isActive = t.id === activeTenantId;
      const unreadCount = MessageService.getUnreadCount(currentUser.id, t.id);
      return `
        <div class="chat-contact-item ${isActive ? 'active' : ''}" data-id="${t.id}" style="padding: 0.75rem 1rem; display: flex; align-items: center; gap: 10px; cursor: pointer; border-bottom: 1px solid var(--color-gray-100); background-color: ${isActive ? 'var(--color-primary-subtle)' : 'transparent'};">
          <img src="${t.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.name)}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: var(--font-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.name}</div>
            <div style="font-size: var(--font-xs); color: var(--color-gray-500);">${t.email}</div>
          </div>
          ${unreadCount > 0 ? `<span class="badge badge-danger" style="border-radius: 9999px;">${unreadCount}</span>` : ''}
        </div>
      `;
    }).join('');

    tenantsListContainer.querySelectorAll('.chat-contact-item').forEach(el => {
      el.addEventListener('click', () => {
        activeTenantId = el.getAttribute('data-id');
        renderTenantList(tenants);
        renderConversation();
      });
    });
  }

  function renderConversation() {
    if (!activeTenantId || !chatMessagesContainer) return;

    const tenant = TenantService.getById(activeTenantId);
    if (chatHeaderName) {
      chatHeaderName.textContent = tenant ? tenant.name : 'Resident Chat';
    }

    MessageService.markConversationAsRead(currentUser.id, activeTenantId);

    const messages = MessageService.getConversation(currentUser.id, activeTenantId);

    if (messages.length === 0) {
      chatMessagesContainer.innerHTML = `
        <div style="margin: auto; text-align: center; color: var(--color-text-secondary); padding: 2rem;">
          <div style="margin-bottom: 8px; color: var(--color-text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>No messages yet with this resident. Send a greeting!</div>
        </div>
      `;
      return;
    }

    chatMessagesContainer.innerHTML = messages.map(m => {
      const isMine = m.senderId === currentUser.id;
      return `
        <div style="display: flex; justify-content: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 0.75rem;">
          <div style="max-width: 70%; padding: 0.625rem 0.875rem; border-radius: var(--radius-lg); background-color: ${isMine ? 'var(--color-primary)' : 'var(--color-white)'}; color: ${isMine ? 'var(--color-white)' : 'var(--color-gray-800)'}; box-shadow: var(--shadow-sm); border: ${isMine ? 'none' : '1px solid var(--color-gray-200)'};">
            <div style="font-size: var(--font-sm); line-height: 1.4;">${m.content}</div>
            <div style="font-size: 0.65rem; color: ${isMine ? 'rgba(255,255,255,0.7)' : 'var(--color-gray-400)'}; text-align: right; margin-top: 4px;">
              ${Formatters.time(m.createdAt)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text || !activeTenantId) return;

      MessageService.send({
        senderId: currentUser.id,
        receiverId: activeTenantId,
        content: text
      });

      chatInput.value = '';
      renderConversation();
    });
  }
});

