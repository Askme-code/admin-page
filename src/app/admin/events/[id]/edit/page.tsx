
"use client";

import { EventForm } from "@/components/forms/EventForm";
import type { Event } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as z from "zod";
import Link from 'next/link';

type EventFormValues = z.infer<typeof import("@/components/forms/EventForm").eventSchema>;

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No event ID provided.", variant: "destructive" });
      router.push("/admin/events");
      return;
    }
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching event", description: error.message, variant: "destructive" });
        setEvent(null);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: EventFormValues) => {
    if (!params.id) return;
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          ...values,
          event_date: values.event_date.toISOString(),
          featured_image: values.featured_image || null,
          updated_at: new Date().toISOString(), // Ensure updated_at is set on update
        })
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating event", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Event updated successfully." });
        router.push("/admin/events");
        router.refresh();
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="container py-8">Loading event...</div>;
  }
  
  if (!event) {
    return <div className="container py-8">Event not found or error loading. <Link href="/admin/events" className="text-primary hover:underline">Go back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Event</h1>
      <EventForm initialData={event} onSubmit={handleSubmit} />
    </div>
  );
}
