"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TravelTip } from "@/lib/types";
import { useRouter } from "next/navigation";

const travelTipSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  content: z.string().min(10, { message: "Content is too short." }),
  icon: z.string().min(1, { message: "Icon name is required." }), // Lucide icon name
  category: z.string().min(1, { message: "Category is required." }),
  status: z.enum(["draft", "published"]),
});

type TravelTipFormValues = z.infer<typeof travelTipSchema>;

interface TravelTipFormProps {
  initialData?: TravelTip | null;
  onSubmit: (values: TravelTipFormValues) => Promise<void>;
}

export function TravelTipForm({ initialData, onSubmit }: TravelTipFormProps) {
  const router = useRouter();
  const form = useForm<TravelTipFormValues>({
    resolver: zodResolver(travelTipSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      icon: "",
      category: "",
      status: "draft",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: TravelTipFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Travel tip title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="travel-tip-slug" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>URL-friendly version of the title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the travel tip..." {...field} rows={4} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ShieldCheck, Luggage (from Lucide)" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Enter a valid Lucide icon name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Health & Safety, Packing" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Save Changes" : "Create Travel Tip"}
          </Button>
           <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
