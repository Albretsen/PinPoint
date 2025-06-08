import { usePinToast } from '@/src/components/PinToast';
import { useTranslation } from '@/src/i18n/useTranslation';
import { supabase } from '@/src/lib/supabase';
import { useUserStore } from '@/src/store/userStore';
import { useState } from 'react';

export function useGroup() {
  const { session } = useUserStore();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = usePinToast();
  const { t } = useTranslation();

  const leaveGroup = async (groupId: string) => {
    if (!session?.user?.id) return false;

    try {
      setIsLeaving(true);
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

  const joinGroup = async (groupId: string) => {
    if (!session?.user?.id) return false;

    try {
      setIsJoining(true);
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: session.user.id,
          is_admin: false,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  const kickMember = async (groupId: string, userId: string) => {
    if (!session?.user?.id) return false;

    try {
      setIsKicking(true);
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error kicking member:', error);
      return false;
    } finally {
      setIsKicking(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!session?.user?.id) return false;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId)
        .eq('owner_id', session.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isLeaving,
    isJoining,
    isKicking,
    isDeleting,
    leaveGroup,
    joinGroup,
    kickMember,
    deleteGroup,
  };
} 