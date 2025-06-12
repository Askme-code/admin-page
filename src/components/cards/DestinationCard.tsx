
import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { isValidFeaturedImageUrl } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const validImageUrl = isValidFeaturedImageUrl(destination.featured_image);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {validImageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={validImageUrl}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="Tanzania destination"
          />
        </div>
      )}
      {!validImageUrl && destination.featured_image && (
         <div className="relative w-full h-48 bg-muted flex items-center justify-center">
           <p className="text-xs text-muted-foreground">Image not available</p>
         </div>
      )}
      {!validImageUrl && !destination.featured_image && (
         <div className="relative w-full h-48">
          <Image
            src="https://placehold.co/600x400.png"
            alt={destination.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="placeholder Tanzania destination"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/destinations/${destination.id}`} className="hover:text-primary transition-colors">
            {destination.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {destination.description && (
          <CardDescription className="text-sm mb-2 line-clamp-3">{destination.description}</CardDescription>
        )}
        {destination.location && (
          <div className="text-xs text-muted-foreground flex items-center mt-2">
            <MapPin className="mr-1.5 h-4 w-4" />
            <span>{destination.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0 text-sm">
          <Link href={`/destinations/${destination.id}`}>Explore <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
