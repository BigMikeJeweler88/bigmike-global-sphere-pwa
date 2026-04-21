'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Section = 'home' | 'sports' | 'music' | 'civilians' | 'influencers' | 'sales' | 'system'

interface Store {
  section: Section
  setSection: (s: Section) => void
}

export const useStore = create<Store>()(persist(
  (set) => ({ section: 'home', setSection: (section) => set({ section }) }),
  { name: 'bigmike-v3' }
))
