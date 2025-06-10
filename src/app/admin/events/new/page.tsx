
"use client";

import { EventForm } from "@/components/forms/EventForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    console.log("Submitting new event:", values);
    // Example Supabase call:
    // const { error } = await supabase.from('events').insert([values]);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Event created." });
    //   router.push("/admin/events");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
