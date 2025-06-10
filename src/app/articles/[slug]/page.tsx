import Image from 'next/image';
import type { Article } from '@/lib/types';
import { CalendarDays, UserCircle, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

// Dummy data - replace with actual data fetching from Supabase
const dummyArticle: Article = {
  id: '1',
  title: 'The Ultimate Guide to Climbing Mount Kilimanjaro',
  slug: 'climbing-mount-kilimanjaro',
  content: `
    <p>Mount Kilimanjaro, Africa's highest peak and the world's tallest free-standing mountain, offers an unparalleled adventure for trekkers. This guide will walk you through everything you need to know to prepare for this incredible journey.</p>
    <h2 class="text-2xl font-headline mt-6 mb-3">Choosing Your Route</h2>
    <p>There are several routes to the summit, each with its own unique scenery, difficulty, and acclimatization profile. Popular choices include the Machame, Lemosho, and Marangu routes.</p>
    <ul class="list-disc list-inside my-4 space-y-1">
      <li><strong>Machame (Whiskey Route):</strong> Known for its scenic beauty, it offers good acclimatization but is more challenging.</li>
      <li><strong>Lemosho Route:</strong> Also very scenic, with excellent acclimatization and higher success rates. Longer duration.</li>
      <li><strong>Marangu (Coca-Cola Route):</strong> The oldest and most established route, offering hut accommodations. Generally considered easier but with a steeper final ascent.</li>
    </ul>
    <h2 class="text-2xl font-headline mt-6 mb-3">Physical Preparation</h2>
    <p>While you don't need to be a professional mountaineer, a good level of physical fitness is essential. Focus on cardiovascular endurance, strength training, and hiking on varied terrain with a weighted pack.</p>
    <h2 class="text-2xl font-headline mt-6 mb-3">Packing Essentials</h2>
    <p>Proper gear is crucial for a safe and comfortable climb. Key items include layered clothing, waterproof outerwear, sturdy hiking boots, a warm sleeping bag, trekking poles, and a headlamp.</p>
    <figure class="my-6">
      <img src="https://placehold.co/800x500.png" alt="Kilimanjaro Summit" class="rounded-lg shadow-md mx-auto" data-ai-hint="Kilimanjaro summit">
      <figcaption class="text-center text-sm text-muted-foreground mt-2">The breathtaking view from Uhuru Peak.</figcaption>
    </figure>
    <p>Embarking on the Kilimanjaro trek is a challenging yet profoundly rewarding experience. With proper preparation and a determined spirit, you can stand on the roof of Africa.</p>
  `,
  excerpt: 'Everything you need to know before embarking on the adventure of a lifetime to conquer Africa\'s highest peak.',
  category: 'Adventure',
  featured_image: 'https://placehold.co/1200x600.png',
  status: 'published',
  author: 'John Doe',
  created_at: '2023-10-01T10:00:00Z',
  updated_at: '2023-10-01T10:00:00Z',
};

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, fetch article by slug from Supabase
  // const { data: article, error } = await supabase.from('articles').select('*').eq('slug', params.slug).single();
  const article = dummyArticle; // Using dummy data

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Article Not Found</h1>
          <p className="text-muted-foreground mt-4">The article you are looking for does not exist.</p>
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
              {article.featured_image && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    priority
                    data-ai-hint="travel blog header"
                  />
                </div>
              )}
              <h1 className="font-headline text-3xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <UserCircle className="mr-1.5 h-5 w-5" />
                  <span>By {article.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-1.5 h-5 w-5" />
                  <span>Published on {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="mr-1.5 h-5 w-5" />
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
              </div>
            </header>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Optional: Generate static paths if you have a known set of articles
// export async function generateStaticParams() {
//   // Fetch all article slugs from Supabase
//   // const { data: articles } = await supabase.from('articles').select('slug').eq('status', 'published');
//   // return articles?.map(({ slug }) => ({ slug })) || [];
//   return [{ slug: 'climbing-mount-kilimanjaro' }, { slug: 'exploring-stone-town-zanzibar' }];
// }
