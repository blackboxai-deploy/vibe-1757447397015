'use client';

import { useEffect } from 'react';
import ChatRoom from '@/components/ChatRoom';
import ChatSidebar from '@/components/ChatSidebar';
import useChatStore from '@/lib/chatStore';

export default function ChatApp() {
  const { initialize, isLoading } = useChatStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Chat App
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 shadow-lg">
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <ChatRoom />
      </div>
    </div>
  );
}