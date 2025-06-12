
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
import type { Destination } from "@/lib/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPABASE_BUCKET_NAME = 'contentimage';

export const destinationFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description is too short." }),
  featured_image_url_field: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  featured_image_file_field: z.custom<File>(val => val instanceof File, "Please select a file.")
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), '.jpg, .jpeg, .png, .webp, .gif files are accepted.'),
  location: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
})
.refine(data => !(data.featured_image_url_field && data.featured_image_file_field), {
  message: "Provide either an image URL or an image file, not both.",
  path: ["featured_image_url_field"],
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

export type DestinationSubmitData = {
  name: string;
  description: string;
  featured_image?: string;
  location?: string;
  highlights?: string[];
  status: 'draft' | 'published';
};

interface DestinationFormProps {
  initialData?: Destination | null;
  onSubmit: (values: DestinationSubmitData) => Promise<void>;
}

export function DestinationForm({ initialData, onSubmit }: DestinationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      featured_image_url_field: initialData?.featured_image || "",
      featured_image_file_field: undefined,
      location: initialData?.location || "",
      highlights: initialData?.highlights || [],
      status: initialData?.status || "draft",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFormSubmit = async (formValues: DestinationFormValues) => {
    let finalFeaturedImageUrl: string | undefined = undefined;

    if (formValues.featured_image_file_field) {
      const file = formValues.featured_image_file_field;
      const filePath = `public/${Date.now()}-${file.name}`;
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          const description = typeof uploadError.message === 'string' ? uploadError.message : "Could not upload image. Check RLS policies or bucket settings.";
          toast({ title: "Image Upload Error", description, variant: "destructive" });
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
        toast({ title: "Image Upload Failed", description: (e as Error).message || "An unexpected error occurred during upload.", variant: "destructive" });
        return;
      }
    } else if (formValues.featured_image_url_field) {
      finalFeaturedImageUrl = formValues.featured_image_url_field;
    }

    const dataToSubmit: DestinationSubmitData = {
      name: formValues.name,
      description: formValues.description,
      featured_image: finalFeaturedImageUrl || undefined,
      location: formValues.location || undefined,
      highlights: formValues.highlights || [],
      status: formValues.status,
    };
    await onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Destination name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the destination..." {...field} rows={6} disabled={isLoading} />
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
              <FormLabel>Featured Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/image.png" 
                  {...field} 
                  value={field.value ?? ""} 
                  disabled={isLoading || !!form.watch('featured_image_file_field')} />
              </FormControl>
              <FormDescription>Paste an image URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="featured_image_file_field"
          render={({ field: { onChange, value, ...restField }}) => (
            <FormItem>
              <FormLabel>Or Upload Featured Image (Optional)</FormLabel>
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Northern Tanzania" {...field} value={field.value ?? ""} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highlights (Optional, comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Highlight 1, Highlight 2, Highlight 3"
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Enter key highlights separated by commas.</FormDescription>
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
            {isLoading ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Destination")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

    