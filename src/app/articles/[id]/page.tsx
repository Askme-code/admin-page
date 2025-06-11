
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { CalendarDays, UserCircle, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id')
    .eq('status', 'published');

  if (error || !articles) {
    return [];
  }
  return articles.map(({ id }) => ({ id }));
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') { 
    console.error('Error fetching article:', error);
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12 text-center">
          <h1 className="font-headline text-4xl font-semibold">Article Not Found</h1>
          <p className="text-muted-foreground mt-4">The article you are looking for does not exist or is not published.</p>
          <Link href="/articles" className="mt-4 inline-block text-primary hover:underline">Back to articles</Link>
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
