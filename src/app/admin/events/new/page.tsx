
"use client";

import { EventForm } from "@/components/forms/EventForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type * as z from "zod";

type EventFormValues = z.infer<typeof import("@/components/forms/EventForm").eventSchema>;

export default function NewEventPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: EventFormValues) => {
    try {
      const { error } = await supabase.from('events').insert([
        { 
          ...values,
          event_date: values.event_date.toISOString(), 
          featured_image: values.featured_image || null,
        }
      ]);

      if (error) {
        toast({ title: "Error creating event", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Event created successfully." });
        router.push("/admin/events");
        router.refresh();
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
