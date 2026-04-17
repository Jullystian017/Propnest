export interface Deal {
  id: string;
  title: string;
  price: number;
  client: string;
  source: string;
  priority: 'High' | 'Medium' | 'Low';
  reservationDate: string;
  floorPlan: string;
  propertyImage: string;
  status: 'Baru' | 'Survey' | 'Negosiasi' | 'Legalitas';
  members: { name: string; avatar: string }[];
  commentsCount: number;
  filesCount: number;
}

export const MOCK_DEALS: Deal[] = [
  {
    id: 'D-04219',
    title: 'Modern Minimalis BSB - Type 45',
    price: 1250000000,
    client: 'James O\'Connor',
    source: 'propnest.com',
    priority: 'Low',
    reservationDate: '25 Nov 2025',
    floorPlan: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400',
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    status: 'Baru',
    members: [{ name: 'B', avatar: 'B' }, { name: 'K', avatar: 'K' }],
    commentsCount: 3,
    filesCount: 1
  },
  {
    id: 'D-04217',
    title: 'Vila Tropis Ungaran - Unit A1',
    price: 2650000000,
    client: 'Amira Al-Fayed',
    source: 'vacationhomes.id',
    priority: 'Medium',
    reservationDate: '21 Nov 2025',
    floorPlan: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    status: 'Survey',
    members: [{ name: 'J', avatar: 'J' }, { name: 'R', avatar: 'R' }],
    commentsCount: 12,
    filesCount: 6
  },
  {
    id: 'D-04208',
    title: 'Cluster Premium Colomadu - Hook',
    price: 3200000000,
    client: 'Wei Chen',
    source: 'propnest.com',
    priority: 'Low',
    reservationDate: '22 Nov 2025',
    floorPlan: 'https://images.unsplash.com/photo-1628592102751-ba83b03062b0?auto=format&fit=crop&q=80&w=400',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    status: 'Negosiasi',
    members: [{ name: 'B', avatar: 'B' }, { name: 'R', avatar: 'R' }, { name: 'K', avatar: 'K' }],
    commentsCount: 23,
    filesCount: 10
  },
  {
    id: 'D-04207',
    title: 'Apartemen Sudirman - City View',
    price: 920000000,
    client: 'Vikram Malhotra',
    source: 'propnest.com',
    priority: 'High',
    reservationDate: '30 Nov 2025',
    floorPlan: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    propertyImage: 'https://images.unsplash.com/photo-1567684014761-b6187a9df63e?auto=format&fit=crop&q=80&w=800',
    status: 'Legalitas',
    members: [{ name: 'J', avatar: 'J' }, { name: 'B', avatar: 'B' }, { name: 'R', avatar: 'R' }, { name: 'K', avatar: 'K' }],
    commentsCount: 34,
    filesCount: 12
  }
];

export const PIPELINE_STATS = {
  totalAssetVolume: 24500000000, // 24.5B
  commission: 490000000, // 490M
  viewingsBooked: 20,
  offersSent: 5,
  avgDaysToClose: 42,
  winRate: 12
};
