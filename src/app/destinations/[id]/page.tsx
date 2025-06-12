
import Image from 'next/image';
import type { Destination } from '@/lib/types';
import { MapPin, Star, ListChecks } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { isValidFeaturedImageUrl } from '@/lib/utils';

export async function generateStaticParams() {
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('id')
    .eq('status', 'published');
  
  if (error || !destinations) {
    return [];
  }
  return destinations.map(({ id }) => ({ id }));
}

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching destination:', error);
  }
  
  if (!destination) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Destination Not Found</h1>
          <p className="text-muted-foreground mt-4">The destination you are looking for does not exist or is not published.</p>
          <Link href="/destinations" className="mt-4 inline-block text-primary hover:underline">Back to destinations</Link>
          {error && error.code !== 'PGRST116' && process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive" className="mt-8 text-left">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Details (Development Mode)</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </main>
        <Footer />
      </div>
    );
  }
  
  const validFeaturedImage = isValidFeaturedImageUrl(destination.featured_image);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container max-w-4xl mx-auto">
          <article>
            <header className="mb-8">
              {validFeaturedImage ? (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={validFeaturedImage}
                    alt={destination.name}
                    layout="fill"
                    objectFit="cover"
                    priority
                    data-ai-hint="Tanzania attraction"
                  />
                </div>
              ) : destination.featured_image && (
                 <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg bg-muted flex items-center justify-center">
                   <p className="text-muted-foreground">Featured image not available</p>
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
