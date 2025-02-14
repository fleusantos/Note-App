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
  existingNote?: {
    id: string;
    title: string;
    content: string;
    categoryId: string;
  };
}

export default function NoteModal({ isOpen, onClose, selectedCategory, categories, onSave, existingNote }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategory.id);
  const [currentCategory, setCurrentCategory] = useState(selectedCategory);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTitle('');
      setContent('');
      setIsDropdownOpen(false);
    } else {
      // When modal opens, set the initial state
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        const noteCategory = categories.find(c => c.id === existingNote.categoryId) || selectedCategory;
        setSelectedCategoryId(noteCategory.id);
        setCurrentCategory(noteCategory);
      } else {
        setTitle('');
        setContent('');
        setSelectedCategoryId(selectedCategory.id);
        setCurrentCategory(selectedCategory);
      }
    }
  }, [isOpen, selectedCategory, existingNote, categories]);

  // Log category changes for debugging
  useEffect(() => {
    console.log('Category state:', {
      selectedCategory,
      currentCategory,
      selectedCategoryId
    });
  }, [selectedCategory, currentCategory, selectedCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      categoryId: currentCategory.id,
    });
  };

  const handleClose = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim() || 'Untitled',
        content: content.trim(),
        categoryId: currentCategory.id,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentTime = format(new Date(), "MMMM d, yyyy 'at' h:mma");

  return (
    <div className="fixed inset-0 bg-[#FAF1E3] flex items-center justify-center p-4 z-50">
      <div 
        className="rounded-2xl w-full max-w-3xl min-h-[80vh] flex flex-col relative overflow-hidden"
      >
        {/* Header with category and close button */}
        <div className="flex justify-between items-center py-6">
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-600 hover:opacity-80 transition-colors text-3xl font-light"
          >
            ×
          </button>
          <div className="text-sm text-black/60">
            Last Edited: {currentTime}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Category dropdown */}
          <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: currentCategory.color }}>
            <div className="relative category-dropdown">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm hover:bg-black/5"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentCategory.color }}
                />
                <span>{currentCategory.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-100 z-10">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className="w-full px-4 py-2 text-left text-xs font-inter hover:bg-black/5 flex items-center gap-2"
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setCurrentCategory(category);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-black/50 text-black"
            />
            <textarea
              placeholder="Pour your heart out..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(80vh-200px)] bg-transparent border-none outline-none resize-none placeholder-black/50 text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
