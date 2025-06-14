
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, icons as lucideIcons, HelpCircle } from 'lucide-react';
import type { TravelTip } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const DynamicIcon = ({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) => {
  const Icon = lucideIcons[name as keyof typeof lucideIcons] as LucideIcon | undefined;
  if (!Icon) return <HelpCircle {...props} />; 
  return <Icon {...props} />;
};

export default function AdminTravelTipsPage() {
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTravelTips = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('travel_tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching travel tips", description: error.message, variant: "destructive" });
        console.error("Error fetching travel tips:", error);
      } else {
        setTravelTips(data || []);
      }
      setLoading(false);
    };
    fetchTravelTips();
  }, []); 

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this travel tip?")) {
      const { error } = await supabase.from('travel_tips').delete().eq('id', id);
      if (error) {
        toast({ title: "Error deleting travel tip", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Travel tip deleted successfully." });
        setTravelTips(prevTips => prevTips.filter(tip => tip.id !== id));
      }
    }
  };

  if (loading) {
     return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-headline font-semibold">Manage Travel Tips</h1>
           <Button asChild>
            <Link href="/admin/travel-tips/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Travel Tip
            </Link>
          </Button>
        </div>
        <p>Loading travel tips...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage Travel Tips</h1>
        <Button asChild>
          <Link href="/admin/travel-tips/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Travel Tip
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travelTips.length > 0 ? (
              travelTips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell>
                    <DynamicIcon name={tip.icon} className="h-5 w-5 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{tip.title}</TableCell>
                  <TableCell>{tip.category}</TableCell>
                  <TableCell>
                    <Badge variant={tip.status === 'published' ? 'default' : 'secondary'}>
                      {tip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="mr-2 hover:text-primary">
                      <Link href={`/admin/travel-tips/${tip.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(tip.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No travel tips found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
