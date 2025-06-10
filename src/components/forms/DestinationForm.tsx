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

const destinationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." }),
  description: z.string().min(10, { message: "Description is too short." }),
  featured_image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  location: z.string().optional(),
  highlights: z.array(z.string()).optional(), // Represent as comma-separated string in form, then parse
  status: z.enum(["draft", "published"]),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

interface DestinationFormProps {
  initialData?: Destination | null;
  onSubmit: (values: DestinationFormValues) => Promise<void>;
}

export function DestinationForm({ initialData, onSubmit }: DestinationFormProps) {
  const router = useRouter();
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: initialData ? {
      ...initialData,
      featured_image: initialData.featured_image || '',
      highlights: initialData.highlights || [], // Keep as array
    } : {
      name: "",
      slug: "",
      description: "",
      featured_image: "",
      location: "",
      highlights: [],
      status: "draft",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: DestinationFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="destination-slug" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>URL-friendly version of the name.</FormDescription>
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
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.png" {...field} disabled={isLoading} />
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Northern Tanzania" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlights" // This will be a comma-separated string input
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highlights (comma-separated)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Highlight 1, Highlight 2, Highlight 3" 
                  // Adapt field for array to string and string to array
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
            {initialData ? "Save Changes" : "Create Destination"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
