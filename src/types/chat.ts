export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  roomId: string;
  type: 'text' | 'system' | 'file' | 'emoji';
  reactions?: MessageReaction[];
  edited?: boolean;
  editedAt?: Date;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  type: 'public' | 'private' | 'group';
  avatar?: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
  roomId: string;
  timestamp: Date;
}

export interface ChatState {
  currentUser: User | null;
  currentRoom: ChatRoom | null;
  rooms: ChatRoom[];
  messages: Record<string, Message[]>;
  users: User[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageData {
  content: string;
  roomId: string;
  type?: 'text' | 'emoji';
}

export interface CreateRoomData {
  name: string;
  description: string;
  type: 'public' | 'private' | 'group';
  participants?: string[];
}

export interface UpdateUserData {
  name?: string;
  status?: 'online' | 'away' | 'offline';
  avatar?: string;
}