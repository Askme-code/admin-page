import type { TravelTip } from '@/lib/types';
import TravelTipCard from '@/components/cards/TravelTipCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export default async function TravelTipsPage() {
  const { data: travelTips, error } = await supabase
    .from('travel_tips')
    .select('*')
    .eq('status', 'published')
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching travel tips:', error);
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Fetching Travel Tips</AlertTitle>
            <AlertDescription>
              Could not load travel tips at this time. Please try again later.
              {process.env.NODE_ENV === 'development' && <p className="mt-2 text-xs">Details: {error.message}</p>}
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  const tipsByCategory: { [category: string]: TravelTip[] } = (travelTips || []).reduce((acc, tip) => {
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
