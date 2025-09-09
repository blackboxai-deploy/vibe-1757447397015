'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  people: {
    name: 'People',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸',
      '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️',
      '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    ],
  },
  nature: {
    name: 'Nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🌱', '🌿', '🍀', '🍃', '🌳', '🌲', '🌴', '🌊', '🌍', '🌎',
      '🌏', '🌙', '⭐', '🌟', '✨', '⚡', '🔥', '🌈', '☀️', '🌤️',
    ],
  },
  food: {
    name: 'Food',
    emojis: [
      '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒',
      '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬',
      '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠',
      '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖',
    ],
  },
  activities: {
    name: 'Activities',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷',
      '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤸', '🤾', '🏌️',
    ],
  },
  objects: {
    name: 'Objects',
    emojis: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️',
      '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
      '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭',
      '⏱️', '⏲️', '⏰', '🕰️', '⏳', '⌛', '📡', '🔋', '🪫', '🔌',
    ],
  },
  symbols: {
    name: 'Symbols',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⚛️', '🆔', '⚕️', '♈', '♉', '♊', '♋', '♌', '♍', '♎',
    ],
  },
};

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('people');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-2 w-72 max-h-80">
      {/* Close button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pick an emoji
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        {/* Category tabs */}
        <TabsList className="grid w-full grid-cols-6 mb-2 h-8">
          {Object.entries(emojiCategories).map(([key, category]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-xs p-1 h-7"
              title={category.name}
            >
              {category.emojis[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Emoji grids */}
        {Object.entries(emojiCategories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <ScrollArea className="h-48">
              <div className="grid grid-cols-8 gap-1 p-1">
                {category.emojis.map((emoji, index) => (
                  <Button
                    key={`${key}-${index}`}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => onEmojiSelect(emoji)}
                    title={`Add ${emoji}`}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recently used (placeholder for future enhancement) */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Recently used
        </div>
        <div className="flex space-x-1">
          {['👍', '❤️', '😂', '😊', '🎉'].map((emoji, index) => (
            <Button
              key={`recent-${index}`}
              variant="ghost"
              className="h-6 w-6 p-0 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}