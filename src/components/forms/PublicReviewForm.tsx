
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPABASE_BUCKET_NAME = 'contentimage'; // Ensure this matches your bucket

export const publicReviewFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  rating: z.coerce.number().min(1, "Rating is required.").max(5, { message: "Rating must be between 1 and 5." }),
  review: z.string().min(10, { message: "Review must be at least 10 characters." }).max(2000),
  location: z.string().max(100).optional(),
  image_file_field: z.custom<File>(val => val instanceof File, "Please select a file.")
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), '.jpg, .jpeg, .png, .webp, .gif files are accepted.'),
});

type PublicReviewFormValues = z.infer<typeof publicReviewFormSchema>;

export function PublicReviewForm() {
  const { toast } = useToast();
  const form = useForm<PublicReviewFormValues>({
    resolver: zodResolver(publicReviewFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      rating: undefined, // Ensure it's undefined initially for the placeholder
      review: "",
      location: "",
      image_file_field: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: PublicReviewFormValues) => {
    let finalImageUrl: string | undefined = undefined;

    if (values.image_file_field) {
      const file = values.image_file_field;
      const filePath = `reviews/${Date.now()}-${file.name.replace(/\s+/g, '_')}`; // Sanitize filename
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

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
    }

    try {
      const { error } = await supabase.from("user_reviews").insert([
        {
          full_name: values.full_name,
          email: values.email,
          rating: values.rating,
          review: values.review,
          location: values.location || null,
          image_url: finalImageUrl || null,
          status: 'pending', // Default status for public submissions
        },
      ]);

      if (error) {
        toast({
          title: "Error submitting review",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Review Submitted!",
          description: "Thank you for your review. It will be reviewed by our team shortly.",
        });
        form.reset();
      }
    } catch (e) {
      toast({
        title: "An unexpected error occurred",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} disabled={isLoading} />
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
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Your email will not be published.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value ? String(field.value) : ""} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating (1-5 Stars)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">★★★★★ (Excellent)</SelectItem>
                  <SelectItem value="4">★★★★☆ (Great)</SelectItem>
                  <SelectItem value="3">★★★☆☆ (Good)</SelectItem>
                  <SelectItem value="2">★★☆☆☆ (Fair)</SelectItem>
                  <SelectItem value="1">★☆☆☆☆ (Poor)</SelectItem>
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
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  rows={5}
                  {...field}
                  disabled={isLoading}
                />
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
              <FormLabel>Your Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City, Country" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_file_field"
          render={({ field: { onChange, value, ...restField }}) => (
            <FormItem>
              <FormLabel>Upload a Photo (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                  {...restField} 
                  disabled={isLoading}
                  className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </FormControl>
              <FormDescription>Share a picture from your trip (Max 5MB).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
}
