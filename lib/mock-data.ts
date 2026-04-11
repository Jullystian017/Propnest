export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  specs: {
    beds: number;
    baths: number;
    size: number;
  };
  badge: string;
  image: string;
  coords: {
    lat: number;
    lng: number;
  };
  description?: string;
  gallery?: string[];
  features?: string[];
  agent?: {
    name: string;
    type: string;
    avatar: string;
  };
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Rumah Modern Minimalis BSB',
    location: 'BSB City, Semarang',
    price: 'Rp 1,25 Miliar',
    specs: { beds: 4, baths: 3, size: 180 },
    badge: 'Baru',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=600',
    coords: { lat: -7.025, lng: 110.320 },
    description: 'Hunian modern dengan konsep minimalis di kawasan berkembang BSB City. Menawarkan kenyamanan maksimal dengan sirkulasi udara yang baik dan pencahayaan alami yang melimpah.',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687931-cebf10c2c31e?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['Keamanan 24 Jam', 'Area Taman', 'Smart Home System'],
    agent: {
      name: 'PT Properti Jaya',
      type: 'Developer Resmi',
      avatar: 'https://ui-avatars.com/api/?name=PJ&background=0D8ABC&color=fff'
    }
  },
  {
    id: '2',
    name: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    price: 'Rp 875 Juta',
    specs: { beds: 3, baths: 2, size: 120 },
    badge: 'Populer',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=600',
    coords: { lat: -7.535, lng: 110.780 },
    description: 'Cluster eksklusif di lokasi strategis Colomadu. Dekat dengan akses jalan tol dan bandara Adi Soemarmo. Pilihan tepat untuk investasi maupun hunian pribadi.',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['Dekat Bandara', 'One Gate System', 'CCTV'],
    agent: {
      name: 'Solo Residence',
      type: 'Agen Terpercaya',
      avatar: 'https://ui-avatars.com/api/?name=SR&background=4F46E5&color=fff'
    }
  },
  {
    id: '3',
    name: 'Vila Tropis Ungaran',
    location: 'Ungaran, Semarang',
    price: 'Rp 2,1 Miliar',
    specs: { beds: 5, baths: 4, size: 350 },
    badge: 'Eksklusif',
    image: '/properties/vila_tropis_ungaran.png',
    coords: { lat: -7.140, lng: 110.400 },
    description: 'Vila mewah dengan konsep tropis di kaki gunung Ungaran. Menawarkan udara yang sangat sejuk, pemandangan kota Semarang dari ketinggian, dan ketenangan total jauh dari hiruk pikuk kota.',
    gallery: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['Kolam Renang Pribadi', 'View Gunung', 'Udara Sejuk', 'Parkir Luas'],
    agent: {
      name: 'PT Alam Tropis Jaya',
      type: 'Developer Resmi',
      avatar: 'https://ui-avatars.com/api/?name=ATJ&background=10B981&color=fff'
    }
  },
  {
    id: '4',
    name: 'Griya Asri Premiere',
    location: 'Purwokerto Utara',
    price: 'Rp 350 Juta',
    specs: { beds: 3, baths: 2, size: 90 },
    badge: 'Promo',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800&h=600',
    coords: { lat: -7.400, lng: 109.240 },
    description: 'Hunian nyaman dengan harga terjangkau di Purwokerto Utara. Sangat cocok bagi pasangan muda atau investasi sewa untuk mahasiswa karena dekat dengan kampus.',
    gallery: [
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['Dekat Kampus', 'Bebas Banjir', 'Akses Mudah'],
    agent: {
      name: 'Griya Utama',
      type: 'Agen Lokal',
      avatar: 'https://ui-avatars.com/api/?name=GU&background=F59E0B&color=fff'
    }
  },
  {
    id: '5',
    name: 'Cilacap Bay View',
    location: 'Cilacap Tengah',
    price: 'Rp 420 Juta',
    specs: { beds: 2, baths: 1, size: 70 },
    badge: 'Baru',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800&h=600',
    coords: { lat: -7.710, lng: 109.020 },
    description: 'Nikmati hembusan angin laut setiap hari di Cilacap Bay View. Perumahan minimalis dengan sentuhan modern yang terletak tidak jauh dari bibir pantai.',
    gallery: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['View Laut', 'Halaman Luas', 'Keamanan Terpadu'],
    agent: {
      name: 'Pesisir Indah',
      type: 'Developer',
      avatar: 'https://ui-avatars.com/api/?name=PI&background=06B6D4&color=fff'
    }
  },
  {
    id: '6',
    name: 'Taman Sari Solo Baru',
    location: 'Solo Baru, Sukoharjo',
    price: 'Rp 1,1 Miliar',
    specs: { beds: 3, baths: 2, size: 140 },
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800&h=600',
    coords: { lat: -7.595, lng: 110.815 },
    description: 'Terletak di kawasan bisnis Solo Baru, Taman Sari menawarkan gaya hidup perkotaan yang prestisius. Dekat dengan mall, rumah sakit bertaraf internasional, dan pusat kuliner.',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    ],
    features: ['Pusat Bisnis', 'Lingkungan Elit', 'Akses Mall'],
    agent: {
      name: 'Solo Baru Realty',
      type: 'Agen Eksklusif',
      avatar: 'https://ui-avatars.com/api/?name=SBR&background=EF4444&color=fff'
    }
  },
];
