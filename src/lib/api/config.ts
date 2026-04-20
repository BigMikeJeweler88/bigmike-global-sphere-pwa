export const REPLIT_URL=process.env.NEXT_PUBLIC_REPLIT_URL||'https://global-sphere--BigMike88.replit.app';
export async function fetcher<T>(url:string):Promise<T>{const r=await fetch(url);if(!r.ok)throw new Error('Fetch failed: '+r.status);return r.json();}
export async function poster(url:string,body?:any){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return r.json();}
