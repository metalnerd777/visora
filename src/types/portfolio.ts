export interface Photographer {
  name: string
  title: string
  bio: string
  location?: string
  profileImage?: string
  logo?: string
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  behance?: string
  flickr?: string
}

export interface Photo {
  id: string
  title?: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  isFavorite: boolean
  order: number
}

export interface Gallery {
  id: string
  title: string
  description?: string
  coverImage: string
  photos: Photo[]
  order: number
  published: boolean
}

export interface Project {
  id: string
  title: string
  description?: string
  location?: string
  date?: string
  coverImage: string
  photos: Photo[]
  published: boolean
}

export interface SiteSettings {
  theme: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  watermarkEnabled: boolean
  downloadsEnabled: boolean
}

export interface PortfolioData {
  photographer: Photographer
  socialLinks: SocialLinks
  galleries: Gallery[]
  projects: Project[]
  favorites: Photo[]
  settings: SiteSettings
}