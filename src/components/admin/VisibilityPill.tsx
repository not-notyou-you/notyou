export function VisibilityPill({ visible }: { visible: boolean }) {
  return <span className={`pill ${visible ? '' : 'pill--hidden'}`}>{visible ? 'Visible' : 'Hidden'}</span>
}

export function FeaturedPill({ featured }: { featured: boolean }) {
  if (!featured) return null
  return <span className="pill pill--featured">Featured</span>
}
