import { EventForm } from "@/components/forms/EventForm";
import type { Event } from "@/lib/types";

const dummyEventToEdit: Event = {
  id: '1',
  title: 'Sauti za Busara Music Festival',
  slug: 'sauti-za-busara',
  description: 'Celebrates African music under African skies. A vibrant festival in Stone Town, Zanzibar.',
  event_date: '2025-02-14T00:00:00Z',
  location: 'Stone Town, Zanzibar',
  featured_image: 'https://placehold.co/600x400.png',
  status: 'published',
  created_at: '2023-06-01T10:00:00Z',
  updated_at: '2023-06-01T10:00:00Z',
};

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = dummyEventToEdit; 

  const handleSubmit = async (values: any) => {
    console.log("Updating event:", params.id, values);
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  if (!event) {
    return <div>Loading event or event not found...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Event</h1>
      <EventForm initialData={event} onSubmit={handleSubmit} />
    </div>
  );
}
