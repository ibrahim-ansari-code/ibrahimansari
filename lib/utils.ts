import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// const debug = false;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
