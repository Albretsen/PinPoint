import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { useState } from 'react';

export function useGroup() {
  const { session } = useUserStore();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const joinGroup = async (groupId: string) => {
    if (!session?.user?.id) return false;
    
    setIsJoining(true);
    try {
      const { error } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupId,
            user_id: session.user.id,
            is_admin: false,
            joined_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!session?.user?.id) return false;
    
    setIsLeaving(true);
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', session.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      return false;
    } finally {
      setIsLeaving(false);
    }
  };

  return {
    isJoining,
    isLeaving,
    joinGroup,
    leaveGroup,
  };
} 