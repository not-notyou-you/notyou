// src/pages/public/identity/sections/FooterSection.tsx
import { IdentityFooter } from '@/components/public/footer/IdentityFooter'
import { useFooterData } from '@/hooks/useFooterData'

export function FooterSection() {
  const { profile, socials, loading, error } = useFooterData()
  if (loading || error || !profile) return null
  return (
    <section className="identity-footer-section footer-identity" aria-label="Contact">
      <IdentityFooter profile={profile} socials={socials} />
    </section>
  )
}