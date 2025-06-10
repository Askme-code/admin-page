import { EventForm } from "@/components/forms/EventForm";

export default function NewEventPage() {
  const handleSubmit = async (values: any) => {
    console.log("Submitting new event:", values);
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
