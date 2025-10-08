import { useEffect, type RefObject } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ref, callback]);
}; 