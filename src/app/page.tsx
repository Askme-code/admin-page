import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dummy data - replace with actual data fetching
const featuredArticle = {
  title: 'A Week in Zanzibar: Sun, Sand, and Spices',
  slug: 'a-week-in-zanzibar',
  excerpt: 'Discover the magic of Zanzibar, from its pristine beaches to its historic Stone Town and aromatic spice farms.',
  imageUrl: 'https://placehold.co/600x400.png',
  aiHint: 'Zanzibar beach',
};

const popularDestination = {
  name: 'Serengeti National Park',
  slug: 'serengeti-national-park',
  description: 'Witness the Great Migration and spot the Big Five in Africa\'s most famous safari destination.',
  imageUrl: 'https://placehold.co/600x400.png',
  aiHint: 'Serengeti wildlife',
};

const upcomingEvent = {
  title: 'Sauti za Busara Music Festival',
  slug: 'sauti-za-busara',
  date: 'February 14-16, 2025',
  location: 'Stone Town, Zanzibar',
  imageUrl: 'https://placehold.co/600x400.png',
  aiHint: 'music festival',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center text-primary-foreground py-12 md:py-24">
          <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Tanzania Landscape" 
            layout="fill" 
            objectFit="cover" 
            className="absolute inset-0 z-0 opacity-30"
            data-ai-hint="Tanzania landscape"
          />
          <div className="container text-center z-10">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome to Tanzania!</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Your ultimate guide to exploring the breathtaking landscapes, vibrant cultures, and unforgettable adventures in Tanzania.
            </p>
            <Button size="lg" asChild className="animate-fade-in-up animation-delay-300">
              <Link href="/destinations">Explore Destinations <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

        {/* Featured Article Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Featured Story</h2>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64 md:h-full"
                    data-ai-hint={featuredArticle.aiHint}
                  />
                </div>
                <div className="md:w-1/2">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{featuredArticle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{featuredArticle.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                      <Link href={`/articles/${featuredArticle.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Popular Destination Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Popular Destination</h2>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
               <div className="md:flex md:flex-row-reverse">
                <div className="md:w-1/2">
                  <Image
                    src={popularDestination.imageUrl}
                    alt={popularDestination.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64 md:h-full"
                    data-ai-hint={popularDestination.aiHint}
                  />
                </div>
                <div className="md:w-1/2">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{popularDestination.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{popularDestination.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                     <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                      <Link href={`/destinations/${popularDestination.slug}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Upcoming Event Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Upcoming Event</h2>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                 <div className="md:w-1/2">
                  <Image
                    src={upcomingEvent.imageUrl}
                    alt={upcomingEvent.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64 md:h-full"
                    data-ai-hint={upcomingEvent.aiHint}
                  />
                </div>
                <div className="md:w-1/2">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{upcomingEvent.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      <span>{upcomingEvent.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-5 w-5" />
                      <span>{upcomingEvent.location}</span>
                    </div>
                  </CardContent>
                   <CardFooter>
                     <Button asChild variant="link" className="text-primary hover:text-primary/80 px-0">
                      <Link href={`/events/${upcomingEvent.slug}`}>Event Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
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
      </main>
      <Footer />
    </div>
  );
}
