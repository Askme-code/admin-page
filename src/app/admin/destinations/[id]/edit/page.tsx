
"use client";

import { DestinationForm } from "@/components/forms/DestinationForm";
import type { Destination } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as z from "zod";
import Link from 'next/link';

type DestinationFormValues = z.infer<typeof import("@/components/forms/DestinationForm").destinationSchema>;

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No destination ID provided.", variant: "destructive" });
      router.push("/admin/destinations");
      return;
    }

    const fetchDestination = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching destination", description: error.message, variant: "destructive" });
        setDestination(null);
      } else {
        setDestination(data);
      }
      setLoading(false);
    };

    fetchDestination();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: DestinationFormValues) => {
    if (!params.id) return;
    try {
      const { error } = await supabase
        .from('destinations')
        .update({ 
          ...values,
          featured_image: values.featured_image || null,
          location: values.location || null,
          highlights: values.highlights || [],
          updated_at: new Date().toISOString(), // Ensure updated_at is set on update
        })
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating destination", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Destination updated successfully." });
        router.push("/admin/destinations");
        router.refresh(); 
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };
  
  if (loading) {
    return <div className="container py-8">Loading destination...</div>;
  }

  if (!destination) {
    return <div className="container py-8">Destination not found or error loading. <Link href="/admin/destinations" className="text-primary hover:underline">Go back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Destination</h1>
      <DestinationForm initialData={destination} onSubmit={handleSubmit} />
    </div>
  );
}
