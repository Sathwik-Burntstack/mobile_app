// Demo data (matches the copy in the Figma file). Replace with your API later.
export type Creator = {
  id: string; name: string; city: string; cat: string; followers: string;
  platform: 'Instagram' | 'YouTube'; rating: number; price: number; badge?: string;
  bio: string; reach: string; eng: string; delivered: number;
};

export const CREATORS: Creator[] = [
  { id: 'c1', name: 'Ananya Rao', city: 'Bengaluru', cat: 'Beauty', followers: '48.2k', platform: 'Instagram', rating: 4.9, price: 8000, badge: 'Top creator', bio: 'Skincare & makeup storyteller. Honest reviews, clean visuals, strong saves.', reach: '540k', eng: '4.9%', delivered: 64 },
  { id: 'c2', name: 'Rohan Mehta', city: 'Mumbai', cat: 'Tech', followers: '210k', platform: 'YouTube', rating: 5.0, price: 12500, badge: 'Responds fast', bio: 'Gadget unboxings and quick explainers for everyday buyers.', reach: '1.1M', eng: '5.2%', delivered: 91 },
  { id: 'c3', name: 'Meera Iyer', city: 'Chennai', cat: 'Lifestyle', followers: '31.7k', platform: 'Instagram', rating: 4.8, price: 6500, bio: 'Slow-living, travel and home. Warm, aesthetic UGC.', reach: '310k', eng: '4.2%', delivered: 37 },
  { id: 'c4', name: 'Kabir Singh', city: 'Delhi', cat: 'Fitness', followers: '76.4k', platform: 'Instagram', rating: 4.9, price: 9000, badge: 'Responds fast', bio: 'Fitness coach making training and nutrition simple.', reach: '488k', eng: '5.4%', delivered: 52 },
  { id: 'c5', name: 'Sana Qureshi', city: 'Hyderabad', cat: 'Fashion', followers: '58.9k', platform: 'Instagram', rating: 4.8, price: 7200, bio: 'Modest wear and festive fashion lookbooks.', reach: '402k', eng: '4.6%', delivered: 44 },
  { id: 'c6', name: 'Priya Nair', city: 'Kochi', cat: 'Food', followers: '22.3k', platform: 'Instagram', rating: 4.9, price: 5500, bio: 'Home cooking, festive food gifting and quick recipes.', reach: '612k', eng: '6.1%', delivered: 29 },
  { id: 'c7', name: 'Arjun Das', city: 'Pune', cat: 'Comedy', followers: '402k', platform: 'YouTube', rating: 4.7, price: 15000, bio: 'Sketch comedy with big, loyal audiences.', reach: '2.0M', eng: '3.9%', delivered: 58 },
  { id: 'c8', name: 'Ishita Kapoor', city: 'Jaipur', cat: 'Beauty', followers: '95.1k', platform: 'Instagram', rating: 4.8, price: 10000, bio: 'Makeup tutorials and product deep-dives.', reach: '720k', eng: '4.4%', delivered: 70 },
];
export const creatorById = (id: string) => CREATORS.find((c) => c.id === id) || CREATORS[0];
export const creatorByName = (n: string) => CREATORS.find((c) => c.name === n);

export type Bid = { id: string; creatorId: string; price: number; note: string };
export type Job = {
  id: string; title: string; platform: string; deliverables: string;
  min: number; max: number; status: 'open' | 'progress' | 'completed';
  bidsCount: number; closes: string; bidders: string[]; hired?: string; escrow?: number; bids: Bid[];
};

export const JOBS: Job[] = [
  {
    id: 'j1', title: 'Festive snack hamper launch', platform: 'Instagram', deliverables: '1 Reel + 2 Stories',
    min: 5000, max: 15000, status: 'open', bidsCount: 12, closes: 'Closes in 2 days', bidders: ['c1', 'c6', 'c8', 'c3'],
    bids: [
      { id: 'b1', creatorId: 'c1', price: 11000, note: 'Reel + 2 stories. I’ll tag your page and pin the Reel for a week.' },
      { id: 'b2', creatorId: 'c6', price: 9500, note: 'Can shoot at home with diyas and rangoli — very on-brand for food gifting.' },
      { id: 'b3', creatorId: 'c8', price: 12000, note: 'Cinematic unboxing with a festive makeup-look tie-in.' },
    ],
  },
  {
    id: 'j2', title: 'Nimbu masala soda — summer UGC', platform: 'UGC', deliverables: '3 short videos',
    min: 3000, max: 8000, status: 'open', bidsCount: 7, closes: 'Closes in 5 days', bidders: ['c3', 'c5', 'c4'],
    bids: [
      { id: 'b4', creatorId: 'c3', price: 6500, note: 'Three 20-sec clips in natural light, with a refreshing summer hook.' },
      { id: 'b5', creatorId: 'c5', price: 7000, note: 'Street-style serve and taste reactions, ready for ads.' },
    ],
  },
  {
    id: 'j3', title: 'Diwali gift box unboxing', platform: 'YouTube', deliverables: '1 Short + post',
    min: 10000, max: 25000, status: 'progress', bidsCount: 12, closes: '', bidders: ['c6'], hired: 'c6', escrow: 12000, bids: [],
  },
  {
    id: 'j4', title: 'Monsoon chai Reel', platform: 'Instagram', deliverables: '1 Reel',
    min: 6000, max: 10000, status: 'completed', bidsCount: 9, closes: '', bidders: ['c4'], hired: 'c4', bids: [],
  },
  {
    id: 'j5', title: 'Festive hamper Reel', platform: 'Instagram', deliverables: '1 Reel + 3 Stories',
    min: 7000, max: 12000, status: 'completed', bidsCount: 11, closes: '', bidders: ['c1'], hired: 'c1', bids: [],
  },
];

export type Order = {
  id: string; code: string; title: string; kind: string; creatorId: string;
  stage: 'working' | 'delivered' | 'released'; held: number; fee: number; platformFee: number; gst: number;
  paidOn: string; draftDue: string; deliveredOn: string;
};
export const ORDERS: Order[] = [
  { id: 'o1', code: '#XX-2041', title: 'Diwali gift box unboxing', kind: 'Instagram Reel', creatorId: 'c6', stage: 'delivered', held: 13238, fee: 12500, platformFee: 625, gst: 113, paidOn: '21 Oct', draftDue: '25 Oct', deliveredOn: '23 Oct' },
  { id: 'o2', code: '#XX-2037', title: 'Nimbu masala soda — UGC', kind: 'UGC · 3 videos', creatorId: 'c3', stage: 'working', held: 6500, fee: 6190, platformFee: 310, gst: 56, paidOn: '24 Oct', draftDue: '30 Oct', deliveredOn: '' },
  { id: 'o3', code: '#XX-2029', title: 'Festive hamper Reel', kind: 'Instagram Reel', creatorId: 'c1', stage: 'released', held: 3762, fee: 3583, platformFee: 179, gst: 32, paidOn: '9 Oct', draftDue: '15 Oct', deliveredOn: '14 Oct' },
];

export const LISTS = [
  { id: 'l1', name: 'Diwali campaign shortlist', count: 8, updated: 'Updated 2 days ago' },
  { id: 'l2', name: 'Beauty micro-creators', count: 12, updated: 'Updated 5 days ago' },
  { id: 'l3', name: 'Bengaluru food creators', count: 5, updated: 'Updated 1 week ago' },
  { id: 'l4', name: 'UGC for summer ads', count: 6, updated: 'Updated 2 weeks ago' },
];

export type Deliv = { id: string; title: string; by: string; date: string; job: string; status: 'Approved' | 'Needs review' | 'Live' | 'Revision asked' };
export const DELIVERABLES: Deliv[] = [
  { id: 'd1', title: 'Festive hamper Reel', by: 'Ananya Rao', date: '24 Oct', job: 'Festive snack hamper launch', status: 'Approved' },
  { id: 'd2', title: 'Gift box unboxing — draft 1', by: 'Priya Nair', date: '23 Oct', job: 'Diwali gift box unboxing', status: 'Needs review' },
  { id: 'd3', title: 'Masala soda UGC #1', by: 'Meera Iyer', date: '21 Oct', job: 'Nimbu masala soda — UGC', status: 'Live' },
  { id: 'd4', title: 'Masala soda UGC #2', by: 'Meera Iyer', date: '21 Oct', job: 'Nimbu masala soda — UGC', status: 'Revision asked' },
  { id: 'd5', title: 'Monsoon chai Reel', by: 'Kabir Singh', date: '9 Oct', job: 'Monsoon chai Reel', status: 'Live' },
  { id: 'd6', title: 'Festive hamper Stories', by: 'Ananya Rao', date: '24 Oct', job: 'Festive snack hamper launch', status: 'Approved' },
];

export const NOTIFICATIONS = [
  { id: 'n1', text: 'Rohan Mehta bid ₹12,500 on “Diwali gift box unboxing”', time: '2m', unread: true },
  { id: 'n2', text: 'Priya Nair delivered “Gift box unboxing — draft 1”', time: '1h', unread: true },
  { id: 'n3', text: 'Meera Iyer accepted your order · ₹6,500 in escrow', time: '3h', unread: true },
  { id: 'n4', text: 'Kabir Singh bid ₹9,000 on “Monsoon chai Reel”', time: 'Yesterday', unread: true },
];

export const MESSAGES = [
  { id: 'm1', name: 'Ananya Rao', time: '5m', text: 'Sharing the first cut tonight! 🎬', unread: true },
  { id: 'm2', name: 'Priya Nair', time: '1h', text: 'Can we move the shoot to Saturday?', unread: true },
  { id: 'm3', name: 'Meera Iyer', time: 'Yesterday', text: 'Thanks for the quick approval 🙏', unread: false },
  { id: 'm4', name: 'Kabir Singh', time: '2d', text: 'What’s the hook you’d like in the first 3s?', unread: false },
];

export const CATEGORIES = ['Beauty', 'Fashion', 'Food', 'Tech', 'Fitness', 'Lifestyle', 'Travel', 'UGC', 'Comedy', 'Gaming'];
export const PLATFORMS = ['Instagram', 'YouTube', 'UGC'];

export const MONTHS = [
  { m: 'May', ig: 140, yt: 60 }, { m: 'Jun', ig: 190, yt: 90 }, { m: 'Jul', ig: 230, yt: 110 },
  { m: 'Aug', ig: 280, yt: 150 }, { m: 'Sep', ig: 340, yt: 190 }, { m: 'Oct', ig: 420, yt: 240 },
];
