import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {destination.featured_image && (
        <div className="relative w-full h-48">
          <Image
            src={destination.featured_image}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="Tanzania destination"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/destinations/${destination.slug}`} className="hover:text-primary transition-colors">
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
          <Link href={`/destinations/${destination.slug}`}>Explore <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
