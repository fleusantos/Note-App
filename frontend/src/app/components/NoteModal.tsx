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
          <div className="relative category-dropdown">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="appearance-none cursor-pointer focus:outline-none border font-inter text-xs font-normal transition-colors flex items-center gap-2 w-[225px]"
              style={{ 
                borderColor: currentCategory.color,
                borderWidth: '1px',
                borderRadius: '6px',
                paddingTop: '7px',
                paddingRight: '35px',
                paddingBottom: '7px',
                paddingLeft: '15px',
                backgroundColor: '#FAF1E3',
                color: '#000'
              }}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: currentCategory.color }}
              />
              <span className="truncate">{currentCategory.name}</span>
              <div 
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200"
              >
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ 
                    fill: 'none',
                    stroke: currentCategory.color,
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <path d="M2.5 4.5L6 8L9.5 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute left-0 right-0 mt-1 bg-[#FAF1E3] border rounded-lg shadow-lg py-1 z-10"
                style={{ borderColor: currentCategory.color }}
              >
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
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-600 hover:opacity-80 transition-colors text-3xl font-light"
          >
            ×
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Note content */}
          <div 
            className="flex-1 flex flex-col rounded-t-2xl"
            style={{
              backgroundColor: currentCategory.color,
              borderColor: currentCategory.color,
              borderWidth: '1px'
            }}
          >
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

            {/* Last edited timestamp */}
            <div className="p-4 text-sm border-t text-black" style={{ 
              borderColor: currentCategory.color
            }}>
              Last Edited: {currentTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
