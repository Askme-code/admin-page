
"use client";

import { TravelTipForm } from "@/components/forms/TravelTipForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewTravelTipPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    console.log("Submitting new travel tip:", values);
    // Example Supabase call:
    // const { error } = await supabase.from('travel_tips').insert([values]);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Travel tip created." });
    //   router.push("/admin/travel-tips");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Travel Tip</h1>
      <TravelTipForm onSubmit={handleSubmit} />
    </div>
  );
}
