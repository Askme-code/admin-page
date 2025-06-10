
"use client";

import { DestinationForm } from "@/components/forms/DestinationForm";
import type { Destination } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const dummyDestinationToEdit: Destination = {
  id: '1',
  name: 'Serengeti National Park',
  slug: 'serengeti-national-park',
  description: 'Vast plains teeming with wildlife. A quintessential safari destination.',
  featured_image: 'https://placehold.co/600x400.png',
  location: 'Northern Tanzania',
  highlights: ['The Great Migration', 'Big Five spotting', 'Hot air balloon safaris'],
  status: 'published',
  created_at: '2023-08-01T10:00:00Z',
  updated_at: '2023-08-01T10:00:00Z',
};

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  
  const destination = dummyDestinationToEdit; 

  const handleSubmit = async (values: any) => {
    console.log("Updating destination:", params.id, values);
    // Example Supabase call:
    // const { error } = await supabase.from('destinations').update(values).eq('id', params.id);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Destination updated." });
    //   router.push("/admin/destinations");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  if (!destination) {
    return <div>Loading destination or destination not found...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Destination</h1>
      <DestinationForm initialData={destination} onSubmit={handleSubmit} />
    </div>
  );
}
