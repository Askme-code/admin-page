import type { TravelTip } from '@/lib/types';
import TravelTipCard from '@/components/cards/TravelTipCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dummy data - replace with actual data fetching from Supabase
const dummyTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    slug: 'stay-hydrated',
    content: 'Tanzania can be hot and humid, especially at lower altitudes. Drink plenty of bottled or purified water throughout the day.',
    icon: 'Utensils', // Using a Lucide icon name (or key from iconMap in TravelTipCard)
    category: 'Health & Safety',
    status: 'published',
    created_at: '2023-05-01T10:00:00Z',
    updated_at: '2023-05-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Pack Light Layers',
    slug: 'pack-light-layers',
    content: 'Temperatures can vary greatly from cool highlands to hot coastal areas. Pack light layers you can add or remove easily.',
    icon: 'Luggage',
    category: 'Packing',
    status: 'published',
    created_at: '2023-05-05T11:00:00Z',
    updated_at: '2023-05-05T11:00:00Z',
  },
  {
    id: '3',
    title: 'Respect Local Customs',
    slug: 'respect-local-customs',
    content: 'Dress modestly, especially when visiting villages or religious sites. Always ask permission before photographing people.',
    icon: 'Users',
    category: 'Culture & Etiquette',
    status: 'published',
    created_at: '2023-05-10T09:00:00Z',
    updated_at: '2023-05-10T09:00:00Z',
  },
  {
    id: '4',
    title: 'Learn Basic Swahili Phrases',
    slug: 'learn-basic-swahili',
    content: 'Locals appreciate it when visitors make an effort to speak Swahili. "Jambo" (hello) and "Asante" (thank you) are good starts.',
    icon: 'MessageCircle', // Another Lucide icon
    category: 'Communication',
    status: 'published',
    created_at: '2023-05-15T14:00:00Z',
    updated_at: '2023-05-15T14:00:00Z',
  },
  {
    id: '5',
    title: 'Malaria Precautions',
    slug: 'malaria-precautions',
    content: 'Consult your doctor about malaria prophylaxis before your trip. Use insect repellent and sleep under mosquito nets.',
    icon: 'ShieldCheck',
    category: 'Health & Safety',
    status: 'published',
    created_at: '2023-04-25T16:00:00Z',
    updated_at: '2023-04-25T16:00:00Z',
  },
  {
    id: '6',
    title: 'Currency and Tipping',
    slug: 'currency-and-tipping',
    content: 'The local currency is the Tanzanian Shilling (TZS). US dollars are widely accepted. Tipping is customary for good service.',
    icon: 'Landmark', // Another Lucide icon
    category: 'Money Matters',
    status: 'published',
    created_at: '2023-04-20T12:00:00Z',
    updated_at: '2023-04-20T12:00:00Z',
  },
];

export default async function TravelTipsPage() {
  // In a real app, fetch travel tips from Supabase
  // const { data: travelTips, error } = await supabase.from('travel_tips').select('*').eq('status', 'published');
  const travelTips = dummyTravelTips;

  // Group tips by category
  const tipsByCategory: { [category: string]: TravelTip[] } = travelTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as { [category: string]: TravelTip[] });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold mb-10 text-center">Essential Travel Tips</h1>
        
        {Object.entries(tipsByCategory).length > 0 ? (
          Object.entries(tipsByCategory).map(([category, tips]) => (
            <section key={category} className="mb-12">
              <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6 border-b-2 border-primary pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tips.map((tip) => (
                  <TravelTipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No travel tips found. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
