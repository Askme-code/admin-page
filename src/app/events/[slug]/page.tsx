import Image from 'next/image';
import type { Event } from '@/lib/types';
import { CalendarDays, MapPin, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const { data: events, error } = await supabase
    .from('events')
    .select('slug')
    .eq('status', 'published');

  if (error || !events) {
    return [];
  }
  return events.map(({ slug }) => ({ slug }));
}


export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching event:', error);
  }

  if (!event) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Event Not Found</h1>
          <p className="text-muted-foreground mt-4">The event you are looking for does not exist or is not published.</p>
          <Link href="/events" className="mt-4 inline-block text-primary hover:underline">Back to events</Link>
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
