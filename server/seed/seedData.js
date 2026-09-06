const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const initialCategories = [
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Traditional South Indian Kasu Malas, Mango Malas, Chokers, and Temple Harams in 22K gold.',
    image: '/assets/category_necklace.webp',
    featured: true,
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Temple Nakshi Jhumkas, Chandbalis, and Diamond Drops with certified gemstones and pearls.',
    image: '/assets/category_earrings.webp',
    featured: true,
  },
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaire engagement rings, Lotus cocktail rings, and 22K traditional gold bands.',
    image: '/assets/product_celeste_1.webp',
    featured: true,
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Hand-carved antique Nakshi bangles, floral gold kadas, and everyday wristwear.',
    image: '/assets/category_bangles.webp',
    featured: true,
  },
  {
    name: 'Chains',
    slug: 'chains',
    description: '22K gold daily chains, mugappu chains, and lightweight rope chains.',
    image: '/assets/category_chains.webp',
    featured: true,
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    description: 'Sacred Lakshmi, Ganesha, and Peacock temple pendants with ruby and emerald accents.',
    image: '/assets/category_pendants.webp',
    featured: true,
  },
  {
    name: 'Bridal Collection',
    slug: 'bridal',
    description: 'Regal bridal sets, temple vaddanams, and royal multi-layered harams for wedding celebrations.',
    image: '/assets/category_bridal.webp',
    featured: true,
  }
];

const initialProducts = [
  {
    id: '1',
    name: 'Lakshmi Kasu Mala Gold Necklace',
    slug: 'lakshmi-kasu-mala-gold-necklace',
    description: 'An auspicious 22K yellow gold Kasu Mala featuring embossed Lakshmi coins flanked by delicate ruby cabochons and natural pearl droplets. A timeless South Indian wedding and festival heirloom.',
    price: 84500,
    compareAtPrice: 95000,
    category: 'Necklaces',
    collectionName: 'Heritage',
    images: ['/assets/category_necklace.webp', '/assets/product_elan_1.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '26.4 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['16 inch', '18 inch', '20 inch'],
    purities: ['22K Gold', 'Antique 22K Finish'],
    stock: 10,
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 38,
  },
  {
    id: '2',
    name: 'Temple Nakshi Peacock Jhumkas',
    slug: 'temple-nakshi-peacock-jhumkas',
    description: 'Intricately handcrafted 22K temple gold jhumkas featuring regal peacock tops, ruby and emerald inlays, and cascading natural seed pearls.',
    price: 48900,
    compareAtPrice: 55000,
    category: 'Earrings',
    collectionName: 'Heritage',
    images: ['/assets/category_earrings.webp', '/assets/bridal_campaign.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '15.8 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['Standard Drop (45mm)'],
    purities: ['22K Gold', 'Antique 22K Finish'],
    stock: 12,
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 5.0,
    reviewsCount: 44,
  },
  {
    id: '3',
    name: 'Padma Lotus Solitaire Diamond Ring',
    slug: 'padma-lotus-solitaire-diamond-ring',
    price: 42500,
    compareAtPrice: 48000,
    category: 'Rings',
    collectionName: 'Solitaire',
    images: ['/assets/product_celeste_1.webp', '/assets/product_celeste_2.webp'],
    material: '18K Gold',
    purity: '18K Gold | IGI Certified Diamond',
    weight: '3.8 grams',
    diamondDetails: { carat: '0.85 ct', clarity: 'VVS1', color: 'F Color', certification: 'IGI Certified' },
    sizes: ['Size 12', 'Size 14', 'Size 16', 'Size 18', 'Size 20'],
    purities: ['18K Yellow Gold', '18K Rose Gold', '18K White Gold'],
    stock: 15,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 29,
  },
  {
    id: '4',
    name: 'Gaja Lakshmi Temple Gold Pendant',
    slug: 'gaja-lakshmi-temple-gold-pendant',
    description: 'Sacred 22K antique gold pendant depicting Goddess Lakshmi seated on a lotus flanked by divine elephants, with ruby accents and a pearl bunch drop.',
    price: 26800,
    compareAtPrice: 30000,
    category: 'Pendants',
    collectionName: 'Heritage',
    images: ['/assets/category_pendants.webp', '/assets/category_necklace.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '8.6 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['Pendant with Loop'],
    purities: ['22K Gold', 'Antique 22K Finish'],
    stock: 18,
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 31,
  },
  {
    id: '5',
    name: 'Heritage Antique Nakshi Gold Bangles',
    slug: 'heritage-antique-nakshi-gold-bangles',
    description: 'Pair of royal 22K Nakshi gold bangles deeply embossed with floral arabesques and temple filigree. Finished with a discreet side clasp.',
    price: 112000,
    compareAtPrice: 125000,
    category: 'Bangles',
    collectionName: 'Heritage',
    images: ['/assets/category_bangles.webp', '/assets/craftsmanship.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '38.5 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    purities: ['22K Gold', 'Antique 22K Finish'],
    stock: 6,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 5.0,
    reviewsCount: 52,
  },
  {
    id: '6',
    name: 'Suvarna Mugappu Gold Chain',
    slug: 'suvarna-mugappu-gold-chain',
    price: 32400,
    compareAtPrice: 36500,
    category: 'Chains',
    collectionName: 'Everyday',
    images: ['/assets/category_chains.webp', '/assets/category_gold.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '10.2 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['20 inch', '22 inch', '24 inch'],
    purities: ['22K Gold'],
    stock: 14,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 23,
  },
  {
    id: '7',
    name: 'Élan Antique Pearl Choker',
    slug: 'elan-antique-pearl-choker',
    description: 'Intricate openwork filigree choker set in 22K hallmarked gold with natural freshwater pearls and ruby accents.',
    price: 76900,
    compareAtPrice: 85000,
    category: 'Necklaces',
    collectionName: 'Heritage',
    images: ['/assets/product_elan_1.webp', '/assets/product_elan_2.webp'],
    material: '22K Gold',
    purity: '22K Gold | BIS 916 Hallmarked',
    weight: '24.8 grams',
    diamondDetails: { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark 916' },
    sizes: ['14 inch (Choker)', '16 inch'],
    purities: ['22K Gold', '18K Yellow Gold'],
    stock: 8,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.9,
    reviewsCount: 35,
  },
  {
    id: '8',
    name: 'Sitara Royal Polki Chandbalis',
    slug: 'sitara-royal-polki-chandbalis',
    description: 'Regal crescent earrings framing uncut syndicate polki diamonds accented with emerald beads and micro gold ghungroos.',
    price: 64000,
    compareAtPrice: 72000,
    category: 'Earrings',
    collectionName: 'Bridal',
    images: ['/assets/category_bridal.webp', '/assets/hero_campaign.webp'],
    material: '22K Gold',
    purity: '22K Gold | Polki & Pearl',
    weight: '20.0 grams',
    diamondDetails: { carat: '2.00 ct Polki', clarity: 'Natural Syndicate', color: 'Uncut Lustre', certification: 'Hallmark Certificate' },
    sizes: ['Standard Drop (50mm)'],
    purities: ['22K Gold'],
    stock: 7,
    featured: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 40,
  }
];

const initialUsers = [
  {
    id: '1',
    name: 'Lumière Atelier Admin',
    email: 'admin@lumiere.com',
    password: 'password123',
    role: 'admin',
    phone: '+91 98490 12345',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'user',
    phone: '+91 98765 43210',
  }
];

const initialOrders = [];

// In-Memory Hybrid Data Store
const memoryStore = {
  categories: [...initialCategories],
  products: [...initialProducts],
  users: [...initialUsers],
  orders: [...initialOrders],
  reviews: [],
};

const seedDatabase = async () => {
  try {
    const Category = require('../models/Category');
    const Product = require('../models/Product');
    const User = require('../models/User');

    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    await Category.insertMany(initialCategories);

    const hashedUsers = await Promise.all(
      initialUsers.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );
    await User.insertMany(hashedUsers);
    await Product.insertMany(initialProducts);

    console.log('[LUMIÈRE DATABASE] Database successfully seeded with South Indian Fine Jewellery collection!');
  } catch (error) {
    console.warn('[LUMIÈRE DATABASE] Seeding warning (MongoDB offline): ' + error.message);
  }
};

module.exports = {
  initialCategories,
  initialProducts,
  initialUsers,
  initialOrders,
  memoryStore,
  seedDatabase,
};
