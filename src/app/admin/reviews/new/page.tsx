
"use client";

import { ReviewForm } from "@/components/forms/ReviewForm";
import type { ReviewSubmitData } from "@/components/forms/ReviewForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewReviewPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: ReviewSubmitData) => {
    try {
      // Values no longer includes status
      const { error } = await supabase.from('user_reviews').insert([
        { 
          ...values,
          location: values.location || null,
          image_url: values.image_url || null,
          // status is not sent as it's removed from ReviewSubmitData
        }
      ]);

      if (error) {
        toast({ title: "Error creating review", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Review created successfully." });
        router.push("/admin/reviews");
        router.refresh(); 
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Review</h1>
      <ReviewForm onSubmit={handleSubmit} />
    </div>
  );
}
