
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge'; // Status badge no longer used
import { PlusCircle, Edit, Trash2, Star } from 'lucide-react';
import type { UserReview } from '@/lib/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching reviews", description: error.message, variant: "destructive" });
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const { error } = await supabase.from('user_reviews').delete().eq('id', id);
      if (error) {
        toast({ title: "Error deleting review", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Review deleted successfully." });
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-headline font-semibold">Manage User Reviews</h1>
          <Button asChild>
            <Link href="/admin/reviews/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Review
            </Link>
          </Button>
        </div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage User Reviews</h1>
        <Button asChild>
          <Link href="/admin/reviews/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Review
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Image</TableHead>
              <TableHead className="w-[20%]">Full Name</TableHead>
              <TableHead className="w-[10%]">Rating</TableHead>
              <TableHead className="w-[35%]">Review (Excerpt)</TableHead>
              {/* <TableHead className="w-[10%]">Status</TableHead> Removed Status Column */}
              <TableHead className="w-[15%]">Created At</TableHead>
              <TableHead className="text-right w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    {review.image_url ? (
                      <Image 
                        src={review.image_url} 
                        alt={review.full_name} 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{review.full_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {review.rating} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{review.review.substring(0, 100)}{review.review.length > 100 ? '...' : ''}</TableCell>
                  {/* Status Cell Removed 
                  <TableCell>
                    <Badge variant={review.status === 'published' ? 'default' : (review.status === 'pending' ? 'secondary' : 'destructive')}>
                      {review.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  */}
                  <TableCell>{format(new Date(review.created_at), "PP")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/reviews/${review.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(review.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24"> {/* Adjusted colSpan */}
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
