'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category;
  categories: Category[];
  onSave: (note: { title: string; content: string; categoryId: string }) => void;
}

export default function NoteModal({ isOpen, onClose, selectedCategory, categories, onSave }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory.id);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
    }
    setSelectedCategoryId(selectedCategory.id);
  }, [isOpen, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId === 'all' ? '1' : selectedCategoryId,
    });
  };

  if (!isOpen) return null;

  const currentTime = format(new Date(), "MMMM d, yyyy 'at' h:mma");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFE5D9] rounded-2xl w-full max-w-3xl min-h-[80vh] flex flex-col relative">
        {/* Header with category and close button */}
        <div className="flex justify-between items-center p-4 border-b border-[#8B4513]/10">
          <div className="relative">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="appearance-none bg-transparent pr-8 text-[#8B4513] cursor-pointer focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B4513]">
              ▼
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8B4513] hover:text-[#8B4513]/80 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Note content */}
          <div className="flex-1 p-6 space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none text-[#8B4513] placeholder-[#8B4513]/50"
              required
            />
            <textarea
              placeholder="Pour your heart out..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(80vh-200px)] bg-transparent border-none outline-none resize-none text-[#8B4513] placeholder-[#8B4513]/50"
              required
            />
          </div>

          {/* Last edited timestamp */}
          <div className="p-4 text-sm text-[#8B4513]/70 border-t border-[#8B4513]/10">
            Last Edited: {currentTime}
          </div>

          {/* Save and Cancel buttons */}
          <div className="flex items-center justify-end gap-4 px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors duration-200"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
