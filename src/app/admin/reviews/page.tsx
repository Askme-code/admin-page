
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Star, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
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
  
  useEffect(() => {
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

  const handleStatusChange = async (id: string, newStatus: UserReview['status']) => {
    const { error } = await supabase
      .from('user_reviews')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Review status updated." });
      fetchReviews(); // Re-fetch to show updated status
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
              <TableHead className="w-[8%]">Image</TableHead>
              <TableHead className="w-[15%]">Full Name</TableHead>
              <TableHead className="w-[8%]">Rating</TableHead>
              <TableHead className="w-[25%]">Review (Excerpt)</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[12%]">Created At</TableHead>
              <TableHead className="text-right w-[20%]">Actions</TableHead>
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
                  <TableCell>
                    <Badge 
                      variant={
                        review.status === 'published' ? 'default' : 
                        (review.status === 'pending' ? 'secondary' : 'destructive')
                      }
                      className="capitalize"
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(review.created_at), "PP")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {review.status !== 'published' && (
                       <Button variant="ghost" size="icon" className="hover:text-green-500" title="Publish" onClick={() => handleStatusChange(review.id, 'published')}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    {review.status === 'published' && (
                       <Button variant="ghost" size="icon" className="hover:text-yellow-500" title="Unpublish (set to pending)" onClick={() => handleStatusChange(review.id, 'pending')}>
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    )}
                     {review.status !== 'rejected' && (
                       <Button variant="ghost" size="icon" className="hover:text-red-500" title="Reject" onClick={() => handleStatusChange(review.id, 'rejected')}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
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
                <TableCell colSpan={7} className="text-center h-24">
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
