// src/components/public/footer/SocialIcon.tsx
import type { SVGProps } from 'react';

type IconName =
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'telegram'
  | 'whatsapp'
  | 'idline'
  | 'phone'
  | 'email'
  | 'location'
  | 'link';

function resolveIcon(name: string): IconName {
  const key = name.toLowerCase();
  const known: IconName[] = [
    'instagram',
    'linkedin',
    'github',
    'telegram',
    'whatsapp',
    'idline',
    'phone',
    'email',
    'location',
  ];
  return (known as string[]).includes(key) ? (key as IconName) : 'link';
}

export function SocialIcon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  const icon = resolveIcon(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {icon === 'instagram' && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
        </>
      )}
      {icon === 'linkedin' && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="7.5" y1="10" x2="7.5" y2="16.5" />
          <circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
          <path d="M11.5 16.5V12.2c0-1.3 1-2.2 2.2-2.2s2.1.9 2.1 2.2v4.3" />
        </>
      )}
      {icon === 'github' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="11.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
          <path d="M8 16c1 1 7 1 8 0" />
        </>
      )}
      {icon === 'telegram' && <path d="M21 4L3 11.5l6 2M21 4l-3.5 16-5.5-6.5M21 4l-11 8.5" />}
      {icon === 'whatsapp' && (
        <>
          <path d="M6 18l-1.5 3 3.2-1.3A8 8 0 1 0 6 18z" />
          <path d="M9 10c0 3 2 5 5 5 .3-1 .3-2-.3-2.2-.6-.2-1.4.6-1.8.4C10.8 12.6 10 11 9.8 10.4c-.2-.6.7-1 .4-1.6C9.9 8.2 9 8.3 9 10z" />
        </>
      )}
      {icon === 'idline' && (
        <>
          <rect x="3" y="5" width="18" height="12" rx="6" />
          <line x1="7.5" y1="9" x2="7.5" y2="13" />
          <line x1="16.5" y1="9" x2="16.5" y2="13" />
          <path d="M10.5 9v4M13.5 9v4" />
        </>
      )}
      {icon === 'phone' && (
        <path d="M7 4h2l1 4-2 1.5c1 2.5 2.5 4 5 5l1.5-2 4 1v2c0 1-1 2-2 2C10.5 17.5 6.5 13.5 5 8c0-1 1-2 2-2z" />
      )}
      {icon === 'email' && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 6l9 7 9-7" />
        </>
      )}
      {icon === 'location' && (
        <>
          <path d="M12 21s-6.5-6.1-6.5-10.5A6.5 6.5 0 0 1 18.5 10.5C18.5 14.9 12 21 12 21z" />
          <circle cx="12" cy="10.5" r="2" />
        </>
      )}
      {icon === 'link' && (
        <>
          <path d="M10 14l4-4" />
          <path d="M8 16l-2 2a3 3 0 0 1-4-4l2-2" />
          <path d="M16 8l2-2a3 3 0 0 1 4 4l-2 2" />
        </>
      )}
    </svg>
  );
}

export default SocialIcon;