import { useState } from 'react';

const EMOJI_CATEGORIES = {
  'Smileys & People': [
    '😊', '😎', '🥳', '🤩', '😇', '🥰', '😂', '🤣', '😍', '🤔',
    '😴', '🤓', '😎', '🥸', '🤠', '😇', '🤡', '👻', '👾', '🤖'
  ],
  'Animals & Nature': [
    '🦋', '🐉', '🦄', '🌸', '🌺', '🌼', '🌻', '🌹', '🍀', '🌳',
    '🌴', '🌵', '🌾', '🌱', '🪴', '🎋', '🍄', '🐣', '🦊', '🐼'
  ],
  'Activities & Objects': [
    '💫', '✨', '🌟', '⭐️', '🎨', '🎭', '🎪', '🎠', '🎮', '🎲',
    '🎯', '🎱', '🎳', '🎤', '🎧', '🎵', '🎶', '🎹', '🎻', '🥁'
  ],
  'Symbols & Flags': [
    '💖', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍',
    '♾️', '✝️', '☪️', '🕉️', '☮️', '🔯', '☯️', '✡️', '🕎', '☦️'
  ],
  'Food & Drink': [
    '🍕', '🍔', '🌮', '🍜', '🍣', '🍩', '🍪', '🍰', '🧁', '🍫',
    '☕️', '🧋', '🧃', '🍷', '🍸', '🍹', '🍺', '🥂', '🥤', '🧊'
  ]
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji: string;
}

export default function EmojiPicker({ onEmojiSelect, selectedEmoji }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Smileys & People');
  const [searchTerm, setSearchTerm] = useState('');

  const frequentlyUsed = EMOJI_CATEGORIES['Smileys & People'].slice(0, 10);

  const filteredEmojis = searchTerm
    ? Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter(emoji => emoji.includes(searchTerm))
    : EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES];

  return (
    <div className="relative">
      <div className="flex gap-2 flex-wrap mb-2">
        {frequentlyUsed.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className={`p-2 text-xl hover:bg-purple-100 rounded-lg transition-colors ${
              selectedEmoji === emoji ? 'bg-purple-100' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Emoji"
          className="w-20 p-3 bg-white border border-purple-300 rounded-lg focus:border-pink-500"
          value={selectedEmoji}
          readOnly
          onClick={() => setShowPicker(true)}
        />
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="cyber-button-secondary text-sm px-3 py-2"
        >
          {showPicker ? 'Close' : 'More emojis'}
        </button>
      </div>      {showPicker && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center pt-32">
          <div 
            className="fixed inset-0 bg-black/20" 
            onClick={() => setShowPicker(false)}
          />
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl border border-purple-200 p-4 w-72 relative z-[1000]">
              <input
                type="text"
                placeholder="Search emojis..."
                className="w-full p-2 mb-3 border border-purple-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {!searchTerm && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-200">
                  {Object.keys(EMOJI_CATEGORIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                        selectedCategory === category
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-8 gap-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200">
                {filteredEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onEmojiSelect(emoji);
                      setShowPicker(false);
                      setSearchTerm('');
                    }}
                    className="p-1 text-xl hover:bg-purple-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
