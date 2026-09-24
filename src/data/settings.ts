import type { SiteSettings } from "../types/portfolio";
import { profile as defaultProfile } from "./portfolio";

export const SETTINGS_VERSION = 2;

export const defaultSettings: SiteSettings = {
  version: SETTINGS_VERSION,
  general: {
    brandName: defaultProfile.name,
    profession: defaultProfile.profession,
    language: "es",
    favicon: "",
  },
  seo: {
    title: "",
    description: "",
    ogImage: "",
    noindex: false,
  },
  appearance: {
    theme: "minimal",
    mode: "system",
    primaryColor: "#7C6CFF",
    background: { color1: "#F7F7FA", color2: "#FDEBEF" },
    fontFamily: "Montserrat",
    borderRadius: "lg",
    buttonStyle: "pill",
  },
  socials: defaultProfile.socialLinks,
  privacy: {
    showEmail: true,
    showLocation: true,
    notice: "",
    protectImages: false,
    cookieNotice: "",
    watermarkEnabled: false,
    watermarkStyle: "tiling",
    watermarkOpacity: 0.18,
    watermarkText: "",
  },
  site: {
    published: true,
  },
};
