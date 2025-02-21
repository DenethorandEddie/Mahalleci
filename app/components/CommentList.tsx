'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Comment from './Comment';
import { toast } from 'react-hot-toast';

interface CommentListProps {
  postId: string;
  currentUserId?: string;
}

const CommentList = ({ postId, currentUserId }: CommentListProps) => {
  const supabase = createClientComponentClient();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Yorumları getir
  const fetchComments = async () => {
    try {
      // Önce yorumları al
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Kullanıcı profillerini al
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, email, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Yorumları ve kullanıcı bilgilerini birleştir
      const commentsWithUsers = commentsData?.map(comment => ({
        ...comment,
        user: profilesData?.find(p => p.id === comment.user_id)
      }));

      setComments(commentsWithUsers || []);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      toast.error('Yorumlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Yorum silme
  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) throw error;
      
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Yorum silindi');
    } catch (error) {
      console.error('Yorum silinirken hata:', error);
      toast.error('Yorum silinemedi');
    }
  };

  // Realtime subscription
  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          id={comment.id}
          content={comment.content}
          createdAt={comment.created_at}
          user={comment.user || { id: comment.user_id, email: 'Kullanıcı bulunamadı' }}
          onDelete={comment.user_id === currentUserId ? handleDelete : undefined}
        />
      ))}
      
      {comments.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          Henüz yorum yapılmamış
        </p>
      )}
    </div>
  );
};

export default CommentList; 