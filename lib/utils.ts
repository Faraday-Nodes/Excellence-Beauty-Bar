import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* On GitHub Pages the site is served under /<repo>/. `next/image` with
   `unoptimized` does NOT prepend that base path to local image `src` strings,
   so a local path like "/photo.png" 404s in production. Prefix local paths
   (leading slash) with the base path; leave absolute URLs (http…) untouched. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function asset(src: string): string {
  return src.startsWith("/") ? `${BASE_PATH}${src}` : src;
}
