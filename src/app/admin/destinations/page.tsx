import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Destination } from '@/lib/types';

// Dummy data
const dummyAdminDestinations: Destination[] = [
  {
    id: '1',
    name: 'Serengeti National Park',
    slug: 'serengeti-national-park',
    description: 'Vast plains teeming with wildlife.',
    location: 'Northern Tanzania',
    status: 'published',
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2023-08-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Zanzibar Archipelago',
    slug: 'zanzibar-archipelago',
    description: 'Pristine beaches and historic Stone Town.',
    location: 'Off the coast',
    status: 'draft',
    created_at: '2023-07-20T09:00:00Z',
    updated_at: '2023-07-20T09:00:00Z',
  },
];

export default async function AdminDestinationsPage() {
  const destinations = dummyAdminDestinations;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage Destinations</h1>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Destination
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.length > 0 ? (
              destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell>{destination.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={destination.status === 'published' ? 'default' : 'secondary'}>
                      {destination.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(destination.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/destinations/${destination.id}/edit`}>
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
                  No destinations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
