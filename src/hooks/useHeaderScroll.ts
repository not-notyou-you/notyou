// src/hooks/useHeaderScroll.ts
import { useEffect, useState } from 'react';

interface UseHeaderScrollReturn {
  scrollPosition: number;
  isHeaderVisible: boolean;
}

export function useHeaderScroll(): UseHeaderScrollReturn {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      setIsHeaderVisible(currentScrollY <= lastScrollY || currentScrollY < 80);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollPosition, isHeaderVisible };
}