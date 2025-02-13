'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: {
    id: string;
    name: string;
    color: string;
  };
}

export default function NoteModal({ isOpen, onClose, selectedCategory }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const currentTime = format(new Date(), "MMMM d, yyyy 'at' h:mma");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFE5D9] rounded-2xl w-full max-w-3xl min-h-[80vh] flex flex-col relative">
        {/* Header with category and close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#8B4513]/10">
          <div className="flex items-center space-x-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedCategory?.color || '#FF9F1C' }}
            />
            <span className="text-[#8B4513]">
              {selectedCategory?.name || 'Random Thoughts'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B4513] hover:text-[#8B4513]/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Note content */}
        <div className="flex-1 p-6 space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-none outline-none text-[#8B4513] placeholder-[#8B4513]/50"
          />
          <textarea
            placeholder="Pour your heart out..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(80vh-200px)] bg-transparent border-none outline-none resize-none text-[#8B4513] placeholder-[#8B4513]/50"
          />
        </div>

        {/* Last edited timestamp */}
        <div className="p-4 text-sm text-[#8B4513]/70 border-t border-[#8B4513]/10">
          Last Edited: {currentTime}
        </div>
      </div>
    </div>
  );
}
