import type { Element } from "./elements";

export interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  favicon?: string;
  socialImage?: string;
  customCss?: string;
}

export interface Site {
  id: string;
  userId: string;
  name: string;
  slug: string;
  templateId?: string;
  settings: SiteSettings;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  pages?: Page[];
}

export interface Page {
  id: string;
  siteId: string;
  name: string;
  slug: string;
  elements: Element[];
  isHomepage: boolean;
  order: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "student-house" | "sports-team" | "event" | "association";
  pages: Omit<Page, "id" | "siteId" | "createdAt" | "updatedAt">[];
  settings: SiteSettings;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  primaryColor: "#3b82f6",
  secondaryColor: "#1f2937",
  fontFamily: "Inter",
};

export interface CreateSiteInput {
  name: string;
  templateId?: string;
}

export interface UpdateSiteInput {
  name?: string;
  slug?: string;
  settings?: Partial<SiteSettings>;
}

export interface CreatePageInput {
  name: string;
  slug?: string;
  isHomepage?: boolean;
}

export interface UpdatePageInput {
  name?: string;
  slug?: string;
  elements?: Element[];
  isHomepage?: boolean;
  order?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
}
