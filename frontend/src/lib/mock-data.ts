import { Product } from './types';

// Premium product images — curated for a high-end gadget store look
const PRODUCT_IMAGES: Record<string, string[]> = {
  'Gaming Smartphone': [
    'https://i.pinimg.com/736x/d2/64/4b/d2644b9b2b03e52f51d9cc4d7c13e816.jpg',
    'https://i.pinimg.com/736x/88/9e/56/889e5612f0e7e0d9a4d0b9af52c3c7a6.jpg',
  ],
  'Gaming Laptop': [
    'https://i.pinimg.com/736x/fa/1b/07/fa1b077b22f6f81e92c9e3a3f9bb42c3.jpg',
    'https://i.pinimg.com/736x/0d/e3/b0/0de3b026a1c58e60a32d4af54b0f35e5.jpg',
  ],
  'Gaming Monitor': [
    'https://i.pinimg.com/736x/6e/57/c5/6e57c597a6e2d76cf9a7e0d68cbe7e2f.jpg',
  ],
  'Gaming Mouse': [
    'https://i.pinimg.com/736x/a3/75/f1/a375f18bc93e84cf3d0c2b1e4c6f5d8a.jpg',
  ],
  'Gaming Keyboard': [
    'https://i.pinimg.com/736x/29/3c/2c/293c2c42c3df34b69f15e1f6c47f8d90.jpg',
  ],
  'Gaming Headset': [
    'https://i.pinimg.com/736x/ec/63/e5/ec63e5a9c1dd4eb01f37e6c9b5f3f2a7.jpg',
  ],
  'Graphics Card': [
    'https://i.pinimg.com/736x/51/8f/67/518f670c3ffbd3d9d76fc6e0a9b8cf0e.jpg',
  ],
  'Processor': [
    'https://i.pinimg.com/736x/cd/d0/8d/cdd08d9b2e1c5e5a0dc18b88e0c6ffa6.jpg',
  ],
  'Memory': [
    'https://i.pinimg.com/736x/d4/9b/0b/d49b0b2dc9e46cfc15c9e8a03c3ee267.jpg',
  ],
  'Storage': [
    'https://i.pinimg.com/736x/be/7f/f9/be7ff98cf7e5dd86f56c7f8bb3da8c40.jpg',
  ],
};

// Fallback images by category type
const CATEGORY_FALLBACK: Record<string, string> = {
  'Gaming Smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
  'Gaming Laptop': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop',
  'Gaming Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
  'Gaming Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  'Gaming Keyboard': 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
  'Gaming Headset': 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop',
  'Graphics Card': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=600&fit=crop',
  'Processor': 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=600&fit=crop',
  'Memory': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&h=600&fit=crop',
  'Storage': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop',
};

export function getProductImage(product: Product): string {
  // Use product's own images first
  if (product.images && product.images.length > 0 && product.images[0] !== '') {
    return product.images[0];
  }
  // Fallback to curated images
  return CATEGORY_FALLBACK[product.category] || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=600&fit=crop';
}

// Mock products matching the 20 seeded products from Prisma seed
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: 'ASUS ROG Phone 7 Ultimate',
    description: 'Ultra-powerful gaming phone with Snapdragon 8 Gen 2 and 24GB RAM',
    price: 19999000,
    stock: 15,
    category: 'Gaming Smartphone',
    techSpecs: { processor: 'Snapdragon 8 Gen 2', ram: '24GB', storage: '512GB', display: '6.78" AMOLED 165Hz', battery: '5000mAh' },
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: 'MSI Raider GE78 HX',
    description: 'Dual-GPU setup for maximum AAA game performance',
    price: 24999000,
    stock: 8,
    category: 'Gaming Laptop',
    techSpecs: { processor: 'Intel Core i9-13900HX', gpu: 'RTX 4090 16GB', ram: '64GB DDR5', storage: '2TB NVMe', display: '17.3" 4K 144Hz' },
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship smartphone with AI-powered camera and S-Pen',
    price: 21999000,
    stock: 20,
    category: 'Gaming Smartphone',
    techSpecs: { processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', display: '6.8" Dynamic AMOLED 120Hz', battery: '5000mAh' },
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    name: 'ASUS ROG Zephyrus G14 2025',
    description: 'Ultra-slim gaming laptop with RTX 4070 performance',
    price: 27999000,
    stock: 12,
    category: 'Gaming Laptop',
    techSpecs: { processor: 'AMD Ryzen 9 8945HS', gpu: 'RTX 4070 8GB', ram: '32GB DDR5', storage: '1TB NVMe', display: '14" QHD+ 165Hz' },
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    name: 'LG UltraGear 27GP950',
    description: '4K 160Hz Nano IPS gaming monitor with HDMI 2.1',
    price: 12499000,
    stock: 10,
    category: 'Gaming Monitor',
    techSpecs: { panel: 'Nano IPS', resolution: '3840x2160', refreshRate: '160Hz', responseTime: '1ms', hdr: 'HDR600' },
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    name: 'Logitech G Pro X Superlight 2',
    description: 'Ultra-lightweight wireless gaming mouse at just 60g',
    price: 2399000,
    stock: 30,
    category: 'Gaming Mouse',
    techSpecs: { sensor: 'HERO 2', dpi: '32000', weight: '60g', battery: '95 hours', connectivity: 'LIGHTSPEED Wireless' },
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-7',
    name: 'Apple iPad Pro M4 13"',
    description: 'The thinnest and most powerful iPad ever with M4 chip and tandem OLED',
    price: 23999000,
    stock: 14,
    category: 'Gaming Laptop',
    techSpecs: { processor: 'Apple M4', ram: '16GB', storage: '512GB', display: '13" Ultra Retina XDR OLED', battery: '10 hours' },
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-8',
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch for extreme adventures',
    price: 14999000,
    stock: 18,
    category: 'Gaming Headset',
    techSpecs: { processor: 'S9 SiP', display: '49mm Always-On Retina', battery: '36 hours', waterResistance: '100m', gps: 'Precision dual-frequency L1/L5' },
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_CATEGORIES = [
  'Gaming Smartphone',
  'Gaming Laptop',
  'Gaming Monitor',
  'Gaming Mouse',
  'Gaming Keyboard',
  'Gaming Headset',
  'Graphics Card',
  'Processor',
  'Memory',
  'Storage',
];
