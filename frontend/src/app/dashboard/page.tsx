'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoteModal from '../components/NoteModal';

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
  const [categories] = useState<Category[]>([
    { id: 'all', name: 'All Categories', color: '#8B4513' },
    { id: '1', name: 'Random Thoughts', color: '#FF9F1C' },
    { id: '2', name: 'School', color: '#4A4A4A' },
    { id: '3', name: 'Personal', color: '#41B3A3' },
  ]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleNewNote = () => {
    setIsModalOpen(true);
  };

  const handleSaveNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setIsModalOpen(false);
  };

  const filteredNotes = selectedCategory.id === 'all' 
    ? notes 
    : notes.filter(note => note.categoryId === selectedCategory.id);

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
              return (
                <div
                  key={note.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ borderTop: `4px solid ${category?.color || '#8B4513'}` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#4A4A4A] line-clamp-1">{note.title}</h3>
                    <span className="text-sm text-[#8B4513]">{category?.name}</span>
                  </div>
                  <p className="text-[#666] mb-4 line-clamp-3">{note.content}</p>
                  <div className="text-sm text-[#8B4513]">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
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
        onSave={handleSaveNote}
      />
    </div>
  );
}
