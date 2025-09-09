'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MessageBubble from '@/components/MessageBubble';
import useChatStore from '@/lib/chatStore';
import { groupMessagesByDate, getDateLabel } from '@/lib/chatUtils';

export default function MessageList() {
  const { currentRoom, messages } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const roomMessages = currentRoom ? messages[currentRoom.id] || [] : [];
  const groupedMessages = groupMessagesByDate(roomMessages);
  const dateKeys = Object.keys(groupedMessages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [roomMessages.length, autoScroll]);

  // Handle scroll events to show/hide scroll button
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    
    setAutoScroll(isNearBottom);
    setShowScrollButton(!isNearBottom && roomMessages.length > 0);
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  if (!currentRoom) {
    return null;
  }

  if (roomMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white/40"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start the conversation by sending the first message in <strong>{currentRoom.name}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-full px-4 py-2" 
        onScrollCapture={handleScroll}
      >
        <div className="space-y-1">
          {dateKeys.map((dateKey) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center py-4">
                <Separator className="flex-1" />
                <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border rounded-full">
                  {getDateLabel(dateKey)}
                </div>
                <Separator className="flex-1" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-1">
                {groupedMessages[dateKey].map((message, index) => {
                  const prevMessage = index > 0 ? groupedMessages[dateKey][index - 1] : null;
                  const nextMessage = index < groupedMessages[dateKey].length - 1 ? groupedMessages[dateKey][index + 1] : null;
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      previousMessage={prevMessage}
                      nextMessage={nextMessage}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Invisible element to scroll to */}
        <div ref={bottomRef} className="h-1" />
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}