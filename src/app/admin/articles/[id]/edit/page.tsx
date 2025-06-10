"use client";

import { ArticleForm } from "@/components/forms/ArticleForm";
import type { Article } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as z from "zod";
import Link from 'next/link'; // Added Link import

type ArticleFormValues = z.infer<typeof import("@/components/forms/ArticleForm").articleSchema>;

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      toast({ title: "Error", description: "No article ID provided.", variant: "destructive" });
      router.push("/admin/articles");
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast({ title: "Error fetching article", description: error.message, variant: "destructive" });
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [params.id, toast, router]);

  const handleSubmit = async (values: ArticleFormValues) => {
    if (!params.id) return;
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          ...values, 
          excerpt: values.excerpt || null,
          featured_image: values.featured_image || null,
          updated_at: new Date().toISOString(), // Ensure updated_at is set on update
        })
        .eq('id', params.id);

      if (error) {
        toast({ title: "Error updating article", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Article updated successfully." });
        router.push("/admin/articles");
        router.refresh(); // Refresh server components
      }
    } catch (e) {
       toast({ title: "An unexpected error occurred", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="container py-8">Loading article...</div>;
  }
  
  if (!article) {
    return <div className="container py-8">Article not found or error loading. <Link href="/admin/articles" className="text-primary hover:underline">Go back</Link></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-headline font-semibold">Edit Article</h1>
      <ArticleForm initialData={article} onSubmit={handleSubmit} />
    </div>
  );
}
