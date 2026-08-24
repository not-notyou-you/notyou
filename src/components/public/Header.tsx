// src/components/public/Header.tsx
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/public/header/Navigation';
import { ThemeToggle } from '@/components/public/header/ThemeToggle';
import { MobileMenu } from '@/components/public/header/MobileMenu';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import type { HeaderProps } from '@/types/header-footer.types';
import '@/styles/public-header.css';

export function Header({ pageType }: HeaderProps) {
  const { scrollPosition } = useHeaderScroll();
  const headerRef = useRef<HTMLElement>(null);
  const [passionRotate, setPassionRotate] = useState(0);

  const isAtTop = scrollPosition <= 4;
  const passionShadowSize = 4 + Math.min(scrollPosition / 20, 4);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (pageType !== 'passion' || !headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    setPassionRotate(relativeX < 0.5 ? 1.5 : -1.5);
  };

  const handleMouseLeave = () => {
    if (pageType === 'passion') setPassionRotate(0);
  };

  const headerStyle =
    pageType === 'passion'
      ? {
          boxShadow: `${passionShadowSize}px ${passionShadowSize}px 0px var(--border)`,
          transform: `rotate(${passionRotate}deg)`,
        }
      : undefined;

  return (
    <header
      ref={headerRef}
      className={`header header-${pageType}${isAtTop && pageType === 'intellect' ? ' header-intellect--top' : ''}`}
      style={headerStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="/" className="header-brand">
        hakim ulinnuha
      </Link>
      <div className="header-right">
        <Navigation pageType={pageType} />
        <div className="header-actions">
          <ThemeToggle />
          <MobileMenu pageType={pageType} />
        </div>
      </div>
    </header>
  );
}

export default Header;