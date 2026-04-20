export const REPLIT_URL=process.env.NEXT_PUBLIC_REPLIT_URL||'https://global-sphere--BigMike88.replit.app';
export async function fetcher<T>(path:string):Promise<T>{const r=await fetch(REPLIT_URL+path);return r.json();}
export async function poster(path:string,body?:any){const r=await fetch(REPLIT_URL+path,{method:'POST',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return r.json();}
