
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { YoutubeUpdate } from "@/lib/types";
import { useRouter } from "next/navigation";

// Zod schema for form validation
export const youtubeUpdateFormSchema = z.object({
  caption: z.string().min(3, { message: "Caption must be at least 3 characters." }).max(500, { message: "Caption must be 500 characters or less." }),
  post_date: z.date({ required_error: "Post date is required." }),
  url: z.string()
    .url({ message: "Please enter a valid URL." })
    .regex(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(\S*)?$/, {
      message: "URL must be a valid YouTube video link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)."
    }),
  likes: z.coerce.number().int().min(0, "Likes cannot be negative.").default(0),
  dislikes: z.coerce.number().int().min(0, "Dislikes cannot be negative.").default(0),
});

// Type for form values used by react-hook-form
type YoutubeUpdateFormValues = z.infer<typeof youtubeUpdateFormSchema>;

// Type for the data structure when submitting (excluding ID and created_at)
export type YoutubeUpdateSubmitData = Omit<YoutubeUpdate, 'id' | 'created_at'>;

interface YoutubeUpdateFormProps {
  initialData?: YoutubeUpdate | null;
  onSubmit: (values: YoutubeUpdateSubmitData) => Promise<void>;
  isSubmitting?: boolean;
}

export function YoutubeUpdateForm({ initialData, onSubmit, isSubmitting = false }: YoutubeUpdateFormProps) {
  const router = useRouter();
  const form = useForm<YoutubeUpdateFormValues>({
    resolver: zodResolver(youtubeUpdateFormSchema),
    defaultValues: {
      caption: initialData?.caption || "",
      post_date: initialData?.post_date ? new Date(initialData.post_date) : new Date(),
      url: initialData?.url || "",
      likes: initialData?.likes || 0,
      dislikes: initialData?.dislikes || 0,
    },
  });

  const handleFormSubmit = async (formValues: YoutubeUpdateFormValues) => {
    const dataToSubmit: YoutubeUpdateSubmitData = {
      ...formValues,
      post_date: format(formValues.post_date, "yyyy-MM-dd"), // Format date for Supabase
    };
    await onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter video caption" {...field} rows={3} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="post_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Post Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01") || isSubmitting}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>Must be a valid YouTube video link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="likes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Likes</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="0" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dislikes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Dislikes</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="0" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? "Saving..." : "Posting...") : (initialData ? "Save Changes" : "Post Update")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
