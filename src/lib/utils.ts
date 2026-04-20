import{clsx,type ClassValue}from 'clsx';
import{twMerge}from 'tailwind-merge';
export function cn(...i:ClassValue[]){return twMerge(clsx(i));}
export function formatCurrency(a:number,c=false):string{if(c){if(a>=1e6)return '$'+(a/1e6).toFixed(1)+'M';if(a>=1e3)return '$'+(a/1e3).toFixed(0)+'K';}return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(a);}