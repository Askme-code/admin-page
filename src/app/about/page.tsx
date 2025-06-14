
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, Facebook, Instagram, Users, Globe, Award, Sparkles, HeartHandshake, UsersRound, TrendingUp, Target, CheckCircle, ShieldCheck, Search, Ticket, ListChecks, UserPlus, Mountain } from 'lucide-react';
import ImageSlideshow from '@/components/ui/image-slideshow';

export default function AboutPage() {
  const slideShowImages = [
    '/images/bg1.jpg',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg',
    '/images/bg5.jpg',
    '/images/bg6.jpg',
  ];

  const slideShowCaptions = [
    { heading: "Our Journey, Your Adventure", subheading: "Discover the story behind Tanzania Tourist Trails and our commitment to authentic experiences." },
    { heading: "Passion for Tanzania", subheading: "We're dedicated to sharing the unparalleled wonders of our homeland with the world." },
    { heading: "Meet the Visionary", subheading: "Connecting you to unforgettable Tanzanian explorations, led by local expertise." },
    { heading: "More Than Just Tours", subheading: "Building bridges, supporting local communities, and fostering sustainable tourism." },
    { heading: "Your Trusted Partner in Travel", subheading: "Crafting authentic and memorable Tanzanian adventures tailored for you." },
    { heading: "The Heart of Africa Awaits", subheading: "Let us guide your discovery of Tanzania's rich culture, wildlife, and landscapes." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/70 to-accent/70 text-primary-foreground">
          <ImageSlideshow
            images={slideShowImages}
            // Captions for the slideshow background itself are optional here, 
            // as the main hero text is separate. We can omit them or use very subtle ones.
            // For now, let's omit them to let the main h1/p shine.
            // captions={slideShowCaptions} 
            className="absolute inset-0 z-0"
            activeImageOpacity={0.3}
          />
          <div className="container relative z-10 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4">About Tanzania Tourist Trails</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Connecting you to the heart of Africa's wonders, affordably and reliably.
            </p>
          </div>
        </section>

        {/* Who We Are / Mission */}
        <section id="who-we-are" className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <Target className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Our Mission</h2>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
                To be your trusted bridge to the breathtaking and affordable tour and safari destinations across Tanzania, including Zanzibar, Serengeti, and Kilimanjaro. We also aim to empower local tour operators by offering them promotional services at competitive advertising rates.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Founder */}
        <section id="founder" className="py-12 md:py-16 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
                <UsersRound className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="font-headline text-3xl md:text-4xl font-semibold">Meet Our Founder</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
              <div className="md:w-1/3 flex-shrink-0">
                <Image
                  src="https://placehold.co/400x400.png"
                  alt="Millangali Kimu - Founder"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-xl object-cover mx-auto"
                  data-ai-hint="professional portrait"
                />
              </div>
              <div className="md:w-2/3 text-center md:text-left">
                <h3 className="font-headline text-2xl font-semibold text-primary">Millangali Kimu (Mila Kimu)</h3>
                <p className="text-muted-foreground mt-1 mb-3">Developer, Photographer, Designer, Freelancer, Networking & Electronics Dealer</p>
                <p className="text-lg">
                  Mila is the visionary owner and founder of Tanzania Tourist Trails. With a diverse skill set and a deep passion for Tanzania's natural beauty and cultural heritage, Mila created this platform to share the wonders of his homeland with the world and to support local businesses in the tourism sector.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section id="what-we-offer" className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
                <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="font-headline text-3xl md:text-4xl font-semibold">What Our Platform Offers</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Ticket, title: "Tour Booking System", description: "Seamlessly book your dream tours and safaris." },
                { icon: Globe, title: "Destination Exploration", description: "Discover detailed information about Tanzania's top attractions." },
                { icon: Award, title: "Travel Tips & Articles", description: "Get expert advice and inspiring stories to plan your trip." },
                { icon: UserPlus, title: "User Registration & Login", description: "Create an account to manage your bookings and preferences." },
                { icon: ListChecks, title: "My Bookings Page", description: "Logged-in users can easily access and manage their tour reservations." },
                { icon: Mountain, title: "Promotion for Operators", description: "Affordable advertising spaces for local tour operators to reach a wider audience." },
              ].map(item => (
                <Card key={item.title} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="items-center text-center">
                    <item.icon className="h-12 w-12 text-primary mb-2" />
                    <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section id="why-choose-us" className="py-12 md:py-16 bg-secondary/30">
          <div className="container">
             <div className="text-center mb-12">
                <HeartHandshake className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="font-headline text-3xl md:text-4xl font-semibold">Why Choose Tanzania Tourist Trails?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                    <ShieldCheck className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Reliable & Secure Booking</h3>
                        <p className="text-muted-foreground text-sm">Book with confidence through our secure and dependable platform.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <UsersRound className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Real Tanzanian Expert</h3>
                        <p className="text-muted-foreground text-sm">Benefit from the local knowledge and passion of our Tanzanian founder.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Search className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Affordable Access</h3>
                        <p className="text-muted-foreground text-sm">Discover great tours and safaris at prices that make adventure accessible.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <CheckCircle className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Transparency & Support</h3>
                        <p className="text-muted-foreground text-sm">We believe in clear communication and personalized support for all our users.</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section id="our-impact" className="py-12 md:py-16 bg-background">
          <div className="container text-center">
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-headline text-3xl md:text-4xl font-semibold">Our Impact</h2>
            <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
              We are dedicated to helping more people experience the unparalleled beauty of Tanzania while simultaneously supporting small and local tour operators by providing them with affordable and effective promotional opportunities. Your journey with us contributes to sustainable tourism and local economic growth.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-16 bg-primary/10">
          <div className="container">
            <div className="text-center mb-12">
              <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="font-headline text-3xl md:text-4xl font-semibold">Get in Touch</h2>
              <p className="text-muted-foreground mt-2 text-lg">We'd love to hear from you! Contact Mila Kimu directly:</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                <Mail className="h-6 w-6 text-accent" />
                <a href="mailto:kimumilangali@gmail.com" className="text-foreground hover:text-primary">kimumilangali@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                <Phone className="h-6 w-6 text-accent" />
                <div>
                    <p className="text-foreground">0678 537 803 (WhatsApp & Call)</p>
                    <p className="text-foreground">0652 810 564 (WhatsApp & Call)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                <Facebook className="h-6 w-6 text-accent" />
                <a href="https://www.facebook.com/MilaKimuProfile" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">Mila Kimu on Facebook</a>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                <Instagram className="h-6 w-6 text-accent" />
                <a href="https://www.instagram.com/milakimu/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">@milakimu on Instagram</a>
              </div>
            </div>
          </div>
        </section>

         {/* Testimonial Placeholder */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container text-center">
            <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6">What Our Travelers Say</h2>
            <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg max-w-3xl mx-auto">
              <p className="text-muted-foreground italic">Testimonials and reviews from happy travelers will be featured here soon!</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center bg-secondary/30">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-6">Ready to Explore Tanzania?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Your adventure of a lifetime is just a click away. Discover our curated tours and destinations.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/destinations">Start Your Journey</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
    

    