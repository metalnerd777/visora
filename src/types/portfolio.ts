export interface Photographer {
  name: string
  profession: string
  description: string
  aboutTitle: string
  aboutDescription: string
  email: string
  location: string
  instagram?: string
  behance?: string
  website?: string
}

export interface Photo {
  id: number
  url: string
  title: string
}

export interface Gallery {
  id: string
  title: string
  description: string
  cover: string
  photos: Photo[]
}