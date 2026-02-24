/**
 * @file 应用状态Store
 * @description 全局应用状态管理，包括侧边栏、语言、通知等
 * @module stores/useAppStore
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface AppState {
  isSidebarOpen: boolean;
  currentLanguage: string;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      isSidebarOpen: true,
      currentLanguage: 'zh-CN',
      notifications: [],
      isLoading: false,
      error: null,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setLanguage: (lang) => set({ currentLanguage: lang }),
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = { ...notification, id };
        set((state) => {
          const newNotifications = [...state.notifications, newNotification];
          return { notifications: newNotifications };
        });

        const duration = notification.duration || 3000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'AppStore' }
  )
);
