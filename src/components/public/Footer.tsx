// src/components/public/Footer.tsx
import { IdentityFooter } from '@/components/public/footer/IdentityFooter';
import { IntellectFooter } from '@/components/public/footer/IntellectFooter';
import { PassionFooter } from '@/components/public/footer/PassionFooter';
import { useFooterData } from '@/hooks/useFooterData';
import type { FooterProps } from '@/types/header-footer.types';

export function Footer({ pageType }: FooterProps) {
  const { profile, socials, loading, error } = useFooterData();

  return (
    <footer className={`footer footer-${pageType}`}>
      {loading && <p className="footer__status">Loading...</p>}
      {error && <p className="footer__status">{error}</p>}
      {!loading && !error && profile && (
        <>
          {pageType === 'identity' && <IdentityFooter profile={profile} socials={socials} />}
          {pageType === 'intellect' && <IntellectFooter profile={profile} socials={socials} />}
          {pageType === 'passion' && <PassionFooter profile={profile} socials={socials} />}
        </>
      )}
    </footer>
  );
}

export default Footer;