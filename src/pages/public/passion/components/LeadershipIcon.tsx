// src/pages/public/passion/components/LeadershipIcon.tsx
import type { SVGProps } from 'react'
type IconName = 'award' | 'users' | 'externallink' | 'heart' | 'mic' | 'shield' | 'play' | 'truck' | 'star' | 'flag'
function resolveIcon(icon: string | null): IconName {
  const key = (icon || '').toLowerCase().replace(/\s+/g, '')
  const known: IconName[] = ['award', 'users', 'externallink', 'heart', 'mic', 'shield', 'play', 'truck', 'star', 'flag']
  return (known as string[]).includes(key) ? (key as IconName) : 'award'
}
interface LeadershipIconProps extends SVGProps<SVGSVGElement> {
  icon: string | null
}
export function LeadershipIcon({ icon, ...props }: LeadershipIconProps) {
  const resolved = resolveIcon(icon)
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {resolved === 'award' && (
        <>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5" />
        </>
      )}
      {resolved === 'users' && (
        <>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20c.5-3.5 3-5.5 5.5-5.5s5 2 5.5 5.5" />
          <circle cx="17" cy="8.5" r="2.6" />
          <path d="M15.5 14.7c1.9.4 3.6 2.1 4 5.3" />
        </>
      )}
      {resolved === 'externallink' && (
        <>
          <path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
          <path d="M14 4h6v6" />
          <path d="M10 14L20 4" />
        </>
      )}
      {resolved === 'heart' && (
        <path d="M12 20s-7-4.4-9.3-8.8C1.2 8 2.4 5 5.4 4.4 7.6 4 9.8 5 12 7.5 14.2 5 16.4 4 18.6 4.4c3 .6 4.2 3.6 2.7 6.8C19 15.6 12 20 12 20z" />
      )}
      {resolved === 'mic' && (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v4M8 22h8" />
        </>
      )}
      {resolved === 'shield' && <path d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5z" />}
      {resolved === 'play' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8.5l6 3.5-6 3.5z" />
        </>
      )}
      {resolved === 'truck' && (
        <>
          <rect x="1" y="7" width="13" height="9" rx="1" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="6" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </>
      )}
      {resolved === 'star' && <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16.8 6 20l1.5-6.5-5-4.4 6.6-.6z" />}
      {resolved === 'flag' && (
        <>
          <path d="M5 3v18" />
          <path d="M5 4h13l-3 4 3 4H5" />
        </>
      )}
    </svg>
  )
}