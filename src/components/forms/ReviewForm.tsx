
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
import type { UserReview } from "@/lib/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPABASE_BUCKET_NAME = 'contentimage';

export const reviewFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  rating: z.coerce.number().min(1).max(5, { message: "Rating must be between 1 and 5." }),
  review: z.string().min(10, { message: "Review must be at least 10 characters." }),
  location: z.string().optional(),
  image_url_field: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  image_file_field: z.custom<File>(val => val instanceof File, "Please select a file.")
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), '.jpg, .jpeg, .png, .webp, .gif files are accepted.'),
  // status: z.enum(["pending", "published", "rejected"]), // Status field removed
})
.refine(data => !(data.image_url_field && data.image_file_field), {
  message: "Provide either an image URL or an image file, not both.",
  path: ["image_url_field"],
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export type ReviewSubmitData = {
  full_name: string;
  email: string;
  rating: number;
  review: string;
  location?: string;
  image_url?: string;
  // status?: 'pending' | 'published' | 'rejected'; // Status field removed
};

interface ReviewFormProps {
  initialData?: UserReview | null;
  onSubmit: (values: ReviewSubmitData) => Promise<void>;
}

export function ReviewForm({ initialData, onSubmit }: ReviewFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      rating: initialData?.rating || 3,
      review: initialData?.review || "",
      location: initialData?.location || "",
      image_url_field: initialData?.image_url || "",
      image_file_field: undefined,
      // status: initialData?.status || "pending", // Status field removed
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFormSubmit = async (formValues: ReviewFormValues) => {
    let finalImageUrl: string | undefined = undefined;

    if (formValues.image_file_field) {
      const file = formValues.image_file_field;
      const filePath = `reviews/${Date.now()}-${file.name}`;
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) {
          const description = typeof uploadError.message === 'string' && uploadError.message ? uploadError.message : "Could not upload image. Check RLS policies or bucket settings.";
          toast({ title: "Image Upload Error", description, variant: "destructive" });
          return;
        }
        if (uploadData?.path) {
          const { data: publicUrlData } = supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .getPublicUrl(uploadData.path);
          finalImageUrl = publicUrlData?.publicUrl;
        } else {
          toast({ title: "Image Upload Error", description: "Failed to get public URL for uploaded image.", variant: "destructive" });
          return;
        }
      } catch (e) {
        toast({ title: "Image Upload Failed", description: (e as Error).message || "An unexpected error occurred during upload.", variant: "destructive" });
        return;
      }
    } else if (formValues.image_url_field) {
      finalImageUrl = formValues.image_url_field;
    }

    const dataToSubmit: ReviewSubmitData = {
      full_name: formValues.full_name,
      email: formValues.email,
      rating: formValues.rating,
      review: formValues.review,
      location: formValues.location || undefined,
      image_url: finalImageUrl || undefined,
      // status: formValues.status, // Status field removed
    };
    await onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Reviewer's full name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Reviewer's email" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={String(num)}>{num} Star{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Write the review here..." {...field} rows={6} disabled={isLoading} />
              </FormControl>
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
                <Input placeholder="e.g., City, Country" {...field} value={field.value ?? ""} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url_field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reviewer Image URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/reviewer.png" 
                  {...field} 
                  value={field.value ?? ""} 
                  disabled={isLoading || !!form.watch('image_file_field')} 
                />
              </FormControl>
              <FormDescription>Paste an image URL for the reviewer.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_file_field"
          render={({ field: { onChange, value, ...restField }}) => (
            <FormItem>
              <FormLabel>Or Upload Reviewer Image (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                  {...restField} 
                  disabled={isLoading || !!form.watch('image_url_field')}
                  className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </FormControl>
              <FormDescription>Max 5MB. Accepted: .jpg, .png, .webp, .gif</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Status Field Removed
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Review")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
