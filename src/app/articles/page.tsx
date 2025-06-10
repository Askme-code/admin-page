import type { Article } from '@/lib/types';
import ArticleCard from '@/components/cards/ArticleCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dummy data - replace with actual data fetching from Supabase
const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Climbing Mount Kilimanjaro',
    slug: 'climbing-mount-kilimanjaro',
    content: 'Detailed content about climbing Kilimanjaro...',
    excerpt: 'Everything you need to know before embarking on the adventure of a lifetime to conquer Africa\'s highest peak.',
    category: 'Adventure',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    author: 'John Doe',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Exploring the Historic Stone Town of Zanzibar',
    slug: 'exploring-stone-town-zanzibar',
    content: 'A journey through the winding alleys of Stone Town...',
    excerpt: 'Uncover the rich history and vibrant culture of Zanzibar\'s ancient heart, a UNESCO World Heritage site.',
    category: 'Culture',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    author: 'Jane Smith',
    created_at: '2023-09-15T14:30:00Z',
    updated_at: '2023-09-16T09:00:00Z',
  },
  {
    id: '3',
    title: 'Safari Essentials: What to Pack for Your Tanzanian Adventure',
    slug: 'safari-packing-essentials',
    content: 'A comprehensive packing list for your safari...',
    excerpt: 'Ensure you have everything you need for a comfortable and memorable safari experience in Tanzania\'s national parks.',
    category: 'Travel Tips',
    featured_image: 'https://placehold.co/600x400.png',
    status: 'published',
    author: 'Adventure Guide',
    created_at: '2023-11-05T12:00:00Z',
    updated_at: '2023-11-05T12:00:00Z',
  },
];

export default async function ArticlesPage() {
  // In a real app, fetch articles from Supabase here
  // const { data: articles, error } = await supabase.from('articles').select('*').eq('status', 'published');
  const articles = dummyArticles;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold mb-10 text-center">Travel Articles</h1>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No articles found. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
