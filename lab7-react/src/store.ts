import { create } from 'zustand';

export interface Book {
  Year: number;
  Title: string;
  Pages?: number;
}

export interface Thread {
  id: number;
  title: string;
  body: string;
  author: string;
  tag: string;
  tagLabel: string;
  votes: number;
  views: number;
  comments: number;
}

interface ApiStore {
  books: Book[];
  threads: Thread[];
  isLoadingBooks: boolean;
  isLoadingThreads: boolean;

  loadBooks: () => Promise<void>;
  loadThreads: () => Promise<void>;
  createThread: (title: string, body: string) => Promise<void>;
  deleteThread: (id: number) => Promise<void>;
  incrementViews: (id: number) => void;
}

export const useApiStore = create<ApiStore>((set, get) => ({
  books: [],
  threads: [],
  isLoadingBooks: false,
  isLoadingThreads: false,

  loadBooks: async () => {
    if (get().books.length > 0) return; // уже загружены

    set({ isLoadingBooks: true });

    try {
      const res = await fetch('https://stephen-king-api.onrender.com/api/books', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      set({ books: data.data ? data.data.slice(0, 12) : [] });
    } catch (err) {
      console.error('Ошибка загрузки книг:', err);
      set({ books: [] });
    } finally {
      set({ isLoadingBooks: false });
    }
  },

  loadThreads: async () => {
    set({ isLoadingThreads: true });

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const raw = await res.json();
      const processed = raw.map((p: any, i: number) => ({
        id: p.id,
        title: p.title || `Обсуждение #${i + 1}`,
        body: p.body || 'Текст обсуждения...',
        author: `Пользователь ${i % 5 + 1}`,
        tag: ['discussion', 'question', 'news'][i % 3],
        tagLabel: ['Обсуждение', 'Вопрос', 'Новость'][i % 3],
        votes: Math.floor(Math.random() * 50) + 5,
        views: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 25) + 3,
      }));
      set({ threads: processed });
    } catch (err) {
      console.error('Ошибка загрузки тредов:', err);
      set({ threads: [] });
    } finally {
      set({ isLoadingThreads: false });
    }
  },

  createThread: async (title: string, body: string) => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      const newThread: Thread = {
        id: Date.now(),
        title,
        body,
        author: 'Вы',
        tag: 'discussion',
        tagLabel: 'Обсуждение',
        votes: 0,
        views: 1,
        comments: 0,
      };

      set((state) => ({ threads: [newThread, ...state.threads] }));
    } catch (err) {
      console.error('Ошибка создания треда:', err);
    }
  },

  deleteThread: async (id: number) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      set((state) => ({ threads: state.threads.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      // всё равно удаляем из локального состояния
      set((state) => ({ threads: state.threads.filter((t) => t.id !== id) }));
    }
  },

  incrementViews: (id: number) => {
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === id ? { ...t, views: t.views + 1 } : t
      ),
    }));
  },
}));