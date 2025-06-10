"use client";

import { ArticleForm } from "@/components/forms/ArticleForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type * as z from "zod";
import type { articleSchema } from "@/components/forms/ArticleForm"; // Assuming schema is exported or define type here

type ArticleFormValues = z.infer<typeof import("@/components/forms/ArticleForm").articleSchema>;


export default function NewArticlePage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: ArticleFormValues) => {
    try {
      const { error } = await supabase.from('articles').insert([
        { 
          ...values,
          excerpt: values.excerpt || null,
          featured_image: values.featured_image || null,
          // Assuming created_at and updated_at are handled by DB or not required in insert
        }
      ]);

      if (error) {
        toast({ title: "Error creating article", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Article created successfully." });
        router.push("/admin/articles");
      }
    } catch (e) {
      toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
