'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from '@/components/EmojiPicker';
import useChatStore from '@/lib/chatStore';
import { isValidMessageContent, debounce } from '@/lib/chatUtils';

interface MessageInputProps {
  roomId: string;
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const { currentUser, sendMessage, startTyping, stopTyping } = useChatStore();
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounced typing indicator
  const debouncedStopTyping = debounce(() => {
    stopTyping(roomId);
  }, 1000);

  useEffect(() => {
    // Clean up typing when component unmounts
    return () => {
      stopTyping(roomId);
    };
  }, [roomId, stopTyping]);

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Handle typing indicators
    if (value.trim()) {
      startTyping(roomId);
      debouncedStopTyping();
    } else {
      stopTyping(roomId);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!isValidMessageContent(message) || !currentUser) return;

    sendMessage({
      content: message.trim(),
      roomId,
      type: 'text',
    });

    setMessage('');
    stopTyping(roomId);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const newMessage = message + emoji;
    setMessage(newMessage);
    setIsEmojiPickerOpen(false);
    
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    handleInputChange(textarea.value);
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Please select a user to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-end space-x-2">
          {/* Emoji Picker Button */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-2xl p-2 h-10 w-10"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              😊
            </Button>
            
            {isEmojiPickerOpen && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker 
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setIsEmojiPickerOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${roomId}...`}
              className="min-h-[40px] max-h-[120px] resize-none rounded-2xl px-4 py-2 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!isValidMessageContent(message)}
            className="h-10 w-10 p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>

        {/* Character count and hints */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div>
            {message.length > 0 && (
              <span className={message.length > 2000 ? 'text-red-500' : ''}>
                {message.length}/2000
              </span>
            )}
          </div>
          <div>
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </form>
    </div>
  );
}