import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Recommendation type styling utility
export function getRecommendationTypeStyle(type: string): string {
  switch (type?.toLowerCase()) {
    case 'free':
      return 'bg-[#97b5ec] text-white';
    case 'paid':
      return 'bg-[#7db48f] text-white';
    case 'premium':
      return 'bg-[#f7bdf6] text-black';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}