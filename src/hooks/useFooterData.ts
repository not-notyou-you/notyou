// src/hooks/useFooterData.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ProfileData, SocialLink } from '@/types/header-footer.types';

interface UseFooterDataReturn {
  profile: ProfileData | null;
  socials: SocialLink[];
  loading: boolean;
  error: string | null;
}

export function useFooterData(): UseFooterDataReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, socialsRes] = await Promise.all([
          supabase.from('profile').select('name, location, email, phone').single(),
          supabase
            .from('socials')
            .select('platform, url, position')
            .eq('is_visible', true)
            .order('position', { ascending: true }),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (socialsRes.error) throw socialsRes.error;

        if (isMounted) {
          setProfile(profileRes.data as ProfileData);
          setSocials((socialsRes.data ?? []) as SocialLink[]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load footer data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, socials, loading, error };
}