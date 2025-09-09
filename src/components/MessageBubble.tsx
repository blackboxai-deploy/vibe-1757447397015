'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message } from '@/types/chat';
import { formatTimestamp, shouldShowTimestamp, shouldShowAvatar, containsOnlyEmoji } from '@/lib/chatUtils';
import useChatStore from '@/lib/chatStore';

interface MessageBubbleProps {
  message: Message;
  previousMessage?: Message | null;
  nextMessage?: Message | null;
}

const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function MessageBubble({ message, previousMessage, nextMessage }: MessageBubbleProps) {
  const { currentUser, addReaction } = useChatStore();
  const [showReactions, setShowReactions] = useState(false);

  const isCurrentUser = message.senderId === currentUser?.id;
  const showTimestamp = shouldShowTimestamp(message, previousMessage);
  const showAvatar = shouldShowAvatar(message, nextMessage);
  const isEmojiOnly = containsOnlyEmoji(message.content);
  const isSystemMessage = message.type === 'system';

  // Group reactions by emoji
  const reactionGroups = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, typeof message.reactions>) || {};

  const handleReaction = (emoji: string) => {
    addReaction(message.id, message.roomId, emoji);
    setShowReactions(false);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center py-2">
        <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`flex max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
          {showAvatar && !isCurrentUser ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                  <AvatarFallback className="text-xs">{message.senderName.charAt(0)}</AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent side="right" className="w-64">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{message.senderName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member since {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div className="w-8 h-8" /> // Placeholder for alignment
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {/* Name and Timestamp */}
          {showTimestamp && (
            <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isCurrentUser ? 'You' : message.senderName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(message.timestamp)}
              </span>
              {message.edited && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  edited
                </Badge>
              )}
            </div>
          )}

          {/* Message Bubble */}
          <div className="relative group">
            <div
              className={`
                px-4 py-2 rounded-2xl relative
                ${isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }
                ${isEmojiOnly ? 'bg-transparent text-4xl px-2 py-1' : ''}
                ${showAvatar ? '' : isCurrentUser ? 'rounded-br-md' : 'rounded-bl-md'}
              `}
            >
              <p className={`${isEmojiOnly ? 'text-center' : ''} break-words`}>
                {message.content}
              </p>

              {/* Message Actions */}
              {!isEmojiOnly && (
                <div 
                  className={`
                    absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity
                    ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}
                  `}
                >
                  <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs bg-white dark:bg-gray-700 shadow-md border"
                      >
                        😊
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <div className="grid grid-cols-6 gap-1 p-2">
                        {commonReactions.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                            onClick={() => handleReaction(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Reactions */}
            {Object.keys(reactionGroups).length > 0 && (
              <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {Object.entries(reactionGroups).map(([emoji, reactions]) => {
                  const reactionsArray = reactions as NonNullable<typeof message.reactions>;
                  const userReacted = reactionsArray.some(r => r.userId === currentUser?.id);
                  return (
                    <Button
                      key={emoji}
                      variant={userReacted ? "default" : "secondary"}
                      size="sm"
                      className="h-6 px-2 text-xs rounded-full"
                      onClick={() => handleReaction(emoji)}
                    >
                      <span className="mr-1">{emoji}</span>
                      <span>{reactionsArray.length}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}