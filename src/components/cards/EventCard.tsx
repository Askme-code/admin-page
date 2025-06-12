
import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { isValidFeaturedImageUrl } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const validImageUrl = isValidFeaturedImageUrl(event.featured_image);
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {validImageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={validImageUrl}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="Tanzania event"
          />
        </div>
      )}
       {!validImageUrl && event.featured_image && (
         <div className="relative w-full h-48 bg-muted flex items-center justify-center">
           <p className="text-xs text-muted-foreground">Image not available</p>
         </div>
      )}
      {!validImageUrl && !event.featured_image && (
        <div className="relative w-full h-48">
          <Image
            src="https://placehold.co/600x400.png"
            alt={event.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="placeholder Tanzania event"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/events/${event.id}`} className="hover:text-primary transition-colors">
            {event.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {event.description && (
          <CardDescription className="text-sm mb-2 line-clamp-3">{event.description}</CardDescription>
        )}
        <div className="text-xs text-muted-foreground space-y-1 mt-2">
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <span>{new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1.5 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0 text-sm">
          <Link href={`/events/${event.id}`}>View Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
