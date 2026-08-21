import type { Photographer, Gallery, Photo } from '../types/portfolio'

export const photographer: Photographer = {
  name: 'Alex Morgan',
  profession: 'Fotógrafo',
  description:
    'Fotografía documental, retratos y momentos que merecen ser recordados.',
  aboutTitle: 'Historias contadas a través de imágenes.',
  aboutDescription:
    'Soy fotógrafo especializado en capturar momentos auténticos, personas y lugares. Mi objetivo es crear imágenes que conserven la emoción de cada historia.',
  email: 'hello@example.com',
  location: 'Santiago, Chile',
  instagram: '@alexmorgan',
  behance: 'alexmorgan',
}

export const galleries: Gallery[] = [
  {
    id: 'weddings',
    title: 'Bodas',
    description: 'Momentos únicos de un día especial.',
    cover:
      'https://images.unsplash.com/photo-1519741497674-611481863552',
    photos: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        title: 'Ceremonia',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
        title: 'Celebración',
      },
    ],
  },

  {
    id: 'portraits',
    title: 'Retratos',
    description: 'Personas, personalidad e historias.',
    cover:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    photos: [
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
        title: 'Retrato I',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        title: 'Retrato II',
      },
    ],
  },

  {
    id: 'landscapes',
    title: 'Paisajes',
    description: 'Lugares y momentos encontrados.',
    cover:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    photos: [
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
        title: 'Paisaje I',
      },
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624',
        title: 'Paisaje II',
      },
    ],
  },
]

export const favorites: Photo[] = [
  {
    id: 101,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    title: 'Una tarde especial',
  },
  {
    id: 102,
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    title: 'Retrato',
  },
  {
    id: 103,
    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    title: 'Paisaje',
  },
]

export const featuredPhotos: Photo[] = [
  {
    id: 201,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    title: 'Ceremonia',
  },
  {
    id: 202,
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    title: 'Retrato',
  },
  {
    id: 203,
    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7',
    title: 'Paisaje',
  },
  {
    id: 204,
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
    title: 'Celebración',
  },
  {
    id: 205,
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    title: 'Retrato II',
  },
  {
    id: 206,
    url: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624',
    title: 'Paisaje II',
  },
  {
    id: 207,
    url: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde',
    title: 'Arquitectura',
  },
  {
    id: 208,
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    title: 'Editorial',
  },
]