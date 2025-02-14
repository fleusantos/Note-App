'use client';

import { useState, useEffect, useRef } from 'react';
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
  const titleRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-resize title field
  const adjustTitleHeight = () => {
    const textarea = titleRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 24 * 5); // 24px line-height * 5 lines max
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Update title content and adjust height
  useEffect(() => {
    if (titleRef.current) {
      const titleElement = titleRef.current;
      if (titleElement.value !== title) {
        titleElement.value = title;
        adjustTitleHeight();
      }
    }
  }, [title]);

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
        <div className="flex-1 flex flex-col">
          {/* Category dropdown and close button */}
          <div className="flex justify-between items-center p-4">
            <div className="relative category-dropdown">
              <button
                type="button"
                className="flex items-center gap-2 w-[200px] px-3 py-1.5 rounded-lg bg-white border"
                style={{ borderColor: '#957139' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentCategory.color }}
                />
                <span>{currentCategory.name}</span>
                <svg
                  className={`w-6 h-6 ml-auto transition-transform duration-200 ${
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
                <div className="absolute left-0 mt-2 w-[200px] rounded-lg bg-[#FAF1E3] shadow-lg overflow-hidden z-10">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#95713933] flex items-center gap-2"
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
            <button
              type="button"
              onClick={handleClose}
              className="text-black/60 hover:opacity-80 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Content area with category color background */}
          <div 
            className="flex-1 rounded-[11px] mx-4 mb-4 overflow-hidden"
            style={{ 
              backgroundColor: `${currentCategory.color}80`,
              border: `3px solid ${currentCategory.color}`
            }}
          >
            <div className="p-6 space-y-4">
              {/* Last edited timestamp */}
              <div className="text-black text-right font-['Inter'] text-[12px] font-normal mb-4">
                Last Edited: {currentTime}
              </div>
              
              <textarea
                ref={titleRef}
                placeholder="Note Title"
                value={title}
                onChange={(e) => {
                  const content = e.target.value;
                  // Allow up to 5 lines
                  const lines = content.split('\n');
                  if (lines.length <= 5) {
                    setTitle(content);
                    adjustTitleHeight();
                  }
                }}
                className="w-full font-['Inria_Serif'] text-[24px] font-bold bg-transparent outline-none text-black resize-none placeholder-black/50 overflow-hidden"
                style={{
                  display: 'block',
                  wordWrap: 'break-word',
                  color: '#000000',
                  lineHeight: '24px',
                  minHeight: '24px'
                }}
              />
              
              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[calc(100vh-400px)] bg-transparent border-none outline-none resize-none placeholder-black/50 text-black font-['Inter'] text-[16px] font-normal whitespace-pre-wrap break-words"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
