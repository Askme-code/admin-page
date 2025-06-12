
"use client";

import Image from 'next/image';
import type { UserReview } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  review: UserReview;
}

export default function TestimonialCard({ review }: TestimonialCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/50">
            {review.image_url ? (
              <AvatarImage src={review.image_url} alt={review.full_name} />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold font-headline text-lg">{review.full_name}</p>
            {review.location && <p className="text-xs text-muted-foreground">{review.location}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex mb-3">{renderStars()}</div>
        <blockquote className="text-sm text-foreground/80 italic border-l-4 border-accent pl-4 py-2 flex-grow">
          "{review.review}"
        </blockquote>
      </CardContent>
    </Card>
  );
}
