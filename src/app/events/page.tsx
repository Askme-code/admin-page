import type { Event } from '@/lib/types';
import EventCard from '@/components/cards/EventCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dummy data - replace with actual data fetching from Supabase
const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Sauti za Busara Music Festival',
    slug: 'sauti-za-busara',
    description: 'Celebrates African music under African skies. A vibrant festival in Stone Town, Zanzibar.',
    event_date: '2025-02-14T00:00:00Z',
    location: 'Stone Town, Zanzibar',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    created_at: '2023-06-01T10:00:00Z',
    updated_at: '2023-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Kilimanjaro Marathon',
    slug: 'kilimanjaro-marathon',
    description: 'A challenging marathon run in the foothills of Mount Kilimanjaro, attracting international runners.',
    event_date: '2025-03-02T00:00:00Z',
    location: 'Moshi, Tanzania',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    created_at: '2023-07-10T11:00:00Z',
    updated_at: '2023-07-10T11:00:00Z',
  },
  {
    id: '3',
    title: 'Nyama Choma Festival',
    slug: 'nyama-choma-festival',
    description: 'A celebration of East African barbecue culture, featuring delicious grilled meats, music, and entertainment.',
    event_date: '2024-12-07T00:00:00Z',
    location: 'Dar es Salaam, Tanzania',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    created_at: '2023-08-20T09:00:00Z',
    updated_at: '2023-08-20T09:00:00Z',
  },
];

export default async function EventsPage() {
  // In a real app, fetch events from Supabase
  // const { data: events, error } = await supabase.from('events').select('*').eq('status', 'published').order('event_date', { ascending: true });
  const events = dummyEvents;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold mb-10 text-center">Upcoming Events</h1>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No upcoming events found. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
