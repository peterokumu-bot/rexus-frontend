export interface SiteSettings {
  id: string;
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  footerLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  placeholderImageUrl: string | null;
}