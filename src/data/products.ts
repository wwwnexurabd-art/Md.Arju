import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'NX-HOODIE-PAISLEY',
    name: 'Black Paisley Hoodie Combo',
    category: 'Fashion & Clothing',
    price: 1200,
    originalPrice: 1450,
    discountPercent: 17,
    image: '/images/products/black-paisley-hoodie.jpg',
    images: [
      '/images/products/black-paisley-hoodie.jpg',
      '/images/products/solid-color-hoodie.jpg'
    ],
    description: 'Exclusive streetwear bundle featuring the Black Paisley graphic hoodie paired with matching premium bandana printed tee. Made from 320 GSM combed organic cotton fleece, pre-shrunk with ultra-durable reactive print.',
    inStock: true,
    stockCount: 45,
    featured: true,
    isOffer: true,
    rating: 4.8,
    reviewsCount: 38,
    variants: [
      {
        type: 'size',
        name: 'Size',
        options: ['M', 'L', 'XL', 'XXL']
      },
      {
        type: 'color',
        name: 'Color',
        options: ['Black Combo', 'Charcoal Blend']
      }
    ],
    specifications: {
      'Fabric': '320 GSM 100% Combed Cotton Fleece',
      'Fit': 'Relaxed Streetwear Silhouette',
      'Wash Care': 'Machine wash cold inside out',
      'Combo Includes': '1x Paisley Hoodie + 1x Paisley Graphic T-Shirt',
      'Origin': 'Made in Bangladesh'
    }
  },
  {
    id: 'prod-002',
    sku: 'NX-HOODIE-SOLID',
    name: 'Premium Solid Color Hoodie',
    category: 'Fashion & Clothing',
    price: 700,
    originalPrice: 815,
    discountPercent: 14,
    image: '/images/products/solid-color-hoodie.jpg',
    images: [
      '/images/products/solid-color-hoodie.jpg',
      '/images/products/black-paisley-hoodie.jpg'
    ],
    description: 'Everyday essential hoodie crafted from plush 300 GSM brushed fleece. Features reinforced kangaroo pocket, double-layered hood with braided drawstrings, and ribbed cuffs and hem.',
    inStock: true,
    stockCount: 120,
    featured: true,
    isOffer: true,
    rating: 4.7,
    reviewsCount: 64,
    variants: [
      {
        type: 'color',
        name: 'Color',
        options: ['Navy Blue', 'Jet Black', 'Chocolate Brown', 'Heather Grey']
      },
      {
        type: 'size',
        name: 'Size',
        options: ['M', 'L', 'XL']
      }
    ],
    specifications: {
      'Material': '80% Cotton, 20% Polyester Anti-Pilling Fleece',
      'GSM': '300 GSM Heavyweight',
      'Hood': 'Double lined with metal eyelets',
      'Seams': 'Double-needle flatlock stitching'
    }
  },
  {
    id: 'prod-003',
    sku: 'NX-AUDIO-BOYAMW6',
    name: 'BOYA BY-MW6 Wireless Microphone',
    category: 'Audio & Microphones',
    price: 1500,
    originalPrice: 1500,
    discountPercent: 0,
    image: '/images/products/boya-microphone.jpg',
    images: [
      '/images/products/boya-microphone.jpg'
    ],
    description: 'Dual-channel ultra-compact 2.4GHz wireless microphone system for smartphone content creators, vloggers, and live streamers. Features intelligent DSP noise reduction, 50-meter stable transmission, and up to 10 hours battery life with charging case.',
    inStock: true,
    stockCount: 28,
    featured: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 52,
    variants: [
      {
        type: 'color',
        name: 'Connector Type',
        options: ['Type-C for Android', 'Lightning for iPhone']
      }
    ],
    specifications: {
      'Transmission': '2.4GHz Digital Frequency',
      'Operating Range': 'Up to 50m (obstacle-free)',
      'Battery Life': '10h transmitter, 30h with charging case',
      'Audio Quality': '48kHz / 16bit lossless DSP noise cancellation',
      'Latency': '< 15ms'
    }
  },
  {
    id: 'prod-004',
    sku: 'NX-GAME-J36ULTRA',
    name: 'J36 Ultra Retro Game Console',
    category: 'Gaming Accessories',
    price: 5100,
    originalPrice: 5800,
    discountPercent: 12,
    image: '/images/products/j36-retro-console.jpg',
    images: [
      '/images/products/j36-retro-console.jpg'
    ],
    description: 'High-performance handheld retro arcade console loaded with 15,000+ classic games across PS1, GBA, NES, SNES, and Arcade emulators. Features a crisp 3.5-inch IPS display, dual analog thumbsticks, and TV-out HDMI connectivity.',
    inStock: true,
    stockCount: 15,
    featured: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 41,
    variants: [
      {
        type: 'color',
        name: 'Body Color',
        options: ['Matte White', 'Stealth Black', 'Retro Grey']
      }
    ],
    specifications: {
      'Screen': '3.5 inch IPS Full-view OCA 640x480 Display',
      'Storage': '64GB TF Card Preloaded (Expandable to 256GB)',
      'Processor': 'Quad-core 64-bit Cortex-A35',
      'Battery': '3500mAh Li-polymer (6-8 hours play)',
      'Outputs': 'Mini HDMI TV Out, 3.5mm Headphone Jack, OTG'
    }
  },
  {
    id: 'prod-005',
    sku: 'NX-MOBILE-HOCOCA6',
    name: 'Hoco CA6 Glacier Phone Cooler',
    category: 'Mobile Accessories',
    price: 1150,
    originalPrice: 1500,
    discountPercent: 23,
    image: '/images/products/hoco-phone-cooler.jpg',
    images: [
      '/images/products/hoco-phone-cooler.jpg'
    ],
    description: 'Semiconductor Peltier magnetic cooler for gaming smartphones. Drops mobile CPU temperature by up to 25°C in seconds to eliminate thermal throttling and FPS drops during PUBG, Free Fire, and heavy recording. Includes dynamic RGB LED aura.',
    inStock: true,
    stockCount: 60,
    featured: true,
    isOffer: true,
    rating: 4.6,
    reviewsCount: 29,
    variants: [
      {
        type: 'color',
        name: 'Mounting Style',
        options: ['MagSafe Magnetic + Clip Combo']
      }
    ],
    specifications: {
      'Cooling Mechanism': 'Semiconductor Thermoelectric Peltier Chip',
      'Fan Speed': '7000 RPM Silent Turbo Turbine',
      'RGB Lighting': 'Custom Spectrum Breathing Ring',
      'Power Input': '5V/2A Type-C Interface',
      'Compatibility': 'Universal 67mm-88mm Android & iPhone'
    }
  },
  {
    id: 'prod-006',
    sku: 'NX-AUDIO-HOCOM105',
    name: 'Hoco M105 Earphones with Mic',
    category: 'Audio & Microphones',
    price: 550,
    originalPrice: 750,
    discountPercent: 27,
    image: '/images/products/hoco-earphones.jpg',
    images: [
      '/images/products/hoco-earphones.jpg'
    ],
    description: 'Ergonomic in-ear wired gaming & music earphones with high-definition omnidirectional microphone, tangle-resistant reinforced TPE cable, and 10mm composite biological diaphragm for punchy deep bass and crystalline treble.',
    inStock: true,
    stockCount: 85,
    featured: true,
    isOffer: true,
    rating: 4.5,
    reviewsCount: 78,
    variants: [
      {
        type: 'color',
        name: 'Color Accent',
        options: ['Black & Red', 'All Black']
      }
    ],
    specifications: {
      'Driver Unit': '10mm Neodymium Dynamic Driver',
      'Connector': '3.5mm Gold-plated Audio Jack',
      'Cable Length': '1.2m Tangle-free Elastic TPE',
      'Microphone': 'In-line HD Mic with Multi-function Controller',
      'Frequency Response': '20Hz - 20,000Hz'
    }
  },
  {
    id: 'prod-007',
    sku: 'NX-TECH-SMARTWATCH',
    name: 'Smartwatch Ultra Titanium Edition',
    category: 'Electronics & Gadgets',
    price: 3850,
    originalPrice: 4500,
    discountPercent: 14,
    image: '/images/products/smartwatch-ultra.jpg',
    images: [
      '/images/products/smartwatch-ultra.jpg'
    ],
    description: 'Rugged titanium aerospace alloy casing smartwatch with always-on AMOLED high-brightness display, Bluetooth calling with dual speaker, heart rate and SpO2 sensor, and IP68 waterproof rating.',
    inStock: true,
    stockCount: 30,
    featured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 31,
    variants: [
      {
        type: 'color',
        name: 'Strap Color',
        options: ['Ocean Orange', 'Titanium Black', 'Alpine Green']
      }
    ],
    specifications: {
      'Screen': '2.02" High Definition AMOLED Display (480x520)',
      'Battery': '420mAh, 7-10 Days standby',
      'Waterproof': 'IP68 Certified Water & Dust Resistant',
      'Health Sensors': 'Dynamic Heart Rate, Blood Oxygen, Sleep Tracker',
      'Calling': 'Bluetooth HD Voice Call & Phonebook Sync'
    }
  },
  {
    id: 'prod-008',
    sku: 'NX-GAME-KEYBOARD65',
    name: 'RGB Mechanical 65% Gaming Keyboard',
    category: 'Gaming Accessories',
    price: 3200,
    originalPrice: 3800,
    discountPercent: 16,
    image: '/images/products/gaming-keyboard.jpg',
    images: [
      '/images/products/gaming-keyboard.jpg'
    ],
    description: 'Compact 65% hot-swappable mechanical keyboard featuring factory-lubed linear switches, sound dampening silicon foam, south-facing per-key RGB backlighting, and braided detachable coiled aviator cable.',
    inStock: true,
    stockCount: 24,
    featured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 22,
    variants: [
      {
        type: 'color',
        name: 'Switch Type',
        options: ['Linear Red Switch (Quiet & Fast)', 'Tactile Brown Switch (Balanced)']
      }
    ],
    specifications: {
      'Layout': '68 Keys 65% Form Factor',
      'Switches': 'Hot-swappable 3/5-pin Switch Sockets',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Lighting': '18 Pre-set Dynamic RGB Modes',
      'Connectivity': 'Detachable Type-C Coiled Cable'
    }
  },
  {
    id: 'prod-009',
    sku: 'NX-MOB-MAGPB10',
    name: 'Magnetic Wireless Power Bank 10000mAh',
    category: 'Mobile Accessories',
    price: 1850,
    originalPrice: 2200,
    discountPercent: 16,
    image: '/images/products/magnetic-powerbank.jpg',
    images: [
      '/images/products/magnetic-powerbank.jpg'
    ],
    description: 'Slimline magnetic wireless power bank with 15W Qi fast charging and 20W PD Type-C bidirectional port. Strong N52 neodymium magnet snap design fits seamlessly on iPhone 12/13/14/15/16 and Qi compatible Android phones.',
    inStock: true,
    stockCount: 40,
    featured: true,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 45,
    variants: [
      {
        type: 'color',
        name: 'Finish',
        options: ['Matte Slate Grey', 'Deep Forest Navy']
      }
    ],
    specifications: {
      'Capacity': '10,000mAh / 3.85V (38.5Wh)',
      'Wireless Output': '5W / 7.5W / 10W / 15W Max',
      'Wired Output': 'USB-C PD 20W Fast Charging',
      'Safety': 'Over-voltage, Over-current & Short-circuit protection',
      'Weight': '182 grams ultra-portable'
    }
  },
  {
    id: 'prod-010',
    sku: 'NX-AUD-NOIRNC1',
    name: 'ANC Noise Cancelling Wireless Headphones',
    category: 'Audio & Microphones',
    price: 4200,
    originalPrice: 5000,
    discountPercent: 16,
    image: '/images/products/anc-headphones.jpg',
    images: [
      '/images/products/anc-headphones.jpg'
    ],
    description: 'Studio-grade hybrid active noise cancelling over-ear headphones with 40mm titanium drivers, ambient transparency mode, ultra-soft memory foam protein leather earcups, and up to 45 hours playback time.',
    inStock: true,
    stockCount: 18,
    featured: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 36,
    variants: [
      {
        type: 'color',
        name: 'Color',
        options: ['Matte Noir Black', 'Gold Accented Midnight']
      }
    ],
    specifications: {
      'Active Noise Cancellation': '-38dB Hybrid ANC Depth',
      'Drivers': '40mm Custom Titanium Bio-Diaphragm',
      'Battery Life': '45h (ANC Off) / 32h (ANC On)',
      'Bluetooth': 'v5.3 with AAC and SBC codec support',
      'Charging': 'USB-C Quick Charge (10 min gives 5 hours)'
    }
  }
];

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Products',
    icon: 'Grid',
    count: 10,
    description: 'Browse our full catalog'
  },
  {
    id: 'fashion',
    name: 'Fashion & Clothing',
    icon: 'Shirt',
    count: 2,
    description: 'Hoodies, combos, and premium streetwear'
  },
  {
    id: 'audio',
    name: 'Audio & Microphones',
    icon: 'Headphones',
    count: 3,
    description: 'Wireless mics, studio earphones & ANC headsets'
  },
  {
    id: 'gaming',
    name: 'Gaming Accessories',
    icon: 'Gamepad2',
    count: 2,
    description: 'Retro game consoles & mechanical keyboards'
  },
  {
    id: 'mobile',
    name: 'Mobile Accessories',
    icon: 'Smartphone',
    count: 2,
    description: 'Magnetic phone coolers & wireless power banks'
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: 'Watch',
    count: 1,
    description: 'Smartwatches, trackers & everyday tech'
  },
  {
    id: 'smarthome',
    name: 'Smart Home & Lifestyle',
    icon: 'Home',
    count: 1,
    description: 'Smart workspace essentials & lighting'
  }
];

// Explicit list of Dhaka City Thanas (inside Dhaka City delivery charge = ৳60)
// If in Dhaka District but NOT in this list (e.g. Savar, Keraniganj, Dhamrai, Dohar, Nawabganj), delivery charge = ৳100
export const DHAKA_CITY_THANAS = [
  'Dhanmondi',
  'Gulshan',
  'Banani',
  'Uttara',
  'Mirpur',
  'Mohammadpur',
  'Motijheel',
  'Badda',
  'Rampura',
  'Khilgaon',
  'Old Dhaka (Puran Dhaka)',
  'Bashundhara R/A',
  'Tejgaon',
  'Malibagh',
  'Moghbazar',
  'Shahbagh',
  'Paltan',
  'Lalbagh',
  'New Market',
  'Cantonment',
  'Kafrul',
  'Pallabi',
  'Hazaribagh',
  'Kamrangirchar',
  'Sutrapur',
  'Kotwali',
  'Wari',
  'Gandaria',
  'Demra',
  'Jatrabari',
  'Khilkhet',
  'Nikunja',
  'Baridhara',
  'Shyamoli',
  'Kallyanpur',
  'Adabor',
  'Kalabagan',
  'Eskaton',
  'Shantinagar',
  'Bijoynagar'
];

export const BANGLADESH_DIVISIONS: Record<string, { districts: Record<string, string[]> }> = {
  'Dhaka': {
    districts: {
      'Dhaka': [
        // Dhaka City Thanas
        ...DHAKA_CITY_THANAS,
        // Dhaka District Outside City Thanas
        'Savar',
        'Keraniganj',
        'Dhamrai',
        'Dohar',
        'Nawabganj',
        'Ashulia'
      ],
      'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Tongi'],
      'Narayanganj': ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
      'Tangail': ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'],
      'Faridpur': ['Faridpur Sadar', 'Alfadanga', 'Bhangga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Sadarpur'],
      'Manikganj': ['Manikganj Sadar', 'Daulatpur', 'Ghior', 'Harirampur', 'Saturia', 'Shivalaya', 'Singair'],
      'Munshiganj': ['Munshiganj Sadar', 'Gazaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
      'Narsingdi': ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur']
    }
  },
  'Chattogram': {
    districts: {
      'Chattogram': ['Kotwali', 'Panchlaish', 'Agrabad', 'Halishahar', 'Bakalia', 'Chandgaon', 'Pahartali', 'Khulshi', 'Sitakunda', 'Mirsharai', 'Hathazari', 'Raozan'],
      'Cox\'s Bazar': ['Cox\'s Bazar Sadar', 'Chakaria', 'Kutubdia', 'Maheshkhali', 'Ramu', 'Teknaf', 'Ukhia', 'Pekua'],
      'Cumilla': ['Cumilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar'],
      'Noakhali': ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Subarnachar'],
      'Brahmanbaria': ['Brahmanbaria Sadar', 'Ashuganj', 'Akhaura', 'Bancharampur', 'Kasba', 'Nabinagar', 'Sarail']
    }
  },
  'Rajshahi': {
    districts: {
      'Rajshahi': ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat', 'Bagha'],
      'Bogura': ['Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
      'Pabna': ['Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'],
      'Sirajganj': ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara']
    }
  },
  'Khulna': {
    districts: {
      'Khulna': ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsha'],
      'Jashore': ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
      'Kushtia': ['Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur']
    }
  },
  'Sylhet': {
    districts: {
      'Sylhet': ['Sylhet Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Zakiganj'],
      'Moulvibazar': ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'],
      'Habiganj': ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniachang', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj'],
      'Sunamganj': ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Shalla', 'Tahirpur']
    }
  },
  'Barishal': {
    districts: {
      'Barishal': ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
      'Patuakhali': ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali', 'Dumki'],
      'Bhola': ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
    }
  },
  'Rangpur': {
    districts: {
      'Rangpur': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
      'Dinajpur': ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur']
    }
  },
  'Mymensingh': {
    districts: {
      'Mymensingh': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gafargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur', 'Trishal'],
      'Jamalpur': ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari']
    }
  }
};

export const HOTLINE_NUMBER = '+880 01647583320';
export const WHATSAPP_NUMBER = '971555282918';
export const SUPPORT_EMAIL = 'www.nexura.bd@gmail.com';
export const STORE_ADDRESS = 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh';
