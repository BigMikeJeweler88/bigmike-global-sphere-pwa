'use client'
import{create}from 'zustand';
import{persist}from 'zustand/middleware';
export type AppMode='situation-room'|'sports'|'music'|'civilians'|'influencers'|'sales'|'system';
interface AppState{darkMode:boolean;setDarkMode:(v:boolean)=>void;activeMode:AppMode;setActiveMode:(m:AppMode)=>void;}
export const useStore=create<AppState>()(persist((set)=>({darkMode:true,setDarkMode:(darkMode)=>{set({darkMode});if(typeof document!=='undefined')document.documentElement.classList.toggle('dark',darkMode);},activeMode:'situation-room',setActiveMode:(activeMode)=>set({activeMode}),}),{name:'bigmike-gs-storage',partialize:(s)=>({darkMode:s.darkMode,activeMode:s.activeMode})}));