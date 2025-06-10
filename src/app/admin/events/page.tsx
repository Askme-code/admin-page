import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Event } from '@/lib/types';
import { format } from 'date-fns';

// Dummy data
const dummyAdminEvents: Event[] = [
  {
    id: '1',
    title: 'Sauti za Busara Music Festival',
    slug: 'sauti-za-busara',
    description: 'African music festival.',
    event_date: '2025-02-14T00:00:00Z',
    location: 'Stone Town, Zanzibar',
    status: 'published',
    created_at: '2023-06-01T10:00:00Z',
    updated_at: '2023-06-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Kilimanjaro Marathon',
    slug: 'kilimanjaro-marathon',
    description: 'Marathon at the foot of Kilimanjaro.',
    event_date: '2025-03-02T00:00:00Z',
    location: 'Moshi',
    status: 'draft',
    created_at: '2023-07-10T11:00:00Z',
    updated_at: '2023-07-10T11:00:00Z',
  },
];

export default async function AdminEventsPage() {
  const events = dummyAdminEvents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{format(new Date(event.event_date), "PPP")}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
