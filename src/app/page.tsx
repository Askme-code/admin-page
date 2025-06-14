
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays, MapPin, Users, Terminal, MessageSquareHeart, Quote, Send, Youtube } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import type { Article, Destination, Event, UserReview, YoutubeUpdate } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { isValidFeaturedImageUrl } from '@/lib/utils';
import { FeedbackForm } from '@/components/forms/FeedbackForm';
import { PublicReviewForm } from '@/components/forms/PublicReviewForm';
import TestimonialCard from '@/components/cards/TestimonialCard';
import ImageSlideshow from '@/components/ui/image-slideshow';
import YoutubeUpdateCard from '@/components/cards/YoutubeUpdateCard';


export const dynamic = 'force-dynamic';

async function getHomepageData() {
  const articlePromise = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const destinationPromise = supabase
    .from('destinations')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const eventPromise = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: true })
    .limit(1)
    .maybeSingle();

  const featuredReviewsPromise = supabase
    .from('user_reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  const allPublishedReviewsPromise = supabase
    .from('user_reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const youtubeUpdatesPromise = supabase
    .from('youtube_updates')
    .select('*')
    .order('post_date', { ascending: false })
    .limit(3);


  const [
    articleResult,
    destinationResult,
    eventResult,
    featuredReviewsResult,
    allPublishedReviewsResult,
    youtubeUpdatesResult,
  ] = await Promise.all([
    articlePromise,
    destinationPromise,
    eventPromise,
    featuredReviewsPromise,
    allPublishedReviewsPromise,
    youtubeUpdatesPromise,
  ]);

  return {
    featuredArticle: articleResult.data as Article | null,
    popularDestination: destinationResult.data as Destination | null,
    upcomingEvent: eventResult.data as Event | null,
    featuredTestimonials: featuredReviewsResult.data as UserReview[] | null,
    allPublishedReviews: allPublishedReviewsResult.data as UserReview[] | null,
    latestYoutubeUpdates: youtubeUpdatesResult.data as YoutubeUpdate[] | null,
    error: articleResult.error || destinationResult.error || eventResult.error || featuredReviewsResult.error || allPublishedReviewsResult.error || youtubeUpdatesResult.error,
  };
}


export default async function HomePage() {
  const {
    featuredArticle,
    popularDestination,
    upcomingEvent,
    featuredTestimonials,
    allPublishedReviews,
    latestYoutubeUpdates,
    error
  } = await getHomepageData();

  if (error && process.env.NODE_ENV === 'development') {
    console.error("[ Server ] Error fetching data for homepage:", error);
  }


  const slideShowImages = [
    '/images/bg1.jpg',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg',
    '/images/bg5.jpg',
    '/images/bg6.jpg',
  ];

  const slideShowCaptions = [
    { heading: "Discover Tanzania's Soul", subheading: "Where every sunrise tells a new story and every sunset leaves you breathless." },
    { heading: "Africa's Beating Heart", subheading: "From Tanzania’s mighty plains to the continent’s timeless rhythms." },
    { heading: "Embrace Wild Beauty", subheading: "Explore a continent rich in spirit, wild beauty, and unforgettable journeys." },
    { heading: "The Call of Africa", subheading: "Tanzania answers with roaring wildlife, ancient cultures, and landscapes that touch the heavens." },
    { heading: "Where Dreams Begin", subheading: "From Kilimanjaro's peaks to the warmth of African hospitality." },
    { heading: "Your Grand Adventure", subheading: "Roam the Serengeti, sail the Indian Ocean, and climb Africa’s tallest mountain." }
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-r from-primary/80 to-accent/80 flex flex-col items-center justify-end text-primary-foreground py-12 md:py-24">
          <ImageSlideshow
            images={slideShowImages}
            captions={slideShowCaptions}
            className="absolute inset-0 z-0"
            activeImageOpacity={0.3}
            captionClassName="z-10"
          />
          <div className="container text-center z-10 pb-8 md:pb-12">
            <Button size="lg" asChild className="animate-fade-in-up animation-delay-300">
              <Link href="/destinations">Explore Destinations <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {error && (
          <section className="py-8 bg-background">
            <div className="container">
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Loading Page Content</AlertTitle>
                <AlertDescription>
                  Some content could not be loaded. Please try refreshing the page.
                  {process.env.NODE_ENV === 'development' && <p className="mt-2 text-xs">Details: {error.message}</p>}
                </AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        {featuredArticle && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Featured Story</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto md:aspect-[3/2]">
                    <Image
                      src={isValidFeaturedImageUrl(featuredArticle.featured_image) || '/images/placeholders/placeholder-600x400-article.png'}
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      data-ai-hint="travel blog featured"
                      priority
                    />
                  </div>
                  <div className="md:w-1/2">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{featuredArticle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base line-clamp-3">{featuredArticle.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                        <Link href={`/articles/${featuredArticle.id}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {popularDestination && (
          <section className="py-16 bg-secondary/30">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Popular Destination</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <div className="md:flex md:flex-row-reverse">
                  <div className="md:w-1/2 relative h-64 md:h-auto md:aspect-[3/2]">
                    <Image
                      src={isValidFeaturedImageUrl(popularDestination.featured_image) || '/images/placeholders/placeholder-600x400-destination.png'}
                      alt={popularDestination.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      data-ai-hint="popular destination"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{popularDestination.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base line-clamp-3">{popularDestination.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                       <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                        <Link href={`/destinations/${popularDestination.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {upcomingEvent && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Upcoming Event</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                   <div className="md:w-1/2 relative h-64 md:h-auto md:aspect-[3/2]">
                    <Image
                      src={isValidFeaturedImageUrl(upcomingEvent.featured_image) || '/images/placeholders/placeholder-600x400-event.png'}
                      alt={upcomingEvent.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      data-ai-hint="upcoming event"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{upcomingEvent.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        <span>{new Date(upcomingEvent.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-5 w-5" />
                        <span>{upcomingEvent.location}</span>
                      </div>
                    </CardContent>
                     <CardFooter>
                       <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                        <Link href={`/events/${upcomingEvent.id}`}>Event Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Latest YouTube Updates Section */}
        {latestYoutubeUpdates && latestYoutubeUpdates.length > 0 && (
          <section id="youtube-updates-section" className="py-16 bg-secondary/50">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 flex items-center justify-center">
                <Youtube className="mr-3 h-8 w-8 text-red-600" />
                Latest YouTube Updates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestYoutubeUpdates.map((update) => (
                  <YoutubeUpdateCard key={update.id} update={update} />
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredTestimonials && featuredTestimonials.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 flex items-center justify-center">
                <Quote className="mr-3 h-8 w-8 text-accent transform scale-x-[-1]" />
                What Our Travelers Say
                <Quote className="ml-3 h-8 w-8 text-accent" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredTestimonials.map((review) => (
                  <TestimonialCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </section>
        )}

        {allPublishedReviews && allPublishedReviews.length > 0 && (
          <section id="community-reviews-section" className="py-16 bg-secondary/30">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Community Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPublishedReviews.map((review) => (
                  <TestimonialCard key={review.id} review={review} />
                ))}
              </div>
              {allPublishedReviews.length === 0 && (
                 <p className="text-center text-muted-foreground">No community reviews yet. Be the first to share your experience!</p>
              )}
            </div>
          </section>
        )}

        <section className="py-8 bg-background">
          <div className="container">
            <AdSenseUnit
                adClient="ca-pub-5805028999017949"
                adSlot="8226629286"
              />
          </div>
        </section>

        <section className="py-16 bg-primary/10">
          <div className="container text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-6">Essential Travel Tips</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Prepare for your Tanzanian adventure with our expert advice on everything from packing to cultural etiquette.
            </p>
            <Button size="lg" asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/travel-tips">Get Tips <Users className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        <section id="submit-review-section" className="py-16 bg-secondary/30">
          <div className="container max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 flex items-center justify-center">
              <Send className="mr-3 h-8 w-8 text-accent" />
              Share Your Experience
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Loved your trip to Tanzania? Help other travelers by sharing your review!
            </p>
            <Card className="shadow-lg p-6 md:p-8">
              <PublicReviewForm />
            </Card>
          </div>
        </section>

        <section id="feedback-section" className="py-16 bg-background">
          <div className="container max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12 flex items-center justify-center">
              <MessageSquareHeart className="mr-3 h-8 w-8 text-accent" />
              Leave Your Feedback
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              We'd love to hear from you! Whether you have questions, suggestions, or just want to share your experience, please fill out the form below.
            </p>
            <Card className="shadow-lg p-6 md:p-8">
              <FeedbackForm />
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
