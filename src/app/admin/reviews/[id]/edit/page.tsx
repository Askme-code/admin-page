
"use client";

import Link from 'next/link';
import { ReviewForm, type ReviewSubmitData } from "@/components/forms/ReviewForm";
import type { UserReview } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [review, setReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No review ID provided.", variant: "destructive" });
      router.push("/admin/reviews");
      return;
    }

    const fetchReview = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching review", description: error.message, variant: "destructive" });
        setReview(null);
      } else {
        setReview(data as UserReview); // Cast as UserReview
      }
      setLoading(false);
    };

    fetchReview();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: ReviewSubmitData) => {
    if (!params.id) return;
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({ 
          ...values, 
          location: values.location || null,
          image_url: values.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating review", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Review updated successfully." });
        router.push("/admin/reviews");
        router.refresh(); 
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="container py-8">Loading review...</div>;
  }
  
  if (!review) {
    return <div className="container py-8">Review not found or error loading. <Link href="/admin/reviews" className="text-primary hover:underline">Go back</Link></div>;
  }
  
  // Ensure rating is a number for the form if it comes as string from DB (though it should be int)
  const initialFormData = {
    ...review,
    rating: Number(review.rating)
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Review</h1>
      <ReviewForm initialData={initialFormData} onSubmit={handleSubmit} />
    </div>
  );
}
