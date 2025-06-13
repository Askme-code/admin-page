
'use server';

import { supabase } from '@/lib/supabaseClient';
import type { TourBookingSubmitData } from '@/components/forms/BookingForm';
import { revalidatePath } from 'next/cache';
import type { Tour } from '@/lib/types';

export async function createTourBooking(values: TourBookingSubmitData, userId: string) {
  if (!userId) {
    return { success: false, error: "User not authenticated." };
  }

  // Fetch tour price to calculate total_price
  const { data: tourData, error: tourError } = await supabase
    .from('tours')
    .select('price')
    .eq('id', values.tour_id)
    .single();

  if (tourError || !tourData) {
    console.error("Error fetching tour details for booking:", tourError);
    return { success: false, error: tourError?.message || "Could not find selected tour." };
  }

  const tourPrice = tourData.price || 0;
  const totalPrice = tourPrice * (values.number_of_people || 1);

  const bookingData = {
    ...values,
    user_id: userId,
    booking_date: new Date().toISOString().split('T')[0], // Ensure YYYY-MM-DD
    tour_date: new Date(values.tour_date).toISOString().split('T')[0], // Ensure YYYY-MM-DD
    total_price: totalPrice,
    status: 'pending', // Default status
  };

  const { data, error } = await supabase
    .from('tour_bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error("Error creating tour booking:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/booking');
  revalidatePath('/my-bookings'); // Assuming a future page for users to see their bookings

  return { success: true, data };
}

export async function getAvailableTours(): Promise<Tour[]> {
    const { data, error } = await supabase
        .from('tours')
        .select('id, name, price, location')
        .eq('status', 'available')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching available tours:", error);
        return [];
    }
    return data || [];
}

export async function getUserBookings(userId: string) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('tour_bookings')
    .select(`
      *,
      tours (name, location, image_url)
    `)
    .eq('user_id', userId)
    .order('tour_date', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  return data || [];
}

