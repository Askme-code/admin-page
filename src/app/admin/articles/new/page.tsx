import { ArticleForm } from "@/components/forms/ArticleForm";
// import { supabase } from "@/lib/supabaseClient"; // For actual submission
// import { useToast } from "@/hooks/use-toast"; // For notifications
// import { useRouter } from "next/navigation"; // For redirection

export default function NewArticlePage() {
  // const { toast } = useToast();
  // const router = useRouter();

  const handleSubmit = async (values: any) => { // Type 'any' for Zod schema values
    console.log("Submitting new article:", values);
    // Example:
    // const { error } = await supabase.from('articles').insert([values]);
    // if (error) {
    //   toast({ title: "Error", description: error.message, variant: "destructive" });
    // } else {
    //   toast({ title: "Success", description: "Article created successfully." });
    //   router.push("/admin/articles");
    // }
    alert("Form submitted (check console). Implement actual Supabase call.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
