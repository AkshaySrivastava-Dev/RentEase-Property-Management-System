/**
 * RentEase Message Service
 * Manages communication between Property Managers (Admin) and Tenants.
 */

const messageService = {
  getStorage() {
    return window.RentEase?.storage || storage;
  },

  getKeys() {
    return window.RentEase?.CONSTANTS?.STORAGE_KEYS || STORAGE_KEYS;
  },

  getAll() {
    return this.getStorage().getAll(this.getKeys().MESSAGES);
  },

  sendMessage({ senderId, receiverId, content }) {
    if (!senderId || !receiverId) {
      return { success: false, error: 'Sender and receiver are required.' };
    }
    if (!content || !content.trim()) {
      return { success: false, error: 'Message content cannot be empty.' };
    }

    const idGenerator = (typeof storage !== 'undefined' && storage.generateId) 
      ? storage.generateId.bind(storage) 
      : (window.RentEase?.helpers?.generateId || ((prefix = 'msg') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`));

    const newMessage = {
      id: idGenerator('msg'),
      senderId,
      receiverId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    this.getStorage().insert(this.getKeys().MESSAGES, newMessage);
    return { success: true, message: newMessage };
  },

  getConversation(user1Id, user2Id) {
    const messages = this.getAll();
    const conversation = messages.filter(
      (m) =>
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
    );

    // Sort by createdAt ascending (chronological)
    conversation.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return conversation;
  },

  markConversationAsRead(currentUserId, otherUserId) {
    const messages = this.getAll();
    let updatedCount = 0;

    messages.forEach((m) => {
      if (m.senderId === otherUserId && m.receiverId === currentUserId && !m.read) {
        m.read = true;
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      this.getStorage().set(this.getKeys().MESSAGES, messages);
    }
    return updatedCount;
  },

  getConversationsForUser(currentUserId) {
    const messages = this.getAll();
    const users = this.getStorage().getAll(this.getKeys().USERS);

    // Collect all unique partners
    const partnerIds = new Set();
    messages.forEach((m) => {
      if (m.senderId === currentUserId) partnerIds.add(m.receiverId);
      if (m.receiverId === currentUserId) partnerIds.add(m.senderId);
    });

    // If an admin, also include all tenants even if no message yet
    const currentUser = users.find((u) => u.id === currentUserId);
    if (currentUser && currentUser.role === 'admin') {
      users.filter((u) => u.role === 'tenant').forEach((t) => partnerIds.add(t.id));
    } else if (currentUser && currentUser.role === 'tenant') {
      // For tenant, ensure all admins are in the list
      users.filter((u) => u.role === 'admin').forEach((a) => partnerIds.add(a.id));
    }

    const conversations = [];
    partnerIds.forEach((pId) => {
      const partner = users.find((u) => u.id === pId);
      if (!partner) return;

      const conv = this.getConversation(currentUserId, pId);
      const lastMsg = conv.length > 0 ? conv[conv.length - 1] : null;
      const unreadCount = conv.filter((m) => m.senderId === pId && m.receiverId === currentUserId && !m.read).length;

      conversations.push({
        partner,
        lastMessage: lastMsg,
        unreadCount
      });
    });

    // Sort by last message date descending
    conversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return conversations;
  },

  getUnreadCountForUser(currentUserId) {
    const messages = this.getAll();
    return messages.filter((m) => m.receiverId === currentUserId && !m.read).length;
  }
};

messageService.send = function(data) {
  return this.sendMessage(data);
};

messageService.getMessagesBetween = function(u1, u2) {
  return this.getConversation(u1, u2);
};

messageService.getByUserId = function(userId) {
  return this.getAll().filter(m => m.senderId === userId || m.receiverId === userId);
};

const MessageService = messageService;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.messageService = messageService;
  window.MessageService = messageService;
}

if (typeof global !== 'undefined') {
  global.MessageService = messageService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.messageService = messageService;
  }
}
