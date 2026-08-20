import type { PortfolioData } from '../types/portfolio'

export const demoData: PortfolioData = {
  photographer: {
    name: 'Alex Morgan',
    title: 'Fotógrafo',
    bio: 'Fotografía documental, retratos y momentos especiales.',
    location: 'Santiago, Chile',
  },

  socialLinks: {
    instagram: 'https://instagram.com/',
  },

  galleries: [],

  projects: [],

  favorites: [],

  settings: {
    theme: 'minimal',
    primaryColor: '#111111',
    secondaryColor: '#666666',
    backgroundColor: '#ffffff',
    textColor: '#111111',
    watermarkEnabled: true,
    downloadsEnabled: false,
  },
}