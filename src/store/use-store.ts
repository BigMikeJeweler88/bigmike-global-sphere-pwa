'use client';
import{create}from'zustand';
import{persist}from'zustand/middleware';
interface AppStore{mode:string;darkMode:boolean;setMode:(m:string)=>void;toggleDark:()=>void;}
export const useStore=create<AppStore>()(persist(set=>({mode:'situation',darkMode:true,setMode:m=>set({mode:m}),toggleDark:()=>set(s=>({darkMode:!s.darkMode}))}),{name:'bigmike-store'}));
