
"use client";

import { YoutubeUpdateForm, type YoutubeUpdateSubmitData } from "@/components/forms/YoutubeUpdateForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function NewYoutubeUpdatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: YoutubeUpdateSubmitData) => {
    setIsSubmitting(true);
    try {
      // Ensure likes and dislikes are numbers, default to 0 if not provided properly by form state
      const dataToInsert = {
        ...values,
        likes: Number(values.likes) || 0,
        dislikes: Number(values.dislikes) || 0,
      };

      const { error } = await supabase.from('youtube_updates').insert([dataToInsert]);

      if (error) {
        toast({ title: "Error creating YouTube update", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "YouTube update posted successfully." });
        router.push("/admin/youtube-updates");
        router.refresh(); 
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Post New YouTube Update</h1>
      <YoutubeUpdateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
