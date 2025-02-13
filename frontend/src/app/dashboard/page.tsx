'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoteModal from '../components/NoteModal';
import { notesApi, categoriesApi, Note as ApiNote } from '../services/api';

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
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({ id: 'all', name: 'All Categories', color: '#8B4513' });
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All Categories', color: '#8B4513' },
  ]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Initialize default categories if they don't exist
    const initializeCategories = async () => {
      try {
        const existingCategories = await categoriesApi.fetchCategories();
        
        if (existingCategories.length === 0) {
          // Create default categories
          const defaultCategories = [
            { name: 'Random Thoughts', color: '#FF9F1C' },
            { name: 'School', color: '#4A4A4A' },
            { name: 'Personal', color: '#41B3A3' },
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

    initializeCategories();
  }, [router]);

  useEffect(() => {
    // Fetch notes when component mounts or selected category changes
    const fetchNotes = async () => {
      try {
        const apiNotes = await notesApi.fetchNotes(selectedCategory.id);
        const transformedNotes: Note[] = apiNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          categoryId: note.category,
          createdAt: note.created_at,
        }));
        setNotes(transformedNotes);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    if (categories.length > 1) { // Only fetch notes after categories are loaded
      fetchNotes();
    }
  }, [selectedCategory.id, categories]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleNewNote = () => {
    setIsModalOpen(true);
  };

  const handleSaveNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const targetCategory = note.categoryId === 'all' ? categories[1].id : note.categoryId; // Use first real category if 'all' is selected
      const apiNote = await notesApi.createNote({
        title: note.title,
        content: note.content,
        category: targetCategory,
      });
      
      const newNote: Note = {
        id: apiNote.id,
        title: apiNote.title,
        content: apiNote.content,
        categoryId: apiNote.category,
        createdAt: apiNote.created_at,
      };
      
      setNotes(prev => [newNote, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create note:', error);
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

  const filteredNotes = notes;  // No need to filter since the API already does that

  return (
    <div className="min-h-screen bg-[#FFF5EB] flex">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r border-[#8B4513]/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-[#8B4513]">Categories</h2>
        </div>
        <nav>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-[#8B4513]/5 transition-colors duration-200 flex items-center space-x-2 ${
                    selectedCategory.id === category.id ? 'bg-[#8B4513]/5' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-[#8B4513]">{category.name}</span>
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
            {selectedCategory.name === 'All Categories' ? 'My Notes' : selectedCategory.name}
          </h1>
          <button
            onClick={handleNewNote}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>+ New Note</span>
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
              // Function to get a stronger version of the category color
              const getBorderColor = (baseColor: string) => {
                if (!baseColor) return '#957139';
                // Remove the '#' and split into RGB components
                const hex = baseColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                // Make the color stronger by reducing brightness but maintaining hue
                const factor = 0.8; // Darkening factor
                const newR = Math.floor(r * factor);
                const newG = Math.floor(g * factor);
                const newB = Math.floor(b * factor);
                return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
              };
              
              return (
                <div
                  key={note.id}
                  className="rounded-[11px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-shadow duration-200"
                  style={{ 
                    backgroundColor: category?.color ? `${category.color}20` : '#FAF1E3',
                    border: `3px solid ${getBorderColor(category?.color || '#957139')}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-3 text-[#4A4A4A]">
                    <span className="font-inter text-note-sm-bold capitalize">{formatDate(note.createdAt)}</span>
                    <span>•</span>
                    <span className="font-inter text-note-sm">{category?.name}</span>
                  </div>
                  <h3 className="font-inria text-note-title mb-4 text-black">{note.title}</h3>
                  <p className="font-inter text-note-sm text-[#4A4A4A] leading-relaxed line-clamp-4">{note.content}</p>
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
      />
    </div>
  );
}
