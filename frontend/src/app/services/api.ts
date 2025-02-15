import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiNote {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at?: string;
}

export const notesApi = {
  fetchNotes: async (categoryId?: string) => {
    const params = categoryId ? { category: categoryId } : {};
    const response = await api.get<ApiNote[]>('/notes/', { params });
    if (response.data.length > 0) {
      console.log('%c📥 Notes Retrieved from Server:', 'color: #2196F3; font-weight: bold; font-size: 12px');
      response.data.forEach(note => {
        console.log({
          id: note.id,
          title: note.title,
          content: note.content,
          category: note.category,
          updated_at: new Date(note.updated_at || '').toLocaleString(),
        });
      });
    }
    return response.data;
  },
  createNote: async (data: { title: string; content: string; category: string }) => {
    const response = await api.post<ApiNote>('/notes/', data);
    return response.data;
  },
  updateNote: async (noteId: string, data: { title: string; content: string; category: string }) => {
    const response = await api.put<ApiNote>(`/notes/${noteId}/`, data);
    console.log('%c📝 Note Update Saved to Server:', 'color: #4CAF50; font-weight: bold; font-size: 12px');
    console.log({
      id: response.data.id,
      title: response.data.title,
      content: response.data.content,
      category: response.data.category,
      updated_at: response.data.updated_at,
    });
    return response.data;
  },
  deleteNote: async (id: string) => {
    await api.delete(`/notes/${id}/`);
  },
};

export const categoriesApi = {
  fetchCategories: async () => {
    const response = await api.get<Category[]>('/categories/');
    return response.data;
  },

  createCategory: async (data: { name: string; color: string }) => {
    const response = await api.post<Category>('/categories/', data);
    return response.data;
  },
};
