import { Message, ChatRoom, User, SendMessageData, CreateRoomData } from '@/types/chat';

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

interface MessagesResponse {
  messages: Message[];
  totalMessages: number;
  hasMore: boolean;
}

interface RoomsResponse {
  rooms: ChatRoom[];
  totalRooms: number;
}

interface UsersResponse {
  users: User[];
  totalUsers: number;
  onlineCount: number;
  awayCount: number;
  offlineCount: number;
}

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Messages API
export const messagesApi = {
  // Get messages for a room
  getMessages: async (roomId: string, limit = 50, offset = 0): Promise<MessagesResponse> => {
    return apiRequest<MessagesResponse>(
      `/api/messages?roomId=${roomId}&limit=${limit}&offset=${offset}`
    );
  },

  // Send a new message
  sendMessage: async (messageData: SendMessageData & {
    senderId: string;
    senderName: string;
    senderAvatar: string;
  }): Promise<{ success: boolean; message: Message; autoResponse?: string }> => {
    return apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Add/remove reaction to a message
  toggleReaction: async (
    messageId: string,
    roomId: string,
    emoji: string,
    userId: string,
    userName: string,
    action: 'add' | 'remove' | 'toggle' = 'toggle'
  ): Promise<{ success: boolean; message: Message; action: 'added' | 'removed' }> => {
    return apiRequest('/api/messages', {
      method: 'PUT',
      body: JSON.stringify({
        messageId,
        roomId,
        emoji,
        userId,
        userName,
        action,
      }),
    });
  },
};

// Rooms API
export const roomsApi = {
  // Get all rooms
  getRooms: async (filters?: {
    userId?: string;
    search?: string;
    type?: 'public' | 'private' | 'group';
  }): Promise<RoomsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/rooms?${queryString}` : '/api/rooms';
    
    return apiRequest<RoomsResponse>(endpoint);
  },

  // Create a new room
  createRoom: async (roomData: CreateRoomData & {
    creatorId: string;
  }): Promise<{ success: boolean; room: ChatRoom; message: string }> => {
    return apiRequest('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  // Update room settings
  updateRoom: async (
    roomId: string,
    updates: {
      name?: string;
      description?: string;
      participants?: string[];
    },
    userId: string
  ): Promise<{ success: boolean; room: ChatRoom; message: string }> => {
    return apiRequest('/api/rooms', {
      method: 'PUT',
      body: JSON.stringify({
        roomId,
        userId,
        ...updates,
      }),
    });
  },

  // Delete a room
  deleteRoom: async (roomId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/api/rooms?roomId=${roomId}&userId=${userId}`, {
      method: 'DELETE',
    });
  },
};

// Users API
export const usersApi = {
  // Get all users
  getUsers: async (filters?: {
    status?: User['status'];
    search?: string;
  }): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/users?${queryString}` : '/api/users';
    
    return apiRequest<UsersResponse>(endpoint);
  },

  // Create a new user
  createUser: async (userData: {
    name: string;
    avatar?: string;
    status?: User['status'];
  }): Promise<{ success: boolean; user: User; message: string }> => {
    return apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user profile/status
  updateUser: async (
    userId: string,
    updates: {
      name?: string;
      status?: User['status'];
      avatar?: string;
    }
  ): Promise<{ success: boolean; user: User; message: string }> => {
    return apiRequest('/api/users', {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        ...updates,
      }),
    });
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<{ user: User }> => {
    return apiRequest(`/api/users/${userId}`);
  },

  // Delete user
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/api/users?userId=${userId}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions for real-time features (in a real app, these would use WebSockets)
export const realtimeApi = {
  // Simulate typing indicator
  startTyping: (roomId: string, userId: string): void => {
    // In a real app, this would send a WebSocket message
    console.log(`User ${userId} started typing in room ${roomId}`);
  },

  stopTyping: (roomId: string, userId: string): void => {
    // In a real app, this would send a WebSocket message
    console.log(`User ${userId} stopped typing in room ${roomId}`);
  },

  // Simulate user presence updates
  updatePresence: (userId: string, status: User['status']): void => {
    // In a real app, this would send a WebSocket message
    console.log(`User ${userId} status changed to ${status}`);
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    return apiRequest('/api/health');
  },
};

// Export all APIs
export const api = {
  messages: messagesApi,
  rooms: roomsApi,
  users: usersApi,
  realtime: realtimeApi,
  health: healthApi,
};