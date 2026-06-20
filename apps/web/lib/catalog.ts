export type CatalogItem = {
  slug: string;
  name: string;
  type: 'Physical' | 'Digital';
  description: string;
  price: string;
  status: string;
};

export const catalog: CatalogItem[] = [
  {
    slug: 'rainbow-cake',
    name: 'Rainbow Cake',
    type: 'Physical',
    description: 'A vibrant celebration cake for birthdays and special moments.',
    price: 'From KES 2,500',
    status: 'In stock'
  },
  {
    slug: 'recipe-book',
    name: 'Recipe Book PDF',
    type: 'Digital',
    description: 'Premium bakery recipes with secure post-purchase access.',
    price: 'KES 1,200',
    status: 'Protected download'
  },
  {
    slug: 'training-videos',
    name: 'Training Videos',
    type: 'Digital',
    description: 'Step-by-step baking lessons for customers and trainees.',
    price: 'KES 3,500',
    status: 'Protected download'
  }
];
