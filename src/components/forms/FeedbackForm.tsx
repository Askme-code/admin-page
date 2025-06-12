
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export const feedbackFormSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  interest_area: z.string().max(100).optional(),
  referral_source: z.string().max(100).optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(2000),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      interest_area: "",
      referral_source: "",
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      const { error } = await supabase.from("user_feedback").insert([
        {
          full_name: values.full_name,
          email: values.email,
          interest_area: values.interest_area || null,
          referral_source: values.referral_source || null,
          message: values.message,
        },
      ]);

      if (error) {
        toast({
          title: "Error submitting feedback",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your message. We'll get back to you if needed.",
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
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interest_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area of Interest (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Safaris, Cultural Tours, Zanzibar" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>What are you most interested in?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referral_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about us? (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Google, Friend, Social Media" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your questions, comments, or feedback..."
                  rows={5}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Send Feedback"}
        </Button>
      </form>
    </Form>
  );
}
