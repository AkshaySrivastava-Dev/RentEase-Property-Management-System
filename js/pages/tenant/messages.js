/**
 * RentEase - Tenant Messages Controller
 * Manages direct, isolated messaging between the authenticated resident and property management.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Tenant role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'messages');

  const tenant = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!tenant) return;

  const messagesContainer = document.getElementById('tenant-messages-container');
  const sendForm = document.getElementById('tenant-send-form');
  const messageInput = document.getElementById('tenant-message-input');
  const conversationsList = document.getElementById('tenant-conversations-list');
  const chatHeader = document.getElementById('tenant-active-chat-header');
  const unreadBadge = document.getElementById('tenant-unread-badge');

  // Find Admin user (property manager)
  const users = (typeof Storage !== 'undefined') ? Storage.get(STORAGE_KEYS.USERS, []) : [];
  const admin = users.find(u => u.role === ROLES.ADMIN) || {
    id: 'usr_admin_1',
    name: 'Sarah Jenkins (Property Manager)',
    role: 'admin'
  };

  let activeContactId = admin.id;

  renderContactsList();
  renderChatHeader();
  renderMessages();

  // Handle Send Message Form Submission
  if (sendForm) {
    sendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = messageInput ? messageInput.value.trim() : '';
      if (!content) return;

      if (typeof MessageService !== 'undefined') {
        MessageService.sendMessage({
          senderId: tenant.id,
          receiverId: activeContactId,
          content: content
        });
      }

      if (messageInput) messageInput.value = '';
      renderMessages();
      renderContactsList();
    });
  }

  function renderContactsList() {
    if (!conversationsList) return;

    const allAdminUsers = users.filter(u => u.role === ROLES.ADMIN);
    const contacts = allAdminUsers.length > 0 ? allAdminUsers : [admin];

    conversationsList.innerHTML = contacts.map(c => {
      const isActive = c.id === activeContactId;
      const conversation = (typeof MessageService !== 'undefined') 
        ? MessageService.getConversation(tenant.id, c.id) 
        : [];
      const lastMsg = conversation.length > 0 ? conversation[conversation.length - 1] : null;
      const unreadCount = conversation.filter(m => m.senderId === c.id && m.receiverId === tenant.id && !m.read).length;

      return `
        <div class="chat-conv-item ${isActive ? 'active' : ''}" data-id="${c.id}" style="padding: 12px 14px; border-bottom: 1px solid var(--color-border); cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background 150ms ease; ${isActive ? 'background: var(--color-surface-hover); border-left: 3px solid var(--color-primary);' : ''}">
          <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">
              ${c.name.charAt(0)}
            </div>
            <div style="overflow: hidden;">
              <div style="font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${c.name}
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${lastMsg ? lastMsg.content : 'Property Management Office'}
              </div>
            </div>
          </div>
          ${unreadCount > 0 ? `<span class="badge badge-info" style="font-size: 0.7rem; padding: 2px 6px;">${unreadCount}</span>` : ''}
        </div>
      `;
    }).join('');

    conversationsList.querySelectorAll('.chat-conv-item').forEach(item => {
      item.addEventListener('click', () => {
        activeContactId = item.getAttribute('data-id');
        renderChatHeader();
        renderMessages();
        renderContactsList();
      });
    });
  }

  function renderChatHeader() {
    if (!chatHeader) return;
    const contact = users.find(u => u.id === activeContactId) || admin;

    chatHeader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">
          ${contact.name.charAt(0)}
        </div>
        <div>
          <strong style="font-size: var(--font-size-base); color: var(--color-text-primary); display: block;">
            ${contact.name}
          </strong>
          <span style="font-size: var(--font-size-xs); color: var(--color-success); display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-success); display: inline-block;"></span> Property Manager • Online
          </span>
        </div>
      </div>
    `;
  }

  function renderMessages() {
    if (!messagesContainer) return;

    if (typeof MessageService !== 'undefined') {
      MessageService.markConversationAsRead(tenant.id, activeContactId);
    }

    const messages = (typeof MessageService !== 'undefined') 
      ? MessageService.getConversation(tenant.id, activeContactId) 
      : [];

    if (messages.length === 0) {
      messagesContainer.innerHTML = `
        <div style="margin: auto; text-align: center; color: var(--color-text-secondary); padding: 3rem 1rem;">
          <div style="margin-bottom: 8px; color: var(--color-text-muted);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: var(--color-text-primary);">Direct Manager Channel</h4>
          <p style="font-size: 0.85rem; max-width: 320px; margin: 0 auto;">Send a message to your property manager regarding maintenance, payments, or lease notices.</p>
        </div>
      `;
      return;
    }

    messagesContainer.innerHTML = messages.map(m => {
      const isMine = m.senderId === tenant.id;

      return `
        <div style="display: flex; justify-content: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 12px;">
          <div style="max-width: 72%; padding: 10px 14px; border-radius: var(--radius-lg); ${isMine ? 'background-color: var(--color-primary); color: #ffffff;' : 'background-color: var(--color-surface); color: var(--color-text-primary); border: 1px solid var(--color-border);'} box-shadow: var(--shadow-sm);">
            <div style="font-size: var(--font-size-sm); line-height: 1.45; word-break: break-word;">
              ${m.content}
            </div>
            <div style="font-size: 0.65rem; color: ${isMine ? 'rgba(255,255,255,0.75)' : 'var(--color-text-secondary)'}; text-align: right; margin-top: 4px;">
              ${Formatters.time(m.createdAt)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
