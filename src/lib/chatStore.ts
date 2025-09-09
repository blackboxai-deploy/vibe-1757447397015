'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatState, Message, ChatRoom, User, TypingUser, SendMessageData } from '@/types/chat';
import { mockUsers, mockRooms, mockMessages, getCurrentUser, getRandomResponse } from './mockData';
import { generateMessageId } from './chatUtils';

interface ChatActions {
  // User actions
  setCurrentUser: (user: User) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  
  // Room actions
  setCurrentRoom: (room: ChatRoom | null) => void;
  createRoom: (roomData: { name: string; description: string; type: 'public' | 'private' | 'group' }) => void;
  
  // Message actions
  sendMessage: (data: SendMessageData) => void;
  addMessage: (message: Message) => void;
  addReaction: (messageId: string, roomId: string, emoji: string) => void;
  removeReaction: (messageId: string, roomId: string, emoji: string) => void;
  
  // Typing actions
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  addTypingUser: (typingUser: TypingUser) => void;
  removeTypingUser: (userId: string, roomId: string) => void;
  
  // Utility actions
  markRoomAsRead: (roomId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Initialize
  initialize: () => void;
}

const useChatStore = create<ChatState & ChatActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentUser: null,
      currentRoom: null,
      rooms: [],
      messages: {},
      users: [],
      typingUsers: [],
      isLoading: false,
      error: null,
      
      // Initialize the store
      initialize: () => {
        set({
          currentUser: getCurrentUser(),
          rooms: mockRooms,
          messages: mockMessages,
          users: mockUsers,
          currentRoom: mockRooms[0], // Start with General room
        });
      },
      
      // User actions
      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },
      
      updateUserStatus: (userId: string, status: User['status']) => {
        set(state => ({
          users: state.users.map(user =>
            user.id === userId ? { ...user, status, lastSeen: new Date() } : user
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, status, lastSeen: new Date() }
            : state.currentUser,
        }));
      },
      
      // Room actions
      setCurrentRoom: (room: ChatRoom | null) => {
        set({ currentRoom: room });
        if (room) {
          get().markRoomAsRead(room.id);
        }
      },
      
      createRoom: (roomData) => {
        const newRoom: ChatRoom = {
          id: roomData.name.toLowerCase().replace(/\s+/g, '-'),
          name: roomData.name,
          description: roomData.description,
          participants: [get().currentUser!],
          unreadCount: 0,
          createdAt: new Date(),
          type: roomData.type,
        };
        
        set(state => ({
          rooms: [...state.rooms, newRoom],
          messages: { ...state.messages, [newRoom.id]: [] },
        }));
      },
      
      // Message actions
      sendMessage: (data: SendMessageData) => {
        const state = get();
        const currentUser = state.currentUser;
        if (!currentUser) return;
        
        const newMessage: Message = {
          id: generateMessageId(),
          content: data.content,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          timestamp: new Date(),
          roomId: data.roomId,
          type: data.type || 'text',
          reactions: [],
        };
        
        get().addMessage(newMessage);
        get().stopTyping(data.roomId);
        
        // Simulate responses from other users (30% chance)
        if (Math.random() < 0.3) {
          setTimeout(() => {
            const { user, message } = getRandomResponse(currentUser.id);
            const responseMessage: Message = {
              id: generateMessageId(),
              content: message,
              senderId: user.id,
              senderName: user.name,
              senderAvatar: user.avatar,
              timestamp: new Date(),
              roomId: data.roomId,
              type: 'text',
              reactions: [],
            };
            get().addMessage(responseMessage);
          }, Math.random() * 3000 + 1000); // 1-4 seconds delay
        }
      },
      
      addMessage: (message: Message) => {
        set(state => ({
          messages: {
            ...state.messages,
            [message.roomId]: [...(state.messages[message.roomId] || []), message],
          },
          rooms: state.rooms.map(room =>
            room.id === message.roomId
              ? {
                  ...room,
                  lastMessage: message,
                  unreadCount: room.id === state.currentRoom?.id ? 0 : room.unreadCount + 1,
                }
              : room
          ),
        }));
      },
      
      addReaction: (messageId: string, roomId: string, emoji: string) => {
        const state = get();
        const currentUser = state.currentUser;
        if (!currentUser) return;
        
        set(state => ({
          messages: {
            ...state.messages,
            [roomId]: state.messages[roomId]?.map(message => {
              if (message.id === messageId) {
                const existingReaction = message.reactions?.find(
                  r => r.emoji === emoji && r.userId === currentUser.id
                );
                
                if (existingReaction) {
                  // Remove existing reaction
                  return {
                    ...message,
                    reactions: message.reactions?.filter(
                      r => !(r.emoji === emoji && r.userId === currentUser.id)
                    ),
                  };
                } else {
                  // Add new reaction
                  return {
                    ...message,
                    reactions: [
                      ...(message.reactions || []),
                      {
                        emoji,
                        userId: currentUser.id,
                        userName: currentUser.name,
                      },
                    ],
                  };
                }
              }
              return message;
            }) || [],
          },
        }));
      },
      
      removeReaction: (messageId: string, roomId: string, emoji: string) => {
        const state = get();
        const currentUser = state.currentUser;
        if (!currentUser) return;
        
        set(state => ({
          messages: {
            ...state.messages,
            [roomId]: state.messages[roomId]?.map(message =>
              message.id === messageId
                ? {
                    ...message,
                    reactions: message.reactions?.filter(
                      r => !(r.emoji === emoji && r.userId === currentUser.id)
                    ),
                  }
                : message
            ) || [],
          },
        }));
      },
      
      // Typing actions
      startTyping: (roomId: string) => {
        const state = get();
        const currentUser = state.currentUser;
        if (!currentUser) return;
        
        const typingUser: TypingUser = {
          userId: currentUser.id,
          userName: currentUser.name,
          roomId,
          timestamp: new Date(),
        };
        
        get().addTypingUser(typingUser);
      },
      
      stopTyping: (roomId: string) => {
        const state = get();
        const currentUser = state.currentUser;
        if (!currentUser) return;
        
        get().removeTypingUser(currentUser.id, roomId);
      },
      
      addTypingUser: (typingUser: TypingUser) => {
        set(state => {
          const existing = state.typingUsers.find(
            t => t.userId === typingUser.userId && t.roomId === typingUser.roomId
          );
          
          if (existing) {
            return {
              typingUsers: state.typingUsers.map(t =>
                t.userId === typingUser.userId && t.roomId === typingUser.roomId
                  ? { ...t, timestamp: typingUser.timestamp }
                  : t
              ),
            };
          }
          
          return {
            typingUsers: [...state.typingUsers, typingUser],
          };
        });
      },
      
      removeTypingUser: (userId: string, roomId: string) => {
        set(state => ({
          typingUsers: state.typingUsers.filter(
            t => !(t.userId === userId && t.roomId === roomId)
          ),
        }));
      },
      
      // Utility actions
      markRoomAsRead: (roomId: string) => {
        set(state => ({
          rooms: state.rooms.map(room =>
            room.id === roomId ? { ...room, unreadCount: 0 } : room
          ),
        }));
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'chat-store',
    }
  )
);

// Auto-cleanup typing indicators
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { typingUsers, removeTypingUser } = useChatStore.getState();
    const now = Date.now();
    
    typingUsers.forEach(typingUser => {
      const timeSinceLastType = now - typingUser.timestamp.getTime();
      // Remove typing indicator after 3 seconds of inactivity
      if (timeSinceLastType > 3000) {
        removeTypingUser(typingUser.userId, typingUser.roomId);
      }
    });
  }, 1000);
}

export default useChatStore;