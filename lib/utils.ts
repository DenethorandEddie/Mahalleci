import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Türkçe karakterleri normalize etmek için yardımcı fonksiyon
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-') // alfanumerik olmayan karakterleri tire ile değiştir
    .replace(/-+/g, '-') // ardışık tireleri tek tireye dönüştür
    .replace(/^-|-$/g, ''); // baştaki ve sondaki tireleri kaldır
} 