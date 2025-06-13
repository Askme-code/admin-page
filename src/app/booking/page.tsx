
"use client"; // Must be a client component to use hooks and check session

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BookingForm } from "@/components/forms/BookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MountainSnow, Ticket } from "lucide-react";
import type { PublicUser, Tour } from '@/lib/types';
import { getCurrentUser } from '@/app/actions/userAuthActions';
import { getAvailableTours } from '@/app/actions/bookingActions';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function BookingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [availableTours, setAvailableTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login-user?next=/booking'); // Redirect if not logged in
        return;
      }
      setCurrentUser(user);
      const tours = await getAvailableTours();
      setAvailableTours(tours);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <Ticket className="mx-auto h-12 w-12 text-primary mb-2" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center justify-center">
            <MountainSnow className="h-10 w-10 text-primary" />
          </Link>
          <CardTitle className="text-3xl font-headline flex items-center justify-center">
            <Ticket className="mr-3 h-8 w-8 text-primary" />
            Book Your Adventure
          </CardTitle>
          <CardDescription>Fill in the details below to reserve your spot on one of our amazing tours.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <BookingForm currentUser={currentUser} availableTours={availableTours} />
          ) : (
             <p className="text-center text-muted-foreground">Loading user information...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
