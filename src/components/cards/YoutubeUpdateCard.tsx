
"use client";

import type { YoutubeUpdate } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, CalendarDays, YoutubeIcon, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';
import { applyYoutubeInteractionDelta } from '@/app/actions/youtubeActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface YoutubeUpdateCardProps {
  update: YoutubeUpdate;
}

type UserInteraction = 'liked' | 'disliked' | 'none';

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function YoutubeUpdateCard({ update }: YoutubeUpdateCardProps) {
  const videoId = getYouTubeVideoId(update.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/images/placeholders/placeholder-600x400-video.png';

  const { toast } = useToast();
  const [localLikes, setLocalLikes] = useState(update.likes);
  const [localDislikes, setLocalDislikes] = useState(update.dislikes);
  const [userInteraction, setUserInteraction] = useState<UserInteraction>('none');
  const [isInteracting, setIsInteracting] = useState(false);

  const getLocalStorageKey = useCallback(() => `youtube-interaction-${update.id}`, [update.id]);

  useEffect(() => {
    setLocalLikes(update.likes);
    setLocalDislikes(update.dislikes);
    const storedInteraction = localStorage.getItem(getLocalStorageKey()) as UserInteraction | null;
    
    if (storedInteraction && ['liked', 'disliked', 'none'].includes(storedInteraction)) {
      setUserInteraction(storedInteraction);
    } else {
      setUserInteraction('none');
      // Initialize localStorage if the value is invalid or not set
      if (typeof window !== 'undefined') {
        localStorage.setItem(getLocalStorageKey(), 'none');
      }
    }
  }, [update.id, update.likes, update.dislikes, getLocalStorageKey]);

  const handleInteraction = async (interactionType: 'like' | 'dislike') => {
    if (isInteracting) return;
    setIsInteracting(true);

    const previousInteraction = userInteraction;
    let newInteractionState: UserInteraction;
    let deltaLikes = 0;
    let deltaDislikes = 0;

    if (interactionType === 'like') {
      if (previousInteraction === 'liked') { // Unliking
        newInteractionState = 'none';
        deltaLikes = -1;
      } else { // Liking (either from 'none' or 'disliked')
        newInteractionState = 'liked';
        deltaLikes = 1;
        if (previousInteraction === 'disliked') {
          deltaDislikes = -1;
        }
      }
    } else { // Disliking
      if (previousInteraction === 'disliked') { // Undisliking
        newInteractionState = 'none';
        deltaDislikes = -1;
      } else { // Disliking (either from 'none' or 'liked')
        newInteractionState = 'disliked';
        deltaDislikes = 1;
        if (previousInteraction === 'liked') {
          deltaLikes = -1;
        }
      }
    }

    // Optimistic UI update
    setLocalLikes(prev => Math.max(0, prev + deltaLikes));
    setLocalDislikes(prev => Math.max(0, prev + deltaDislikes));
    setUserInteraction(newInteractionState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey(), newInteractionState);
    }

    const result = await applyYoutubeInteractionDelta({
      updateId: update.id, // update.id is already string type as per YoutubeUpdate interface
      deltaLikes,
      deltaDislikes,
    });

    if (!result.success) {
      toast({
        title: "Error",
        description: result.message || "Could not update interaction.",
        variant: "destructive",
      });
      // Revert optimistic update on error
      setLocalLikes(prev => Math.max(0, prev - deltaLikes));
      setLocalDislikes(prev => Math.max(0, prev - deltaDislikes));
      setUserInteraction(previousInteraction);
      if (typeof window !== 'undefined') {
        localStorage.setItem(getLocalStorageKey(), previousInteraction);
      }
    } else {
      // Optionally, update with server's final counts if they differ, though revalidation should handle it
      if (result.finalLikes !== undefined) setLocalLikes(result.finalLikes);
      if (result.finalDislikes !== undefined) setLocalDislikes(result.finalDislikes);
    }
    setIsInteracting(false);
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInteraction('like')}
            disabled={isInteracting}
            className={cn(
              "flex items-center px-2 py-1 h-auto",
              userInteraction === 'liked' ? 'text-green-600' : 'text-muted-foreground hover:text-green-500'
            )}
            aria-label="Like this video"
          >
            {isInteracting && userInteraction === 'liked' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ThumbsUp className={cn("mr-1 h-4 w-4", userInteraction === 'liked' && 'fill-current')} />}
            {localLikes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleInteraction('dislike')}
            disabled={isInteracting}
            className={cn(
              "flex items-center px-2 py-1 h-auto",
              userInteraction === 'disliked' ? 'text-red-600' : 'text-muted-foreground hover:text-red-500'
            )}
            aria-label="Dislike this video"
          >
             {isInteracting && userInteraction === 'disliked' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ThumbsDown className={cn("mr-1 h-4 w-4", userInteraction === 'disliked' && 'fill-current')} />}
            {localDislikes}
          </Button>
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

