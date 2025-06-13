
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { PublicUser, Tour } from "@/lib/types";
import { createTourBooking } from "@/app/actions/bookingActions";
import { useRouter } from "next/navigation";

export const bookingFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  phone: z.string().min(10, "Phone number seems too short.").optional().or(z.literal('')),
  tour_id: z.string().uuid({ message: "Please select a tour." }),
  tour_date: z.date({ required_error: "Please select a tour date." }),
  number_of_people: z.coerce.number().min(1, { message: "At least one person required." }).max(50, {message: "Maximum 50 people per booking."}),
  notes: z.string().max(1000, "Notes are too long.").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// This is the data structure passed to the server action, excluding user_id which is added server-side
export type TourBookingSubmitData = Omit<BookingFormValues, 'fullName' | 'email' | 'phone'> & {
  full_name: string;
  email: string;
  phone?: string;
  tour_id: string; // Ensure this is included
};

interface BookingFormProps {
  currentUser: PublicUser | null;
  availableTours: Tour[];
}

export function BookingForm({ currentUser, availableTours }: BookingFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: currentUser?.full_name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      tour_id: "",
      tour_date: undefined,
      number_of_people: 1,
      notes: "",
    },
    // Re-initialize if currentUser changes (e.g., after login on the same page)
    values: currentUser ? {
        fullName: currentUser.full_name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        tour_id: "", // Keep tour_id and date fresh
        tour_date: undefined,
        number_of_people: 1,
        notes: "",
    } : undefined,
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: BookingFormValues) => {
    if (!currentUser?.id) {
        toast({ title: "Authentication Error", description: "You must be logged in to make a booking.", variant: "destructive"});
        router.push(`/login-user?next=/booking`); // Redirect to login
        return;
    }

    const submitData: TourBookingSubmitData = {
        full_name: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        tour_id: values.tour_id,
        tour_date: values.tour_date, // Date object is fine here, server action will format
        number_of_people: values.number_of_people,
        notes: values.notes || undefined,
    };

    const result = await createTourBooking(submitData, currentUser.id);

    if (result.success) {
      toast({
        title: "Booking Submitted!",
        description: "Your tour booking request has been received. We will confirm shortly.",
      });
      form.reset({ // Reset with user details but clear tour specific fields
        fullName: currentUser.full_name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        tour_id: "",
        tour_date: undefined,
        number_of_people: 1,
        notes: "",
      });
      // Optionally redirect to a "my bookings" page
      router.push("/my-bookings");
    } else {
      toast({
        title: "Booking Failed",
        description: result.error || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Full Name" {...field} disabled={isLoading || !!currentUser?.full_name} />
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
                  <Input type="email" placeholder="your.email@example.com" {...field} disabled={isLoading || !!currentUser?.email} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your Phone Number" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tour_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Tour</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || availableTours.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tour package" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTours.length > 0 ? availableTours.map(tour => (
                    <SelectItem key={tour.id} value={tour.id}>
                      {tour.name} {tour.location ? `(${tour.location})` : ''} {tour.price ? `- $${tour.price}` : ''}
                    </SelectItem>
                  )) : <SelectItem value="no-tours" disabled>No tours available currently</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="tour_date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Preferred Tour Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || isLoading} // Disable past dates
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
            name="number_of_people"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Number of People</FormLabel>
                <FormControl>
                    <Input type="number" min="1" max="50" placeholder="1" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or information..."
                  rows={4}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading || !currentUser}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting Booking..." : "Request Booking"}
        </Button>
        {!currentUser && (
            <p className="text-sm text-destructive">Please <Link href="/login-user?next=/booking" className="underline">log in</Link> to make a booking.</p>
        )}
      </form>
    </Form>
  );
}
