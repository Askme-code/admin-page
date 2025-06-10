import Image from 'next/image';
import type { Destination } from '@/lib/types';
import { MapPin, Star, ListChecks } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

// Dummy data - replace with actual data fetching from Supabase
const dummyDestination: Destination = {
  id: '1',
  name: 'Serengeti National Park',
  slug: 'serengeti-national-park',
  description: `
    <p>The Serengeti National Park is a Tanzanian national park in the Serengeti ecosystem in the Mara and Simiyu regions. It is famous for its annual migration of over 1.5 million white-bearded (or brindled) wildebeest and 250,000 zebra and for its numerous Nile crocodile and honey badger.</p>
    <h2 class="text-2xl font-headline mt-6 mb-3">Wildlife Spectacle</h2>
    <p>Often described as the 'endless plains,' the Serengeti offers unparalleled wildlife viewing. The park is home to the "Big Five" (lion, leopard, elephant, rhino, and buffalo) and a myriad of other species. Birdwatching is also exceptional, with over 500 species recorded.</p>
    <h2 class="text-2xl font-headline mt-6 mb-3">The Great Migration</h2>
    <p>One of Earth's most impressive natural events, the Great Migration sees millions of wildebeest, zebra, and gazelle traverse the plains in search of fresh grazing. This dramatic spectacle is a must-see for any wildlife enthusiast.</p>
    <figure class="my-6">
      <img src="https://placehold.co/800x500.png" alt="Serengeti Migration" class="rounded-lg shadow-md mx-auto" data-ai-hint="Serengeti migration">
      <figcaption class="text-center text-sm text-muted-foreground mt-2">Wildebeest crossing the Mara River during the Great Migration.</figcaption>
    </figure>
    <h2 class="text-2xl font-headline mt-6 mb-3">Activities</h2>
    <p>Beyond game drives, visitors can enjoy hot air balloon safaris at dawn, offering a breathtaking perspective of the plains. Cultural visits to nearby Maasai villages provide insight into the local traditions and way of life.</p>
  `,
  featured_image: 'https://placehold.co/1200x600.png',
  location: 'Northern Tanzania',
  highlights: ['The Great Migration', 'Big Five spotting', 'Hot air balloon safaris', 'Maasai cultural visits', 'Diverse birdlife'],
  status: 'published',
  created_at: '2023-08-01T10:00:00Z',
  updated_at: '2023-08-01T10:00:00Z',
};

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, fetch destination by slug from Supabase
  // const { data: destination, error } = await supabase.from('destinations').select('*').eq('slug', params.slug).single();
  const destination = dummyDestination; // Using dummy data

  if (!destination) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Destination Not Found</h1>
          <p className="text-muted-foreground mt-4">The destination you are looking for does not exist.</p>
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
              {destination.featured_image && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={destination.featured_image}
                    alt={destination.name}
                    layout="fill"
                    objectFit="cover"
                    priority
                    data-ai-hint="Tanzania attraction"
                  />
                </div>
              )}
              <h1 className="font-headline text-3xl md:text-5xl font-bold mb-4 leading-tight">{destination.name}</h1>
              {destination.location && (
                <div className="flex items-center text-lg text-muted-foreground mb-6">
                  <MapPin className="mr-2 h-6 w-6 text-primary" />
                  <span>{destination.location}</span>
                </div>
              )}
            </header>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: destination.description }}
            />

            {destination.highlights && destination.highlights.length > 0 && (
              <section className="mt-12">
                <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6 flex items-center">
                  <ListChecks className="mr-3 h-7 w-7 text-accent" />
                  Key Highlights
                </h2>
                <div className="flex flex-wrap gap-3">
                  {destination.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-base px-4 py-2 border-accent text-accent-foreground bg-accent/10">
                      <Star className="mr-2 h-4 w-4 text-accent" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Optional: Generate static paths
// export async function generateStaticParams() {
//   // Fetch all destination slugs from Supabase
//   return [{ slug: 'serengeti-national-park' }, { slug: 'zanzibar-archipelago' }];
// }
