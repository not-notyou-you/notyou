// src/hooks/useFooterData.ts
import { useMemo } from 'react';
import { usePublicData } from '@/contexts/PublicDataContext';
import type { ProfileData, SocialLink } from '@/types/header-footer.types';

interface UseFooterDataReturn {
  profile: ProfileData | null;
  socials: SocialLink[];
  loading: boolean;
  error: string | null;
}

/**
 * Reads profile + socials from PublicDataProvider (fetched once for the whole
 * public site) instead of firing its own Supabase query — footers mount and
 * unmount repeatedly (e.g. every Passion panel switch) and must not refetch.
 * Mapped profile/socials are memoized so consumers get stable references
 * across re-renders (effects keyed on them would otherwise loop forever).
 */
export function useFooterData(): UseFooterDataReturn {
  const { profile, socials, loading } = usePublicData();

  const mappedProfile = useMemo<ProfileData | null>(
    () =>
      profile
        ? {
            name: profile.name,
            location: profile.location ?? '',
            email: profile.email ?? '',
            phone: profile.phone,
          }
        : null,
    [profile]
  );

  const mappedSocials = useMemo<SocialLink[]>(
    () =>
      socials
        .filter((social) => social.is_visible && social.url)
        .sort((a, b) => a.position - b.position)
        .map((social) => ({ platform: social.platform, url: social.url as string, position: social.position })),
    [socials]
  );

  return { profile: mappedProfile, socials: mappedSocials, loading, error: null };
}
