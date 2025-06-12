
"use client";

import Link from 'next/link';
import { YoutubeUpdateForm, type YoutubeUpdateSubmitData } from "@/components/forms/YoutubeUpdateForm";
import type { YoutubeUpdate } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditYoutubeUpdatePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [update, setUpdate] = useState<YoutubeUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No update ID provided.", variant: "destructive" });
      router.push("/admin/youtube-updates");
      return;
    }

    const fetchUpdate = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('youtube_updates')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching YouTube update", description: error.message, variant: "destructive" });
        setUpdate(null);
      } else {
        // Ensure likes and dislikes are numbers
        const fetchedData = data as YoutubeUpdate;
        setUpdate({
            ...fetchedData,
            likes: Number(fetchedData.likes) || 0,
            dislikes: Number(fetchedData.dislikes) || 0,
        });
      }
      setLoading(false);
    };

    fetchUpdate();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: YoutubeUpdateSubmitData) => {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      // Ensure likes and dislikes are numbers before updating
      const dataToUpdate = {
        ...values,
        likes: Number(values.likes) || 0,
        dislikes: Number(values.dislikes) || 0,
      };

      const { error } = await supabase
        .from('youtube_updates')
        .update(dataToUpdate)
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating YouTube update", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "YouTube update updated successfully." });
        router.push("/admin/youtube-updates");
        router.refresh(); 
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-8">Loading YouTube update...</div>;
  }
  
  if (!update) {
    return (
      <div className="container py-8">
        YouTube update not found or error loading. 
        <Link href="/admin/youtube-updates" className="text-primary hover:underline ml-2">Go back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit YouTube Update</h1>
      <YoutubeUpdateForm initialData={update} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
