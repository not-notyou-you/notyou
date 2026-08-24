// src/components/public/footer/IntellectFooter.tsx
import { useEffect, useMemo, useState } from 'react';
import type { FooterComponentProps } from '@/types/header-footer.types';
import '@/styles/public-footer.css';

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function pad(value: number, length = 2): string {
  return value.toString().padStart(length, '0');
}

function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 31);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function IntellectFooter({ profile, socials }: FooterComponentProps) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const now = useClock();
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const ms = pad(now.getMilliseconds(), 3);

  return (
    <>
      <div className="footer-intellect__columns">
        <div className="footer-intellect__section">
          <p className="footer-intellect__prompt">contact</p>
          <p className="footer-intellect__info">
            <span className="footer-intellect__section-title">LOCATION:</span> {profile.location}
          </p>
          <p className="footer-intellect__info">
            <span className="footer-intellect__section-title">EMAIL:</span>{' '}
            <a href={`mailto:${profile.email}`} className="footer-intellect__link">
              {profile.email}
            </a>
          </p>
          {profile.phone && (
            <p className="footer-intellect__info">
              <span className="footer-intellect__section-title">PHONE:</span>{' '}
              <a href={`tel:${profile.phone}`} className="footer-intellect__link">
                {profile.phone}
              </a>
            </p>
          )}
          <p className="footer-intellect__prompt footer-intellect__prompt--sub">about</p>
          <p className="footer-intellect__info">
            Portfolio of {profile.name}, based in {profile.location}
            <span className="footer-intellect__cursor" aria-hidden="true" />
          </p>
        </div>

        <div className="footer-intellect__section">
          <p className="footer-intellect__prompt">connect</p>
          {socials.map((social) => (
            <p key={social.platform} className="footer-intellect__line">
              <a
                href={social.url}
                className="footer-intellect__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {stripProtocol(social.url)}
              </a>
            </p>
          ))}
        </div>

        <div className="footer-intellect__section footer-intellect__section--clock">
          <p className="footer-intellect__prompt">time</p>
          <div className="footer-intellect__clock" aria-label="current time">
            <span className="footer-intellect__clock-time">
              {hh}:{mm}
            </span>
            <span className="footer-intellect__clock-sub">
              {ss}:{ms}
            </span>
          </div>
        </div>
      </div>

      <div className="footer-intellect__copyright">© {year} | v1.0</div>
    </>
  );
}

export default IntellectFooter;