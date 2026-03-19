import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert date to relative time (e.g., "há 2 horas")
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora mesmo';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  
  return dateString;
}

// Check if date is within last 24 hours
export function isNew(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  return hours < 24;
}

// Get category color (border-left and badge)
export function getCategoryColor(categoria: string): { border: string; bg: string; text: string } {
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    'IA Generativa': { border: 'border-l-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
    'Machine Learning': { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
    'Pesquisa': { border: 'border-l-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
    'Regulação': { border: 'border-l-red-500', bg: 'bg-red-500/10', text: 'text-red-500' },
    'Lançamentos': { border: 'border-l-green-500', bg: 'bg-green-500/10', text: 'text-green-500' },
    'Empresas & Startups': { border: 'border-l-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-500' },
    'Investimento': { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    'Ética & Segurança': { border: 'border-l-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-500' },
    'Visão Computacional': { border: 'border-l-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
    'Robótica': { border: 'border-l-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-500' },
    'Ferramentas & Dev': { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500' },
    'IA Criativa': { border: 'border-l-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-500' },
    'Tecnologia & Sociedade': { border: 'border-l-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-500' }
  };
  
  return colors[categoria] || { border: 'border-l-primary', bg: 'bg-primary/10', text: 'text-primary' };
}
