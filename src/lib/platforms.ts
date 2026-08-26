import type { SocialPlatform } from "../types/portfolio";

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "behance", label: "Behance" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "vimeo", label: "Vimeo" },
  { value: "flickr", label: "Flickr" },
];

export default PLATFORM_OPTIONS;
