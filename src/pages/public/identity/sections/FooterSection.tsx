// src/pages/public/identity/sections/FooterSection.tsx
import { IdentityFooter } from '@/components/public/footer/IdentityFooter'
import { useFooterData } from '@/hooks/useFooterData'

export function FooterSection() {
  const { profile, socials, loading, error } = useFooterData()
  if (loading || error || !profile) return null
  return (
    <section className="identity-section identity-section--gallery" aria-labelledby="contact-title">
      <div className="identity-section__title-rail">
        <h2 id="contact-title" className="identity-section__title identity-section__title--side">
          Contact
        </h2>
      </div>
      <div className="identity-footer-section footer-identity">
        <IdentityFooter profile={profile} socials={socials} />
      </div>
    </section>
  )
}