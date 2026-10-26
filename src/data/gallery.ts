export type GalleryCategory = 'solo' | 'together' | 'craft' | 'candid';

export type GalleryItem = {
  id: string;
  src: string;
  category: GalleryCategory;
  alt: string;
  caption?: string;
};

export { galleryItems } from '../generated/galleryItems';

export const categoryLabels: Record<GalleryCategory, string> = {
  solo: 'Ruu solo',
  together: 'Together',
  craft: 'Crafts & art',
  candid: 'Candid',
};
