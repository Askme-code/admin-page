
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Newspaper, Map, CalendarClock, Lightbulb, Users, BarChart3, PlusCircle, Youtube } from "lucide-react";

// Dummy stats - replace with actual data fetching logic if needed
const stats = [
  { title: "Published Articles", value: "25", icon: Newspaper, color: "text-blue-500" },
  { title: "Total Destinations", value: "12", icon: Map, color: "text-green-500" },
  { title: "Upcoming Events", value: "5", icon: CalendarClock, color: "text-purple-500" },
  { title: "Travel Tips", value: "42", icon: Lightbulb, color: "text-yellow-500" },
  { title: "YouTube Updates", value: "10", icon: Youtube, color: "text-red-500" }, // Added YouTube stat
  { title: "Registered Users", value: "150", icon: Users, color: "text-indigo-500" },
  // { title: "Site Visits (Month)", value: "12,345", icon: BarChart3, color: "text-pink-500" }, // Example, can enable later
];

const quickLinks = [
    { title: "Add New Article", href: "/admin/articles/new", icon: Newspaper },
    { title: "Add New Destination", href: "/admin/destinations/new", icon: Map },
    { title: "Add New Event", href: "/admin/events/new", icon: CalendarClock },
    { title: "Add New Travel Tip", href: "/admin/travel-tips/new", icon: Lightbulb },
    { title: "Post YouTube Update", href: "/admin/youtube-updates/new", icon: Youtube },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent content updates and user actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Newspaper className="h-4 w-4 text-muted-foreground" /> New article "Exploring Tarangire" published.</li>
              <li className="flex items-center gap-2"><Map className="h-4 w-4 text-muted-foreground" /> Destination "Lake Manyara" updated.</li>
              <li className="flex items-center gap-2"><Youtube className="h-4 w-4 text-muted-foreground" /> New YouTube update posted.</li>
              <li className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> New user registered: example@user.com.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access common admin tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link) => (
                <Button key={link.title} asChild variant="outline" className="w-full justify-start">
                    <Link href={link.href}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.title}
                    </Link>
                </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
