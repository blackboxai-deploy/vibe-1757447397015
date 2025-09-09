import { User, Message, ChatRoom } from '@/types/chat';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://placehold.co/200x200?text=Professional+woman+with+brown+hair+smiling+headshot+portrait',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://placehold.co/200x200?text=Professional+man+with+glasses+business+headshot+portrait',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://placehold.co/200x200?text=Young+woman+with+blonde+hair+friendly+smile+portrait',
    status: 'away',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://placehold.co/200x200?text=Man+with+beard+casual+shirt+professional+headshot',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '5',
    name: 'Emma Thompson',
    avatar: 'https://placehold.co/200x200?text=Woman+with+red+hair+bright+smile+professional+photo',
    status: 'online',
    lastSeen: new Date(),
  },
];

export const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion for everyone',
    participants: mockUsers,
    unreadCount: 0,
    createdAt: new Date('2024-01-01'),
    type: 'public',
    avatar: 'https://placehold.co/200x200?text=General+chat+room+icon+with+people+group',
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Discussions about technology and programming',
    participants: [mockUsers[0], mockUsers[1], mockUsers[3], mockUsers[4]],
    unreadCount: 2,
    createdAt: new Date('2024-01-02'),
    type: 'public',
    avatar: 'https://placehold.co/200x200?text=Technology+programming+code+laptop+workspace+icon',
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Random thoughts and casual conversations',
    participants: [mockUsers[0], mockUsers[2], mockUsers[4]],
    unreadCount: 0,
    createdAt: new Date('2024-01-03'),
    type: 'public',
    avatar: 'https://placehold.co/200x200?text=Random+casual+fun+colorful+chat+bubble+icon',
  },
  {
    id: 'project-alpha',
    name: 'Project Alpha',
    description: 'Private discussion for Project Alpha team',
    participants: [mockUsers[0], mockUsers[1]],
    unreadCount: 1,
    createdAt: new Date('2024-01-04'),
    type: 'private',
    avatar: 'https://placehold.co/200x200?text=Project+alpha+team+collaboration+workspace+icon',
  },
];

export const mockMessages: Record<string, Message[]> = {
  'general': [
    {
      id: 'msg1',
      content: 'Hey everyone! How\'s your day going?',
      senderId: '2',
      senderName: 'Bob Smith',
      senderAvatar: mockUsers[1].avatar,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      roomId: 'general',
      type: 'text',
      reactions: [
        { emoji: '👋', userId: '1', userName: 'Alice Johnson' },
        { emoji: '😊', userId: '5', userName: 'Emma Thompson' },
      ],
    },
    {
      id: 'msg2',
      content: 'Pretty good! Just finished a big presentation at work.',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 1h55m ago
      roomId: 'general',
      type: 'text',
    },
    {
      id: 'msg3',
      content: 'Congratulations! 🎉',
      senderId: '5',
      senderName: 'Emma Thompson',
      senderAvatar: mockUsers[4].avatar,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 7 * 60 * 1000), // 1h53m ago
      roomId: 'general',
      type: 'text',
      reactions: [
        { emoji: '🎉', userId: '1', userName: 'Alice Johnson' },
        { emoji: '👏', userId: '2', userName: 'Bob Smith' },
      ],
    },
    {
      id: 'msg4',
      content: 'Anyone up for a coffee break? ☕',
      senderId: '3',
      senderName: 'Carol Davis',
      senderAvatar: mockUsers[2].avatar,
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      roomId: 'general',
      type: 'text',
    },
    {
      id: 'msg5',
      content: 'I\'d love to join! Where are we meeting?',
      senderId: '5',
      senderName: 'Emma Thompson',
      senderAvatar: mockUsers[4].avatar,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      roomId: 'general',
      type: 'text',
    },
  ],
  'tech-talk': [
    {
      id: 'msg6',
      content: 'Has anyone tried the new React 19 features yet?',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      roomId: 'tech-talk',
      type: 'text',
    },
    {
      id: 'msg7',
      content: 'Yes! The new compiler optimizations are impressive. Performance has improved significantly in our app.',
      senderId: '4',
      senderName: 'David Wilson',
      senderAvatar: mockUsers[3].avatar,
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
      roomId: 'tech-talk',
      type: 'text',
    },
    {
      id: 'msg8',
      content: 'I\'m particularly excited about the new Actions API. Makes server interactions so much cleaner.',
      senderId: '5',
      senderName: 'Emma Thompson',
      senderAvatar: mockUsers[4].avatar,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      roomId: 'tech-talk',
      type: 'text',
      reactions: [
        { emoji: '🚀', userId: '1', userName: 'Alice Johnson' },
        { emoji: '💯', userId: '4', userName: 'David Wilson' },
      ],
    },
    {
      id: 'msg9',
      content: 'Quick question: has anyone encountered issues with the new concurrent features in production?',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      roomId: 'tech-talk',
      type: 'text',
    },
    {
      id: 'msg10',
      content: 'We had some hydration issues initially, but they were resolved after updating our SSR setup.',
      senderId: '2',
      senderName: 'Bob Smith',
      senderAvatar: mockUsers[1].avatar,
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      roomId: 'tech-talk',
      type: 'text',
    },
  ],
  'random': [
    {
      id: 'msg11',
      content: 'Just watched the most amazing sunset! 🌅',
      senderId: '3',
      senderName: 'Carol Davis',
      senderAvatar: mockUsers[2].avatar,
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      roomId: 'random',
      type: 'text',
      reactions: [
        { emoji: '🌅', userId: '5', userName: 'Emma Thompson' },
        { emoji: '😍', userId: '1', userName: 'Alice Johnson' },
      ],
    },
    {
      id: 'msg12',
      content: 'I love how the colors change during golden hour. Nature\'s best show!',
      senderId: '5',
      senderName: 'Emma Thompson',
      senderAvatar: mockUsers[4].avatar,
      timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
      roomId: 'random',
      type: 'text',
    },
    {
      id: 'msg13',
      content: 'Random thought: Why do we say "after dark" when it\'s actually "during dark"? 🤔',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      roomId: 'random',
      type: 'text',
      reactions: [
        { emoji: '🤯', userId: '3', userName: 'Carol Davis' },
        { emoji: '😂', userId: '5', userName: 'Emma Thompson' },
      ],
    },
  ],
  'project-alpha': [
    {
      id: 'msg14',
      content: 'The latest design mockups look great! When can we start the implementation phase?',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      roomId: 'project-alpha',
      type: 'text',
    },
    {
      id: 'msg15',
      content: 'Thanks! I think we can kick off development next Monday. The API specs are almost finalized.',
      senderId: '2',
      senderName: 'Bob Smith',
      senderAvatar: mockUsers[1].avatar,
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
      roomId: 'project-alpha',
      type: 'text',
    },
    {
      id: 'msg16',
      content: 'Perfect! I\'ll prepare the development environment over the weekend.',
      senderId: '1',
      senderName: 'Alice Johnson',
      senderAvatar: mockUsers[0].avatar,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      roomId: 'project-alpha',
      type: 'text',
      reactions: [
        { emoji: '👍', userId: '2', userName: 'Bob Smith' },
      ],
    },
    {
      id: 'msg17',
      content: 'Should we schedule a kick-off meeting for Monday morning?',
      senderId: '2',
      senderName: 'Bob Smith',
      senderAvatar: mockUsers[1].avatar,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      roomId: 'project-alpha',
      type: 'text',
    },
  ],
};

// Current user (can be switched)
export const getCurrentUser = (): User => mockUsers[0]; // Alice Johnson

// Utility function to get random responses
export const getRandomResponse = (excludeUserId: string): { user: User; message: string } => {
  const availableUsers = mockUsers.filter(user => user.id !== excludeUserId && user.status === 'online');
  const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
  
  const responses = [
    "That's interesting! Tell me more.",
    "I completely agree with you.",
    "Thanks for sharing that!",
    "Interesting perspective 🤔",
    "I had a similar experience recently.",
    "That sounds awesome! 😄",
    "Good point!",
    "I'll have to try that sometime.",
    "Thanks for the tip!",
    "That makes sense.",
  ];
  
  const randomMessage = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    user: randomUser,
    message: randomMessage,
  };
};