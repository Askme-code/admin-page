
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
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPABASE_BUCKET_NAME = 'content_images';

export const travelTipFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content is too short." }),
  icon: z.string().min(1, { message: "Icon name is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  featured_image_url_field: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  featured_image_file_field: z.custom<File>(val => val instanceof File, "Please select a file.")
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), '.jpg, .jpeg, .png, .webp, .gif files are accepted.'),
  status: z.enum(["draft", "published"]),
})
.refine(data => !(data.featured_image_url_field && data.featured_image_file_field), {
  message: "Provide either an image URL or an image file, not both.",
  path: ["featured_image_url_field"],
});

type TravelTipFormValues = z.infer<typeof travelTipFormSchema>;

export type TravelTipSubmitData = {
  title: string;
  content: string;
  icon: string;
  category: string;
  featured_image?: string;
  status: 'draft' | 'published';
};

interface TravelTipFormProps {
  initialData?: TravelTip | null;
  onSubmit: (values: TravelTipSubmitData) => Promise<void>;
}

export function TravelTipForm({ initialData, onSubmit }: TravelTipFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<TravelTipFormValues>({
    resolver: zodResolver(travelTipFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      icon: initialData?.icon || "",
      category: initialData?.category || "",
      featured_image_url_field: initialData?.featured_image || "",
      featured_image_file_field: undefined,
      status: initialData?.status || "draft",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFormSubmit = async (formValues: TravelTipFormValues) => {
    let finalFeaturedImageUrl: string | undefined = undefined;

    if (formValues.featured_image_file_field) {
      const file = formValues.featured_image_file_field;
      const filePath = `public/${Date.now()}-${file.name}`;
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: "Image Upload Error", description: uploadError.message, variant: "destructive" });
          return;
        }
        if (uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .getPublicUrl(uploadData.path);
            finalFeaturedImageUrl = publicUrlData?.publicUrl;
        } else {
            toast({ title: "Image Upload Error", description: "Failed to get public URL for uploaded image.", variant: "destructive" });
            return;
        }
      } catch (e) {
        toast({ title: "Image Upload Failed", description: (e as Error).message, variant: "destructive" });
        return;
      }
    } else if (formValues.featured_image_url_field) {
      finalFeaturedImageUrl = formValues.featured_image_url_field;
    }

    const dataToSubmit: TravelTipSubmitData = {
      title: formValues.title,
      content: formValues.content,
      icon: formValues.icon,
      category: formValues.category,
      featured_image: finalFeaturedImageUrl || undefined,
      status: formValues.status,
    };
    await onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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
              <FormDescription>Enter a valid Lucide icon name (e.g. Droplet, Layers). See lucide.dev for options.</FormDescription>
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
          name="featured_image_url_field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/tip-image.png" 
                  {...field} 
                  value={field.value ?? ""} 
                  disabled={isLoading || !!form.watch('featured_image_file_field')} 
                />
              </FormControl>
              <FormDescription>Enter a valid URL for an image to display with the tip.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured_image_file_field"
          render={({ field: { onChange, value, ...restField }}) => (
            <FormItem>
              <FormLabel>Or Upload Image (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                  {...restField} 
                  disabled={isLoading || !!form.watch('featured_image_url_field')}
                  className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </FormControl>
              <FormDescription>Max 5MB. Accepted: .jpg, .png, .webp, .gif</FormDescription>
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
            {isLoading ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Travel Tip")}
          </Button>
           <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
