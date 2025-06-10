
"use client";

import { TravelTipForm } from "@/components/forms/TravelTipForm";
import type { TravelTip } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const dummyTravelTipToEdit: TravelTip = {
    id: '1',
    title: 'Stay Hydrated',
    slug: 'stay-hydrated',
    content: 'Tanzania can be hot and humid, especially at lower altitudes. Drink plenty of bottled or purified water throughout the day.',
    icon: 'Droplet', 
    category: 'Health & Safety',
    status: 'published',
    created_at: '2023-05-01T10:00:00Z',
    updated_at: '2023-05-01T10:00:00Z',
};

export default function EditTravelTipPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();

  const travelTip = dummyTravelTipToEdit; 

  const handleSubmit = async (values: any) => {
    console.log("Updating travel tip:", params.id, values);
    // Example Supabase call:
    // const { error } = await supabase.from('travel_tips').update(values).eq('id', params.id);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Travel tip updated." });
    //   router.push("/admin/travel-tips");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  if (!travelTip) {
    return <div>Loading travel tip or tip not found...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Travel Tip</h1>
      <TravelTipForm initialData={travelTip} onSubmit={handleSubmit} />
    </div>
  );
}
