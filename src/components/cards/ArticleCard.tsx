import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {article.featured_image && (
        <div className="relative w-full h-48">
          <Image
            src={article.featured_image}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="travel blog"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {article.excerpt && (
          <CardDescription className="text-sm mb-2 line-clamp-3">{article.excerpt}</CardDescription>
        )}
        <div className="text-xs text-muted-foreground space-y-1 mt-2">
          <div className="flex items-center">
            <UserCircle className="mr-1.5 h-4 w-4" />
            <span>By {article.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0 text-sm">
          <Link href={`/articles/${article.slug}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
