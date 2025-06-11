
"use client";

import { TravelTipForm } from "@/components/forms/TravelTipForm";
import type { TravelTip } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as z from "zod";
import Link from 'next/link';

type TravelTipFormValues = z.infer<typeof import("@/components/forms/TravelTipForm").travelTipSchema>;

export default function EditTravelTipPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [travelTip, setTravelTip] = useState<TravelTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No travel tip ID provided.", variant: "destructive" });
      router.push("/admin/travel-tips");
      return;
    }
    const fetchTravelTip = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('travel_tips')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching travel tip", description: error.message, variant: "destructive" });
        setTravelTip(null);
      } else {
        setTravelTip(data);
      }
      setLoading(false);
    };

    fetchTravelTip();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: TravelTipFormValues) => {
    if (!params.id) return;
    try {
      const { error } = await supabase
        .from('travel_tips')
        .update({ 
          ...values,
          featured_image: values.featured_image || null,
          updated_at: new Date().toISOString(), 
        })
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating travel tip", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Travel tip updated successfully." });
        router.push("/admin/travel-tips");
        router.refresh();
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="container py-8">Loading travel tip...</div>;
  }

  if (!travelTip) {
    return <div className="container py-8">Travel tip not found or error loading. <Link href="/admin/travel-tips" className="text-primary hover:underline">Go back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Travel Tip</h1>
      <TravelTipForm initialData={travelTip} onSubmit={handleSubmit} />
    </div>
  );
}
