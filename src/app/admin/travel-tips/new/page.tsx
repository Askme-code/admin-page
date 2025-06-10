import { TravelTipForm } from "@/components/forms/TravelTipForm";

export default function NewTravelTipPage() {
  const handleSubmit = async (values: any) => {
    console.log("Submitting new travel tip:", values);
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Travel Tip</h1>
      <TravelTipForm onSubmit={handleSubmit} />
    </div>
  );
}
