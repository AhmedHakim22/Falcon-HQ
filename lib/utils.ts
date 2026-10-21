import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeakingTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} ثانية`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${mins} دقيقة و ${remainingSecs} ثانية`;
}

export function estimateSpeakingDuration(text: string): { words: number; seconds: number } {
  const clean = text.trim();
  if (!clean) return { words: 0, seconds: 0 };
  const words = clean.split(/\s+/).filter(Boolean).length;
  // Average Egyptian colloquial speaking rate: ~130 words per minute (2.16 words per second)
  const seconds = Math.round((words / 130) * 60);
  return { words, seconds };
}
