
import type { Destination } from '@/lib/types';
import DestinationCard from '@/components/cards/DestinationCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensures the page is dynamically rendered

export default async function DestinationsPage() {
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching destinations:', error);
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Destinations</AlertTitle>
            <AlertDescription>
              Could not load destinations at this time. Please try again later.
              {process.env.NODE_ENV === 'development' && <p className="mt-2 text-xs">Details: {error.message}</p>}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold mb-10 text-center">Explore Our Destinations</h1>
        {destinations && destinations.length > 0 ? (
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

