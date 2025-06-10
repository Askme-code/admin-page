import { DestinationForm } from "@/components/forms/DestinationForm";

export default function NewDestinationPage() {
  const handleSubmit = async (values: any) => {
    console.log("Submitting new destination:", values);
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Destination</h1>
      <DestinationForm onSubmit={handleSubmit} />
    </div>
  );
}
