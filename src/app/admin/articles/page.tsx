import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Article } from '@/lib/types';

// Dummy data - replace with actual data fetching from Supabase
const dummyAdminArticles: Article[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Climbing Mount Kilimanjaro',
    slug: 'climbing-mount-kilimanjaro',
    content: '...',
    category: 'Adventure',
    status: 'published',
    author: 'John Doe',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Exploring the Historic Stone Town of Zanzibar',
    slug: 'exploring-stone-town-zanzibar',
    content: '...',
    category: 'Culture',
    status: 'draft',
    author: 'Jane Smith',
    created_at: '2023-09-15T14:30:00Z',
    updated_at: '2023-09-16T09:00:00Z',
  },
];

export default async function AdminArticlesPage() {
  // In a real app, fetch articles from Supabase
  const articles = dummyAdminArticles;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
