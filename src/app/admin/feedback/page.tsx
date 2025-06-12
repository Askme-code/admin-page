
"use client";

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UserFeedback } from '@/lib/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AlertTriangle, Trash2 } from 'lucide-react'; // Added Trash2 icon

export default function AdminFeedbackPage() {
  const [feedbackEntries, setFeedbackEntries] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching feedback", description: error.message, variant: "destructive" });
        console.error("Error fetching feedback:", error);
      } else {
        setFeedbackEntries(data || []);
      }
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback message? This action cannot be undone.")) {
      const { error } = await supabase.from('user_feedback').delete().eq('id', id);
      if (error) {
        toast({ title: "Error deleting feedback", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Feedback message deleted successfully." });
        setFeedbackEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      }
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-headline font-semibold">User Feedback</h1>
        <p>Loading feedback messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">User Feedback</h1>
      </div>

      {feedbackEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 border rounded-md shadow-sm">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium">No Feedback Yet</p>
          <p className="text-muted-foreground">There are no feedback messages to display at this time.</p>
        </div>
      ) : (
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Submitted At</TableHead>
                <TableHead className="w-[15%]">Full Name</TableHead>
                <TableHead className="w-[15%]">Email</TableHead>
                <TableHead className="w-[35%]">Message</TableHead>
                <TableHead className="w-[10%]">Interest Area</TableHead>
                <TableHead className="w-[10%]">Referral</TableHead>
                <TableHead className="text-right w-[5%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.created_at), "PPp")}</TableCell>
                  <TableCell className="font-medium">{entry.full_name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell className="whitespace-pre-wrap break-words">{entry.message}</TableCell>
                  <TableCell>{entry.interest_area || 'N/A'}</TableCell>
                  <TableCell>{entry.referral_source || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:text-destructive" 
                      onClick={() => handleDelete(entry.id)}
                      title="Delete feedback"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
