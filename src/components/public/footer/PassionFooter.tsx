// src/components/public/footer/PassionFooter.tsx
import { useMemo } from 'react';
import type { FooterComponentProps, NavItem } from '@/types/header-footer.types';
import '@/styles/public-footer.css';

const QUICK_NAV: NavItem[] = [
  { label: 'Identity', path: '/identity' },
  { label: 'Intellect', path: '/intellect' },
  { label: 'Passion', path: '/passion' },
];

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function PassionFooter({ profile, socials }: FooterComponentProps) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="footer-passion__container">
      <div className="footer-passion__box footer-passion__box--about">
        <p className="footer-passion__name">{profile.name}</p>
        <p className="footer-passion__bio">Based in {profile.location}</p>
      </div>

      <div className="footer-passion__box footer-passion__box--contact">
        <span className="footer-passion__section-title">Contact</span>
        <p className="footer-passion__item">
          <a href={`mailto:${profile.email}`} className="footer-passion__link">
            {profile.email}
          </a>
        </p>
        {profile.phone && (
          <p className="footer-passion__item">
            <a href={`tel:${profile.phone}`} className="footer-passion__link">
              {profile.phone}
            </a>
          </p>
        )}
      </div>

      <div className="footer-passion__box footer-passion__box--follow">
        <span className="footer-passion__section-title">Follow</span>
        {socials.map((social) => (
          <p key={social.platform} className="footer-passion__item">
            <a
              href={social.url}
              className="footer-passion__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {stripProtocol(social.url)}
            </a>
          </p>
        ))}
      </div>

      <div className="footer-passion__box footer-passion__box--nav">
        <span>View more: </span>
        {QUICK_NAV.map((item, index) => (
          <span key={item.path}>
            <a href={item.path} className="footer-passion__link">
              {item.label}
            </a>
            {index < QUICK_NAV.length - 1 && <span className="footer-passion__arrow">|</span>}
          </span>
        ))}
      </div>

      <div className="footer-passion__box footer-passion__box--copyright">
        © {year} — ALL RIGHTS
      </div>
    </div>
  );
}

export default PassionFooter;