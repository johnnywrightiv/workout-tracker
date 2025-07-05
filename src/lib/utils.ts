import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertWeight = (weight: number, to: 'kg' | 'lbs') => {
  return to === 'kg' ? weight * 0.45359237 : weight / 0.45359237;
};

export const convertDistance = (distance: number, to: 'km' | 'miles') => {
  return to === 'km' ? distance * 1.60934 : distance / 1.60934;
};
