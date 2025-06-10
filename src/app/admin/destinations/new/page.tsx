"use client";

import { DestinationForm } from "@/components/forms/DestinationForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type * as z from "zod";

type DestinationFormValues = z.infer<typeof import("@/components/forms/DestinationForm").destinationSchema>;

export default function NewDestinationPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: DestinationFormValues) => {
    try {
      const { error } = await supabase.from('destinations').insert([
        { 
          ...values,
          featured_image: values.featured_image || null,
          location: values.location || null,
          highlights: values.highlights || [],
        }
      ]);

      if (error) {
        toast({ title: "Error creating destination", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Destination created successfully." });
        router.push("/admin/destinations");
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Destination</h1>
      <DestinationForm onSubmit={handleSubmit} />
    </div>
  );
}
