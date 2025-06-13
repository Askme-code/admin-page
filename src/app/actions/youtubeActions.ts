'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface ApplyInteractionDeltaArgs {
  updateId: string;
  deltaLikes: number;
  deltaDislikes: number;
}

export async function applyYoutubeInteractionDelta({
  updateId,
  deltaLikes,
  deltaDislikes,
}: ApplyInteractionDeltaArgs): Promise<{ success: boolean; message?: string; finalLikes?: number; finalDislikes?: number }> {
  try {
    // Fetch current counts to apply deltas.
    // Note: This read-then-write can have race conditions in high-concurrency scenarios.
    // A more robust solution for atomic increments might involve a Supabase RPC function.
    const { data: currentUpdate, error: fetchError } = await supabase
      .from('youtube_updates')
      .select('likes, dislikes')
      .eq('id', updateId)
      .single();

    if (fetchError || !currentUpdate) {
      console.error('Error fetching current YouTube update for interaction delta:', fetchError);
      return { success: false, message: fetchError?.message || 'Failed to fetch update data for interaction.' };
    }

    const newLikes = Math.max(0, (currentUpdate.likes || 0) + deltaLikes);
    const newDislikes = Math.max(0, (currentUpdate.dislikes || 0) + deltaDislikes);

    const { error: updateError } = await supabase
      .from('youtube_updates')
      .update({ likes: newLikes, dislikes: newDislikes })
      .eq('id', updateId);

    if (updateError) {
      console.error('Error updating YouTube interaction counts via delta:', updateError);
      return { success: false, message: updateError.message };
    }

    // Revalidate paths to reflect changes
    revalidatePath('/'); // For homepage
    revalidatePath('/admin/youtube-updates'); // For admin panel list

    return { success: true, finalLikes: newLikes, finalDislikes: newDislikes };
  } catch (e) {
    console.error('Unexpected error in applyYoutubeInteractionDelta server action:', e);
    return { success: false, message: (e as Error).message || 'An unexpected server error occurred while updating interaction.' };
  }
}
