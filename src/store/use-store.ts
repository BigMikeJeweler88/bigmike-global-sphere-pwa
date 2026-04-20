'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppMode = 'situation-room' | 'sports' | 'music' | 'civilians' | 'influencers' | 'sales' | 'system'

interface AppStore {
  activeMode: AppMode
  darkMode: boolean
  setActiveMode: (m: AppMode) => void
  toggleDark: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      activeMode: 'situation-room',
      darkMode: true,
      setActiveMode: (m) => set({ activeMode: m }),
      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'bigmike-store' }
  )
)
