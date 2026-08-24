// src/components/public/header/MobileMenu.tsx
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { HeaderProps, NavItem } from '@/types/header-footer.types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Identity', path: '/identity' },
  { label: 'Intellect', path: '/intellect' },
  { label: 'Passion', path: '/passion' },
];

export function MobileMenu({ pageType }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className={`mobile-menu-button${isOpen ? ' active' : ''}`}
        onClick={handleToggle}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="mobile-menu-button__box">
          <span className="mobile-menu-button__bar mobile-menu-button__bar--top" />
          <span className="mobile-menu-button__bar mobile-menu-button__bar--middle" />
          <span className="mobile-menu-button__bar mobile-menu-button__bar--bottom" />
        </span>
      </button>
      <ul className={`mobile-menu${isOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MobileMenu;