'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoteModal from '../../components/NoteModal';
import { notesApi, categoriesApi } from '../services/api';
import { checkAuth } from '../utils/auth';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  updatedAt: string;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({ id: 'all', name: 'All Categories', color: '#8B4513' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    checkAuth();
    const initializeCategories = async () => {
      try {
        const existingCategories = await categoriesApi.fetchCategories();
        
        if (existingCategories.length === 0) {
          // Create default categories with specific colors
          const defaultCategories = [
            { id: 'random', name: 'Random Thoughts', color: '#EF9C66' },
            { id: 'school', name: 'School', color: '#FCDC94' },
            { id: 'personal', name: 'Personal', color: '#78ABA8' },
          ];

          const createdCategories = await Promise.all(
            defaultCategories.map(cat => categoriesApi.createCategory(cat))
          );

          setCategories([
            { id: 'all', name: 'All Categories', color: '#8B4513' },
            ...createdCategories,
          ]);
        } else {
          setCategories([
            { id: 'all', name: 'All Categories', color: '#8B4513' },
            ...existingCategories,
          ]);
        }
      } catch (error) {
        console.error('Failed to initialize categories:', error);
      }
    };

    const fetchNotes = async () => {
      try {
        // Always fetch all notes
        const apiNotes = await notesApi.fetchNotes();
        const transformedNotes = apiNotes.map(note => {
          const noteCategory = categories.find(cat => cat.id === note.category);
          return {
            id: note.id,
            title: note.title,
            content: note.content,
            categoryId: note.category,
            updatedAt: note.updated_at || new Date().toISOString(),
            color: noteCategory?.color || '#000000',
          };
        });
        setAllNotes(transformedNotes);
        
        // Filter notes based on selected category
        if (selectedCategory.id === 'all') {
          setFilteredNotes(transformedNotes);
        } else {
          setFilteredNotes(transformedNotes.filter(note => note.categoryId === selectedCategory.id));
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    initializeCategories();
    fetchNotes();
  }, [router, selectedCategory.id]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    if (category.id === 'all') {
      setFilteredNotes(allNotes);
    } else {
      setFilteredNotes(allNotes.filter(note => note.categoryId === category.id));
    }
  };  

  const handleNewNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData: { title: string; content: string; categoryId: string }) => {
    try {
      const targetCategory = noteData.categoryId === 'all' ? categories[1].id : noteData.categoryId;

      if (editingNote) {
        // Update existing note
        const apiNote = await notesApi.updateNote(editingNote.id, {
          title: noteData.title,
          content: noteData.content,
          category: targetCategory,
        });

        const updatedNote: Note = {
          id: apiNote.id,
          title: apiNote.title,
          content: apiNote.content,
          categoryId: apiNote.category,
          updatedAt: apiNote.updated_at || new Date().toISOString(),
          color: categories.find(cat => cat.id === apiNote.category)?.color || '#000000',
        };

        // Update both allNotes and filteredNotes
        setAllNotes(prev => prev.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        ));
        
        if (selectedCategory.id === 'all' || selectedCategory.id === updatedNote.categoryId) {
          setFilteredNotes(prev => prev.map(note => 
            note.id === updatedNote.id ? updatedNote : note
          ));
        } else {
          setFilteredNotes(prev => prev.filter(note => note.id !== updatedNote.id));
        }
      } else {
        // Create new note
        const apiNote = await notesApi.createNote({
          title: noteData.title,
          content: noteData.content,
          category: targetCategory,
        });
        
        const newNote: Note = {
          id: apiNote.id,
          title: apiNote.title,
          content: apiNote.content,
          categoryId: apiNote.category,
          updatedAt: apiNote.updated_at || new Date().toISOString(),
          color: categories.find(cat => cat.id === apiNote.category)?.color || '#000000',
        };
        
        // Update both allNotes and filteredNotes
        setAllNotes(prev => [newNote, ...prev]);
        if (selectedCategory.id === 'all' || selectedCategory.id === newNote.categoryId) {
          setFilteredNotes(prev => [newNote, ...prev]);
        }
      }

      setIsModalOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time part for accurate date comparison
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayWithoutTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
      return 'today';
    } else if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
      return 'yesterday';
    }
    
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className="min-h-screen bg-[#FFF5EB] flex">
      {/* Sidebar */}
      <div className="w-[256px] p-4 border-r border-[#8B4513]/10">
        <nav className="mt-[82px]">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[#8B4513]/5 transition-colors duration-200 flex items-center justify-between ${
                    selectedCategory.id === category.id ? 'bg-[#8B4513]/5' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex items-center space-x-2">
                    {category.id !== 'all' && (
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className={`font-inter text-black ${
                      category.id === 'all' 
                        ? 'text-xs font-bold' // 12px, 700 weight for All Categories
                        : 'text-xs font-normal' // 12px, 400 weight for other categories
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  {category.id !== 'all' && (
                    <span className="text-black text-xs font-normal">
                      {allNotes.filter(note => note.categoryId === category.id).length}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#8B4513]">
            {/* {selectedCategory.name === 'All Categories' ? 'My Notes' : selectedCategory.name} */}
          </h1>
          <button
            onClick={handleNewNote}
            className="px-6 py-3 bg-[#FDF5E6] border border-memo-brown text-[#8B4513] rounded-full font-inter hover:bg-[#F5E6D3] transition-colors duration-200 focus:outline-none focus:border-memo-brown focus:ring-1 focus:ring-memo-brown disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Note
          </button>
        </div>

        {filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <Image
              src="/bubble-tea.png"
              alt="Bubble Tea"
              width={200}
              height={200}
              className="mb-6"
            />
            <p className="text-xl text-[#8B4513]">
              I'm just here waiting for your charming notes...
            </p>
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => {
              const category = categories.find(c => c.id === note.categoryId);
              return (
                <div
                  key={note.id}
                  className="h-[246px] rounded-[11px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-shadow duration-200 flex flex-col cursor-pointer"
                  style={{ 
                    backgroundColor: category?.color ? `${category.color}80` : '#FAF1E3',
                    border: `3px solid ${category?.color || '#957139'}`
                  }}
                  onClick={() => handleEditNote(note)}
                >
                  <div className="flex items-center gap-2 mb-3 text-[#4A4A4A]">
                    <span className="font-inter text-note-sm-bold capitalize">{formatDate(note.updatedAt)}</span>
                    <span className="font-inter text-note-sm">{category?.name}</span>
                  </div>
                  <h3 className="font-inria text-note-title mb-4 text-black line-clamp-4 break-words whitespace-pre-wrap">{note.title}</h3>
                  <p className="font-inter text-note-sm text-[#4A4A4A] leading-relaxed line-clamp-4 flex-1 break-words whitespace-pre-wrap">{note.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
        categories={categories.filter(cat => cat.id !== 'all')} // Exclude 'All Categories' from dropdown
        onSave={handleSaveNote}
        existingNote={editingNote || undefined}
      />
    </div>
  );
}
