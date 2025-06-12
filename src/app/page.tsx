
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays, MapPin, Users, Terminal, MessageSquareHeart, Quote, Send } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabaseClient';
import type { Article, Destination, Event, UserReview } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { isValidFeaturedImageUrl } from '@/lib/utils';
import { FeedbackForm } from '@/components/forms/FeedbackForm';
import { PublicReviewForm } from '@/components/forms/PublicReviewForm';
import TestimonialCard from '@/components/cards/TestimonialCard';
import ImageSlideshow from '@/components/ui/image-slideshow';

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

  // Fetch a few testimonials
  const featuredReviewsPromise = supabase
    .from('user_reviews')
    // .eq('status', 'published') // Temporarily removed, re-add when DB 'status' column is confirmed
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
  
  // Fetch all reviews for broader display
  const allPublishedReviewsPromise = supabase
    .from('user_reviews')
    // .eq('status', 'published') // Temporarily removed, re-add when DB 'status' column is confirmed
    .select('*')
    .order('created_at', { ascending: false });


  const [
    articleResult, 
    destinationResult, 
    eventResult, 
    featuredReviewsResult,
    allPublishedReviewsPromiseResult, 
  ] = await Promise.all([
    articlePromise,
    destinationPromise,
    eventPromise,
    featuredReviewsPromise,
    allPublishedReviewsPromise, 
  ]);

  return {
    featuredArticle: articleResult.data as Article | null,
    popularDestination: destinationResult.data as Destination | null,
    upcomingEvent: eventResult.data as Event | null,
    featuredTestimonials: featuredReviewsResult.data as UserReview[] | null,
    allPublishedReviews: allPublishedReviewsPromiseResult.data as UserReview[] | null, 
    error: articleResult.error || destinationResult.error || eventResult.error || featuredReviewsResult.error || allPublishedReviewsPromiseResult.error,
  };
}


export default async function HomePage() {
  const { 
    featuredArticle, 
    popularDestination, 
    upcomingEvent, 
    featuredTestimonials, 
    allPublishedReviews,
    error 
  } = await getHomepageData();

  if (error) {
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
    "Experience Tanzania and the soul of Africa — where every sunrise tells a new story and every sunset leaves you breathless.",
    "Welcome to Africa’s beating heart — from Tanzania’s mighty plains to the continent’s timeless rhythms.",
    "Explore Tanzania, embrace Africa — a continent rich in spirit, wild beauty, and unforgettable journeys.",
    "Africa calls, and Tanzania answers — with roaring wildlife, ancient cultures, and landscapes that touch the heavens.",
    "From the snow-capped peaks of Kilimanjaro to the warmth of African hospitality, Tanzania is where dreams begin.",
    "Roam the Serengeti, sail the Indian Ocean, and climb Africa’s tallest mountain — all in one Tanzanian adventure."
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-r from-primary/80 to-accent/80 flex flex-col items-center justify-center text-primary-foreground py-12 md:py-24">
          <ImageSlideshow 
            images={slideShowImages} 
            captions={slideShowCaptions}
            className="absolute inset-0 z-0"
            activeImageOpacity={0.3}
            captionClassName="z-10" 
          />
          <div className="container text-center z-10 mt-auto pb-8 md:pb-12"> {/* Adjusted for button positioning */}
            {/* Static Title and Subtitle are removed, captions are now in ImageSlideshow */}
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

        {/* Featured Article Section */}
        {featuredArticle && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Featured Story</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src={isValidFeaturedImageUrl(featuredArticle.featured_image) || '/images/placeholders/placeholder-600x400-article.png'}
                      alt={featuredArticle.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-64 md:h-full"
                      data-ai-hint="travel blog featured"
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

        {/* Popular Destination Section */}
        {popularDestination && (
          <section className="py-16 bg-secondary/30">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Popular Destination</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                 <div className="md:flex md:flex-row-reverse">
                  <div className="md:w-1/2">
                    <Image
                      src={isValidFeaturedImageUrl(popularDestination.featured_image) || '/images/placeholders/placeholder-600x400-destination.png'}
                      alt={popularDestination.name}
                      width={600}
                      height={400}
                      className="object-cover w-full h-64 md:h-full"
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
        
        {/* Upcoming Event Section */}
        {upcomingEvent && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Upcoming Event</h2>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                   <div className="md:w-1/2">
                    <Image
                      src={isValidFeaturedImageUrl(upcomingEvent.featured_image) || '/images/placeholders/placeholder-600x400-event.png'}
                      alt={upcomingEvent.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-64 md:h-full"
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

        {/* Testimonials Section (Featured) */}
        {featuredTestimonials && featuredTestimonials.length > 0 && (
          <section className="py-16 bg-secondary/50">
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
        
        {/* All Published Reviews Section */}
        {allPublishedReviews && allPublishedReviews.length > 0 && (
          <section id="community-reviews-section" className="py-16 bg-background">
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


        {/* ADVERTISEMENT SECTION */}
        <section className="py-8 bg-background">
          <div className="container">
            <AdSenseUnit
                adClient="ca-pub-5805028999017949"
                adSlot="8226629286"
              />
          </div>
        </section>

        {/* Travel Tips Teaser */}
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

        {/* Public Review Form Section */}
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

        {/* Feedback Section */}
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
    
