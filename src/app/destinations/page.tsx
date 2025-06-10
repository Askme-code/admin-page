import type { Destination } from '@/lib/types';
import DestinationCard from '@/components/cards/DestinationCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dummy data - replace with actual data fetching from Supabase
const dummyDestinations: Destination[] = [
  {
    id: '1',
    name: 'Serengeti National Park',
    slug: 'serengeti-national-park',
    description: 'Experience the Great Migration and vast plains teeming with wildlife. A quintessential safari destination.',
    featured_image: 'https://placehold.co/600x400.png',
    location: 'Northern Tanzania',
    highlights: ['The Great Migration', 'Big Five spotting', 'Hot air balloon safaris'],
    status: 'published',
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2023-08-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ngorongoro Conservation Area',
    slug: 'ngorongoro-conservation-area',
    description: 'Home to the stunning Ngorongoro Crater, a UNESCO World Heritage site, offering incredible wildlife density.',
    featured_image: 'https://placehold.co/600x400.png',
    location: 'Northern Tanzania',
    highlights: ['Ngorongoro Crater', 'Maasai villages', 'Olduvai Gorge'],
    status: 'published',
    created_at: '2023-08-15T11:00:00Z',
    updated_at: '2023-08-15T11:00:00Z',
  },
  {
    id: '3',
    name: 'Zanzibar Archipelago',
    slug: 'zanzibar-archipelago',
    description: 'Pristine beaches, turquoise waters, historic Stone Town, and spice farms make Zanzibar a tropical paradise.',
    featured_image: 'https://placehold.co/600x400.png',
    location: 'Off the coast of Tanzania',
    highlights: ['Stone Town', 'Nungwi Beach', 'Spice tours', 'Jozani Forest'],
    status: 'published',
    created_at: '2023-07-20T09:00:00Z',
    updated_at: '2023-07-20T09:00:00Z',
  },
];

export default async function DestinationsPage() {
  // In a real app, fetch destinations from Supabase
  // const { data: destinations, error } = await supabase.from('destinations').select('*').eq('status', 'published');
  const destinations = dummyDestinations;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold mb-10 text-center">Explore Our Destinations</h1>
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No destinations found. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
