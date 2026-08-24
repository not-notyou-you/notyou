// src/components/public/header/Navigation.tsx
import { useLocation, Link } from 'react-router-dom';
import type { HeaderProps, NavItem } from '@/types/header-footer.types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Identity', path: '/identity' },
  { label: 'Intellect', path: '/intellect' },
  { label: 'Passion', path: '/passion' },
];

export function Navigation({ pageType }: HeaderProps) {
  const location = useLocation();

  return (
    <ul className="header-nav">
      {NAV_ITEMS.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;