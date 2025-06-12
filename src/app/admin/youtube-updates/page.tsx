
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import type { YoutubeUpdate } from '@/lib/types';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminYoutubeUpdatesPage() {
  const [updates, setUpdates] = useState<YoutubeUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUpdates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('youtube_updates')
      .select('*')
      .order('post_date', { ascending: false });

    if (error) {
      toast({ title: "Error fetching YouTube updates", description: error.message, variant: "destructive" });
      console.error("Error fetching YouTube updates:", error);
    } else {
      setUpdates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this YouTube update?")) {
      const { error } = await supabase.from('youtube_updates').delete().eq('id', id);
      if (error) {
        toast({ title: "Error deleting update", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "YouTube update deleted successfully." });
        setUpdates(prevUpdates => prevUpdates.filter(update => update.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-headline font-semibold">Manage YouTube Updates</h1>
          <Button asChild>
            <Link href="/admin/youtube-updates/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Update
            </Link>
          </Button>
        </div>
        <p>Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Manage YouTube Updates</h1>
        <Button asChild>
          <Link href="/admin/youtube-updates/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Update
          </Link>
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">ID</TableHead>
              <TableHead className="w-[30%]">Caption</TableHead>
              <TableHead className="w-[15%]">Post Date</TableHead>
              <TableHead className="w-[10%]">Likes</TableHead>
              <TableHead className="w-[10%]">Dislikes</TableHead>
              <TableHead className="w-[10%]">URL</TableHead>
              <TableHead className="text-right w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updates.length > 0 ? (
              updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell className="font-medium">{update.id}</TableCell>
                  <TableCell className="truncate max-w-xs">{update.caption}</TableCell>
                  <TableCell>{format(new Date(update.post_date), "PPP")}</TableCell>
                  <TableCell className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1 text-green-500" /> {update.likes}
                  </TableCell>
                  <TableCell className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-1 text-red-500" /> {update.dislikes}
                  </TableCell>
                  <TableCell>
                    <a href={update.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/youtube-updates/${update.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(update.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No YouTube updates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
