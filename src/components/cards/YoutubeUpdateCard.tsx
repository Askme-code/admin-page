
"use client";

import type { YoutubeUpdate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, CalendarDays, YoutubeIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface YoutubeUpdateCardProps {
  update: YoutubeUpdate;
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function YoutubeUpdateCard({ update }: YoutubeUpdateCardProps) {
  const videoId = getYouTubeVideoId(update.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/images/placeholders/placeholder-600x400-video.png'; // Fallback placeholder

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card/90 backdrop-blur-sm">
      <a href={update.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative w-full aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={update.caption || 'YouTube Video Thumbnail'}
            className="absolute inset-0 w-full h-full object-cover"
            data-ai-hint="youtube video thumbnail"
            onError={(e) => {
              // Fallback if YouTube thumbnail fails to load
              (e.target as HTMLImageElement).src = '/images/placeholders/placeholder-600x400-video.png';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <YoutubeIcon className="h-16 w-16 text-white/80" />
          </div>
        </div>
      </a>
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-lg leading-tight">
           <a href={update.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors line-clamp-2">
            {update.caption || "YouTube Update"}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-sm space-y-2">
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="mr-1.5 h-4 w-4" />
          <span>Posted on {format(new Date(update.post_date), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <span className="flex items-center text-green-600">
            <ThumbsUp className="mr-1 h-4 w-4" /> {update.likes}
          </span>
          <span className="flex items-center text-red-600">
            <ThumbsDown className="mr-1 h-4 w-4" /> {update.dislikes}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0 text-sm">
          <a href={update.url} target="_blank" rel="noopener noreferrer">
            Watch on YouTube <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
