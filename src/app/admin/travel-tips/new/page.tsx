"use client";

import { TravelTipForm } from "@/components/forms/TravelTipForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type * as z from "zod";

type TravelTipFormValues = z.infer<typeof import("@/components/forms/TravelTipForm").travelTipSchema>;

export default function NewTravelTipPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: TravelTipFormValues) => {
    try {
      const { error } = await supabase.from('travel_tips').insert([
        { 
          ...values,
        }
      ]);

      if (error) {
        toast({ title: "Error creating travel tip", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Travel tip created successfully." });
        router.push("/admin/travel-tips");
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Travel Tip</h1>
      <TravelTipForm onSubmit={handleSubmit} />
    </div>
  );
}
