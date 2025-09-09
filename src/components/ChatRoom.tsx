'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import TypingIndicator from '@/components/TypingIndicator';
import UserList from '@/components/UserList';
import useChatStore from '@/lib/chatStore';
import { formatDetailedTimestamp } from '@/lib/chatUtils';

export default function ChatRoom() {
  const { currentRoom, users } = useChatStore();
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when room changes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentRoom]);

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/40"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Welcome to Chat App
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Select a room from the sidebar to start chatting with your team members. 
            Create new rooms or join existing conversations.
          </p>
        </div>
      </div>
    );
  }

  const onlineUsersCount = currentRoom.participants.filter(user => 
    users.find(u => u.id === user.id)?.status === 'online'
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-10 h-10">
              {currentRoom.avatar ? (
                <AvatarImage src={currentRoom.avatar} alt={currentRoom.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  {currentRoom.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            {currentRoom.type === 'private' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>
          
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <span>{currentRoom.name}</span>
              <Badge variant={currentRoom.type === 'private' ? 'secondary' : 'outline'} className="text-xs">
                {currentRoom.type}
              </Badge>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentRoom.description} • {onlineUsersCount} online, {currentRoom.participants.length} members
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Created {formatDetailedTimestamp(currentRoom.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUserListVisible(!isUserListVisible)}
            className="relative"
          >
            <span className="text-sm">Members</span>
            {onlineUsersCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5 h-5">
                {onlineUsersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>

          {/* Typing Indicator */}
          <TypingIndicator roomId={currentRoom.id} />

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <MessageInput roomId={currentRoom.id} />
          </div>
        </div>

        {/* User List Sidebar */}
        {isUserListVisible && (
          <div className="w-64 border-l border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <UserList 
              users={currentRoom.participants} 
              onClose={() => setIsUserListVisible(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}