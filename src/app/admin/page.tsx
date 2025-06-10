import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newspaper, Map, CalendarClock, Lightbulb, Users, BarChart3 } from "lucide-react";

// Dummy stats - replace with actual data fetching
const stats = [
  { title: "Published Articles", value: "25", icon: Newspaper, color: "text-blue-500" },
  { title: "Total Destinations", value: "12", icon: Map, color: "text-green-500" },
  { title: "Upcoming Events", value: "5", icon: CalendarClock, color: "text-purple-500" },
  { title: "Travel Tips", value: "42", icon: Lightbulb, color: "text-yellow-500" },
  { title: "Registered Users", value: "150", icon: Users, color: "text-indigo-500" },
  { title: "Site Visits (Month)", value: "12,345", icon: BarChart3, color: "text-pink-500" },
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
              <p className="text-xs text-muted-foreground">
                {/* You can add a comparison here, e.g., +5 from last month */}
              </p>
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
            {/* Placeholder for recent activity feed */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Newspaper className="h-4 w-4 text-muted-foreground" /> New article "Exploring Tarangire" published.</li>
              <li className="flex items-center gap-2"><Map className="h-4 w-4 text-muted-foreground" /> Destination "Lake Manyara" updated.</li>
              <li className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> New user registered: example@user.com.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access common admin tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
             <p className="text-muted-foreground">Management links will be here.</p>
            {/* Links to /admin/articles/new etc. */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
