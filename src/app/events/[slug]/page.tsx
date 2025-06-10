import Image from 'next/image';
import type { Event } from '@/lib/types';
import { CalendarDays, MapPin, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

// Dummy data - replace with actual data fetching from Supabase
const dummyEvent: Event = {
  id: '1',
  title: 'Sauti za Busara Music Festival',
  slug: 'sauti-za-busara',
  description: `
    <p>Sauti za Busara ("Sounds of Wisdom" in Swahili) is an acclaimed African music festival held annually in Stone Town, Zanzibar. It showcases a diverse line-up of artists from across the African continent and diaspora, celebrating the richness and variety of African music.</p>
    <h2 class="text-2xl font-headline mt-6 mb-3">Festival Atmosphere</h2>
    <p>The festival takes place over several days, primarily at the historic Old Fort (Ngome Kongwe). Expect a vibrant atmosphere with multiple stages, food stalls, and craft markets. It's a fantastic opportunity to experience live music, dance, and connect with people from all over the world.</p>
    <figure class="my-6">
      <img src="https://placehold.co/800x500.png" alt="Sauti za Busara Stage" class="rounded-lg shadow-md mx-auto" data-ai-hint="music festival stage">
      <figcaption class="text-center text-sm text-muted-foreground mt-2">A performance at Sauti za Busara.</figcaption>
    </figure>
    <h2 class="text-2xl font-headline mt-6 mb-3">Line-up and Tickets</h2>
    <p>The line-up typically features a mix of established stars and emerging talents. Genres range from Taarab and Bongo Flava to Afrobeat, reggae, and traditional sounds. Tickets are usually available online in advance, with options for full festival passes or day tickets.</p>
    <p>For the most up-to-date information on artists, schedules, and ticketing, please visit the official Sauti za Busara website.</p>
  `,
  event_date: '2025-02-14T00:00:00Z',
  location: 'Stone Town, Zanzibar',
  featured_image: 'https://placehold.co/1200x600.png',
  status: 'published',
  created_at: '2023-06-01T10:00:00Z',
  updated_at: '2023-06-01T10:00:00Z',
};

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, fetch event by slug from Supabase
  // const { data: event, error } = await supabase.from('events').select('*').eq('slug', params.slug).single();
  const event = dummyEvent; // Using dummy data

  if (!event) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Event Not Found</h1>
          <p className="text-muted-foreground mt-4">The event you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container max-w-4xl mx-auto">
          <article>
            <header className="mb-8">
              {event.featured_image && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={event.featured_image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    priority
                    data-ai-hint="Tanzania festival"
                  />
                </div>
              )}
              <h1 className="font-headline text-3xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-muted-foreground mb-6">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-6 w-6 text-primary" />
                  <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
            </header>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />

            <div className="mt-12 p-6 bg-accent/10 rounded-lg">
              <h3 className="font-headline text-xl font-semibold mb-3 flex items-center text-accent-foreground">
                <Info className="mr-2 h-6 w-6 text-accent" /> Event Information
              </h3>
              <p className="text-accent-foreground/80">
                For the latest updates, ticket information, and full schedule, please refer to the official event organizers. Enjoy the event!
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Optional: Generate static paths
// export async function generateStaticParams() {
//   // Fetch all event slugs from Supabase
//   return [{ slug: 'sauti-za-busara' }, { slug: 'kilimanjaro-marathon' }];
// }
