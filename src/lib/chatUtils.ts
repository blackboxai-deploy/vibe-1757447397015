import { Message, User } from '@/types/chat';

export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // More than 7 days, show full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const formatDetailedTimestamp = (date: Date): string => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Active now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Active ${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Active ${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Active ${days}d ago`;
  }
  
  return `Last seen ${date.toLocaleDateString()}`;
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateRoomId = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

export const shouldShowTimestamp = (currentMessage: Message, previousMessage?: Message): boolean => {
  if (!previousMessage) return true;
  
  const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
  const fiveMinutes = 5 * 60 * 1000;
  
  return timeDiff > fiveMinutes || currentMessage.senderId !== previousMessage.senderId;
};

export const shouldShowAvatar = (currentMessage: Message, nextMessage?: Message): boolean => {
  if (!nextMessage) return true;
  
  return currentMessage.senderId !== nextMessage.senderId;
};

export const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  const grouped: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const dateKey = message.timestamp.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });
  
  return grouped;
};

export const getDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

export const isValidMessageContent = (content: string): boolean => {
  return content.trim().length > 0 && content.trim().length <= 2000;
};

export const containsOnlyEmoji = (content: string): boolean => {
  const emojiRegex = /^[\p{Emoji}\s]+$/u;
  return emojiRegex.test(content.trim());
};

export const getUserStatusColor = (status: User['status']): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export const getUserStatusText = (status: User['status']): string => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Away';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
};

export const searchMessages = (messages: Message[], query: string): Message[] => {
  if (!query.trim()) return messages;
  
  const lowercaseQuery = query.toLowerCase();
  return messages.filter(message => 
    message.content.toLowerCase().includes(lowercaseQuery) ||
    message.senderName.toLowerCase().includes(lowercaseQuery)
  );
};

export const scrollToBottom = (element: HTMLElement | null, smooth = true) => {
  if (!element) return;
  
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};