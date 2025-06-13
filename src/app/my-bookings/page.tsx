
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { PublicUser, TourBooking } from '@/lib/types';
import { getCurrentUser } from '@/app/actions/userAuthActions';
import { getUserBookings } from '@/app/actions/bookingActions';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, MapPin, Ticket, Package, Edit3, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function BookingCard({ booking }: { booking: TourBooking }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {booking.tours?.image_url && (
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={booking.tours.image_url}
            alt={booking.tours.name || 'Tour image'}
            layout="fill"
            objectFit="cover"
            data-ai-hint="booked tour"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          {booking.tours?.name || `Booking ID: ${booking.id}`}
        </CardTitle>
        {booking.tours?.location && (
            <CardDescription className="flex items-center text-sm">
                <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" /> {booking.tours.location}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <Ticket className="mr-2 h-4 w-4 text-primary" />
          <span>Booking ID: {booking.id}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          <span>Tour Date: {format(new Date(booking.tour_date), 'PPP')}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 text-primary" />
          <span>Guests: {booking.number_of_people}</span>
        </div>
         <div className="flex items-center">
            <Package className="mr-2 h-4 w-4 text-primary" />
            Status: <Badge variant={
                booking.status === 'confirmed' ? 'default' :
                booking.status === 'pending' ? 'secondary' :
                booking.status === 'cancelled' ? 'destructive' : 'outline'
            } className="ml-1.5 capitalize">{booking.status}</Badge>
        </div>
        {booking.notes && (
            <p className="pt-1 text-xs text-muted-foreground italic">Notes: {booking.notes}</p>
        )}
      </CardContent>
       <CardFooter>
        {booking.status === 'pending' && (
            <Button variant="outline" size="sm" disabled>
                <Edit3 className="mr-2 h-4 w-4" /> Modify Booking (Soon)
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}


export default function MyBookingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login-user?next=/my-bookings');
        return;
      }
      setCurrentUser(user);
      const userBookings = await getUserBookings(user.id);
      setBookings(userBookings);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-12">
          <h1 className="font-headline text-3xl md:text-4xl font-semibold mb-8">My Bookings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                <Card key={i} className="shadow-lg">
                    <Skeleton className="h-48 w-full"/>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-2/3"/>
                    </CardContent>
                </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">
        <h1 className="font-headline text-3xl md:text-4xl font-semibold mb-10 text-center">My Tour Bookings</h1>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md shadow-sm bg-card">
            <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">No Bookings Found</p>
            <p className="text-muted-foreground mb-6">You haven&apos;t made any tour bookings yet.</p>
            <Button asChild>
              <Link href="/booking">Book a Tour</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
