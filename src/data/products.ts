import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'home', name: 'Home & Kitchen', icon: 'Home' },
  { id: 'books', name: 'Books', icon: 'Book' },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell' },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles' }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 134900,
    originalPrice: 159900,
    discount: 16,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg'
    ],
    category: 'electronics',
    brand: 'Apple',
    rating: 4.6,
    reviewCount: 1847,
    description: 'The most advanced iPhone yet with titanium design, A17 Pro chip, and pro camera system.',
    features: [
      'A17 Pro chip with 6-core GPU',
      '6.7" Super Retina XDR display',
      'Pro camera system with 48MP main camera',
      'Titanium design with Action Button',
      'USB-C connector'
    ],
    inStock: true,
    fastDelivery: true,
    freeShipping: true
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    price: 99900,
    originalPrice: 119900,
    discount: 17,
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
    images: [
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg'
    ],
    category: 'electronics',
    brand: 'Apple',
    rating: 4.8,
    reviewCount: 924,
    description: 'Supercharged by M2 chip. Incredibly thin and light with all-day battery life.',
    features: [
      'Apple M2 8-core CPU',
      '13.6" Liquid Retina display',
      'Up to 18 hours battery life',
      'MagSafe charging port',
      'Two Thunderbolt ports'
    ],
    inStock: true,
    fastDelivery: true,
    freeShipping: true
  },
  {
    id: '3',
    name: 'Samsung Galaxy Watch 6',
    price: 29999,
    originalPrice: 32999,
    discount: 9,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg'
    ],
    category: 'electronics',
    brand: 'Samsung',
    rating: 4.3,
    reviewCount: 567,
    description: 'Advanced smartwatch with comprehensive health tracking and sleek design.',
    features: [
      'Advanced health monitoring',
      'GPS tracking',
      'Water resistant IP68',
      '40mm Super AMOLED display',
      '40+ workout modes'
    ],
    inStock: true,
    fastDelivery: false,
    freeShipping: true
  },
  {
    id: '4',
    name: 'Nike Air Force 1',
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
    ],
    category: 'fashion',
    brand: 'Nike',
    rating: 4.5,
    reviewCount: 892,
    description: 'Classic basketball shoe with iconic style and superior comfort.',
    features: [
      'Full-grain leather upper',
      'Air-Sole unit in heel',
      'Rubber outsole with pivot points',
      'Foam midsole',
      'Classic basketball style'
    ],
    inStock: true,
    fastDelivery: true,
    freeShipping: false
  },
  {
    id: '5',
    name: 'Wireless Bluetooth Headphones',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'
    ],
    category: 'electronics',
    brand: 'SoundMax',
    rating: 4.2,
    reviewCount: 1203,
    description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
    features: [
      'Active noise cancellation',
      '30-hour battery life',
      'Bluetooth 5.0 connectivity',
      'Premium sound drivers',
      'Comfortable over-ear design'
    ],
    inStock: true,
    fastDelivery: true,
    freeShipping: true
  },
  {
    id: '6',
    name: 'Coffee Maker Premium',
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    images: [
      'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
      'https://images.pexels.com/photos/2575038/pexels-photo-2575038.jpeg'
    ],
    category: 'home',
    brand: 'BrewMaster',
    rating: 4.4,
    reviewCount: 445,
    description: 'Professional-grade coffee maker with programmable settings and thermal carafe.',
    features: [
      'Programmable 24-hour timer',
      'Thermal carafe keeps coffee hot',
      '12-cup capacity',
      'Auto shut-off feature',
      'Permanent gold-tone filter'
    ],
    inStock: true,
    fastDelivery: false,
    freeShipping: true
  }
];