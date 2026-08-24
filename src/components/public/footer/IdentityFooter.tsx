// src/components/public/footer/IdentityFooter.tsx
import { useMemo } from 'react';
import type { FooterComponentProps } from '@/types/header-footer.types';
import '@/styles/public-footer.css';

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function IdentityFooter({ profile, socials }: FooterComponentProps) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <p className="footer-identity__name">{profile.name}</p>

      <div className="footer-identity__columns">
        <div className="footer-identity__col">
          <div className="footer-identity__section">
            <span className="footer-identity__label">Location</span>
            <div className="footer-identity__content">{profile.location}</div>
          </div>

          <div className="footer-identity__section">
            <span className="footer-identity__label">Contact</span>
            <div className="footer-identity__content">
              <a href={`mailto:${profile.email}`} className="footer-identity__link">
                {profile.email}
              </a>
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="footer-identity__link">
                  {profile.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-identity__col">
          <div className="footer-identity__section">
            <span className="footer-identity__label">Follow</span>
            <div className="footer-identity__content">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="footer-identity__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {stripProtocol(social.url)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-identity__copyright">© {year}. All rights reserved.</div>
    </>
  );
}

export default IdentityFooter;