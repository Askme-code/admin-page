
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Plane, Ship, Car, BedDouble, Phone, Mail, MessageSquare, Facebook, Instagram, ArrowRight, UserPlus, Ticket } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const hotelList = [
  { name: "Hotel Verde Zanzibar - Azam Luxury Resort & Spa", location: "Zanzibar", type: "Luxury Resort", image: "https://placehold.co/600x400.png", aiHint: "luxury resort" },
  { name: "Park Hyatt Zanzibar", location: "Stone Town, Zanzibar", type: "Luxury Hotel", image: "https://placehold.co/600x400.png", aiHint: "stone town hotel" },
  { name: "The Residence Zanzibar", location: "Zanzibar", type: "Luxury Villas", image: "https://placehold.co/600x400.png", aiHint: "zanzibar villas" },
  { name: "Four Seasons Safari Lodge Serengeti", location: "Serengeti National Park", type: "Safari Lodge", image: "https://placehold.co/600x400.png", aiHint: "serengeti lodge" },
  { name: "Gran Melia Arusha", location: "Arusha", type: "City Hotel", image: "https://placehold.co/600x400.png", aiHint: "arusha hotel" },
  { name: "Serena Hotel Zanzibar", location: "Stone Town, Zanzibar", type: "Historic Hotel", image: "https://placehold.co/600x400.png", aiHint: "historic hotel" },
];


export default function PlanYourVisitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/70 to-accent/70 text-primary-foreground">
          <Image
            src="https://placehold.co/1920x600.png" // Replace with a stunning Tanzania/Zanzibar hero image
            alt="Scenic view of Zanzibar or Tanzania"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-30"
            data-ai-hint="zanzibar tanzania beach"
            priority
          />
          <div className="container relative z-10 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4">Plan Your Unforgettable Visit</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Discover Tanzania & Zanzibar: Essential tips for flights, ferries, local transport, and top accommodations.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/booking">Book a Tour <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container space-y-12">

            {/* Transportation Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl md:text-3xl flex items-center">
                  <Plane className="mr-3 h-7 w-7 text-primary" /> Getting Here & Around
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-lg">Air Transport</AccordionTrigger>
                    <AccordionContent className="prose max-w-none">
                      <p>Most international visitors arrive at <strong>Abeid Amani Karume International Airport (ZNZ)</strong> in Zanzibar or <strong>Julius Nyerere International Airport (DAR)</strong> in Dar es Salaam. Kilimanjaro International Airport (JRO) is also a key hub for northern safari circuits.</p>
                      <p>Several international airlines fly directly or with convenient connections. Domestic flights between major towns, islands, and national parks are frequent and operated by local airlines like Precision Air, Air Tanzania, Coastal Aviation, and Auric Air.</p>
                      <p><strong>Tip:</strong> Book domestic flights in advance, especially during peak season.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-semibold text-lg">Ferry Transport (Dar es Salaam - Zanzibar)</AccordionTrigger>
                    <AccordionContent className="prose max-w-none">
                      <p>Modern, fast ferries operate multiple times daily between Dar es Salaam and Stone Town, Zanzibar. The journey takes approximately 1.5 to 2 hours.</p>
                      <p>Popular operators include Azam Marine (Kilimanjaro Fast Ferries) and Zan Fast Ferries. It's advisable to book tickets in advance, especially during holidays. Economy, Business, and VIP classes are usually available.</p>
                      <p><strong>Note:</strong> Ensure you have your passport for check-in, even for domestic travel between mainland Tanzania and Zanzibar.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-semibold text-lg">Local Transport</AccordionTrigger>
                    <AccordionContent className="prose max-w-none">
                      <ul>
                        <li><strong>Taxis & Ride-Hailing:</strong> Available in cities and tourist areas. Agree on the fare beforehand for taxis, or use apps like Uber or Bolt where available (mainly Dar es Salaam).</li>
                        <li><strong>Bajaji (Tuk-tuks):</strong> Common in towns for short distances. Negotiate fare before starting.</li>
                        <li><strong>Dala-dala (Minibuses):</strong> The most common public transport for locals. Cheap but can be crowded. An adventurous option!</li>
                        <li><strong>Car Rental:</strong> Available, but self-driving can be challenging due to road conditions and driving styles. Consider hiring a driver with the car. An international driving permit is often required.</li>
                        <li><strong>Boats & Dhows:</strong> Essential for island hopping or coastal trips in Zanzibar. Use reputable operators for safety.</li>
                        <li><strong>Walking:</strong> Stone Town in Zanzibar is very walkable. Be mindful of your surroundings and keep valuables secure.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Accommodation Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl md:text-3xl flex items-center">
                  <BedDouble className="mr-3 h-7 w-7 text-primary" /> Top Hotel Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Tanzania and Zanzibar offer a wide range of accommodations, from luxurious beach resorts and safari lodges to charming boutique hotels and budget-friendly guesthouses. Here are a few highly-rated options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotelList.map((hotel) => (
                    <Card key={hotel.name} className="overflow-hidden">
                      <Image src={hotel.image} alt={hotel.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={hotel.aiHint} />
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg font-semibold">{hotel.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{hotel.location}</p>
                        <p className="text-sm text-primary">{hotel.type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted-foreground"><strong>Tip:</strong> Book accommodations well in advance, particularly for peak travel seasons (June-September, December-February) and for popular lodges in national parks.</p>
              </CardContent>
            </Card>

            {/* Contact and Booking Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl md:text-3xl flex items-center">
                  <Phone className="mr-3 h-7 w-7 text-primary" /> Ready to Start Planning?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Have questions or need assistance with your itinerary? Our team is here to help you craft the perfect Tanzanian adventure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-lg">Contact Us Directly:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Mail className="mr-2 h-5 w-5 text-accent"/> <a href="mailto:kimumilangali@gmail.com" className="hover:underline">kimumilangali@gmail.com</a>
                            </li>
                            <li className="flex items-center">
                                <MessageSquare className="mr-2 h-5 w-5 text-accent"/> <a href="https://wa.me/255678537803" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp: +255 678 537 803</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-lg">Quick Actions:</h3>
                        <div className="space-y-3">
                            <Button asChild className="w-full md:w-auto justify-start">
                                <Link href="/booking"><Ticket className="mr-2 h-5 w-5"/> Book a Tour</Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full md:w-auto justify-start">
                                <Link href="/signup"><UserPlus className="mr-2 h-5 w-5"/> Create an Account</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3 text-lg text-center">Follow Milangali Kimu:</h3>
                    <div className="flex justify-center items-center gap-4">
                        <a href="https://www.facebook.com/MilaKimuProfile" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-foreground hover:bg-accent/10 hover:text-accent-foreground transition-colors"><Facebook className="h-6 w-6"/></a>
                        <a href="https://www.instagram.com/milakimu/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full text-foreground hover:bg-accent/10 hover:text-accent-foreground transition-colors"><Instagram className="h-6 w-6"/></a>
                    </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

