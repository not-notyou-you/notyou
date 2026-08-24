// src/types/header-footer.types.ts
export type PageType = 'identity' | 'intellect' | 'passion';

export interface NavItem {
  label: string;
  path: string;
}

export interface ProfileData {
  name: string;
  location: string;
  email: string;
  phone: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  position?: number;
}

export interface HeaderProps {
  pageType: PageType;
}

export interface FooterProps {
  pageType: PageType;
}

export interface FooterComponentProps {
  profile: ProfileData;
  socials: SocialLink[];
}

export interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}