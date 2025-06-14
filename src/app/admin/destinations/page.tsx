
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Destination } from '@/lib/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching destinations", description: error.message, variant: "destructive" });
        console.error("Error fetching destinations:", error);
      } else {
        setDestinations(data || []);
      }
      setLoading(false);
    };
    fetchDestinations();
  }, []); 

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      const { error } = await supabase.from('destinations').delete().eq('id', id);
      if (error) {
        toast({ title: "Error deleting destination", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Destination deleted successfully." });
        setDestinations(prevDestinations => prevDestinations.filter(dest => dest.id !== id));
      }
    }
  };

  if (loading) {
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
        <p>Loading destinations...</p>
      </div>
    );
  }

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
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(destination.id)}>
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
