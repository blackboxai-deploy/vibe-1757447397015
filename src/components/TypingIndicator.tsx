'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useChatStore from '@/lib/chatStore';

interface TypingIndicatorProps {
  roomId: string;
}

export default function TypingIndicator({ roomId }: TypingIndicatorProps) {
  const { typingUsers, currentUser } = useChatStore();

  const roomTypingUsers = typingUsers.filter(
    tu => tu.roomId === roomId && tu.userId !== currentUser?.id
  );

  if (roomTypingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    const count = roomTypingUsers.length;
    const names = roomTypingUsers.map(tu => tu.userName);

    if (count === 1) {
      return `${names[0]} is typing...`;
    } else if (count === 2) {
      return `${names[0]} and ${names[1]} are typing...`;
    } else if (count === 3) {
      return `${names[0]}, ${names[1]}, and ${names[2]} are typing...`;
    } else {
      return `${names[0]}, ${names[1]}, and ${count - 2} others are typing...`;
    }
  };

  return (
    <div className="px-4 py-2 flex items-center space-x-2 animate-pulse">
      <div className="flex -space-x-1">
        {roomTypingUsers.slice(0, 3).map((typingUser) => (
          <Avatar key={typingUser.userId} className="w-6 h-6 border-2 border-white dark:border-gray-800">
            <AvatarImage 
              src={`https://placehold.co/200x200?text=${encodeURIComponent(typingUser.userName.charAt(0))}`} 
              alt={typingUser.userName} 
            />
            <AvatarFallback className="text-xs">
              {typingUser.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {getTypingText()}
        </span>
        
        {/* Animated typing dots */}
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}