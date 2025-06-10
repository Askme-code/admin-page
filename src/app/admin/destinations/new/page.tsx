
"use client";

import { DestinationForm } from "@/components/forms/DestinationForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewDestinationPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    console.log("Submitting new destination:", values);
    // Example Supabase call:
    // const { error } = await supabase.from('destinations').insert([values]);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Destination created." });
    //   router.push("/admin/destinations");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Destination</h1>
      <DestinationForm onSubmit={handleSubmit} />
    </div>
  );
}
