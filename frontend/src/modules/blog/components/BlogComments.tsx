'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, MessageSquare, Reply, Edit2, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  text: string;
  isStudent: boolean;
  replyToId?: string | null;
  createdAt: Timestamp | null;
}

export function BlogComments({ slug }: { slug: string }) {
  const { user, loginWithGoogle } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Threading / Edição
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, 'blog_comments'), 
        where('postId', '==', slug)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      // Ordernar por mais antigos primeiro na base (depois invertemos os pais)
      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB; 
      });

      setComments(fetchedComments);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'blog_comments'), {
        postId: slug,
        userId: user.uid,
        userName: user.displayName || 'Anônimo',
        userPhoto: user.photoURL || null,
        text: newComment.trim(),
        isStudent: !!user.hasCompletedOnboarding,
        replyToId: null,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      fetchComments(); 
    } catch (error) {
      console.error('Erro ao salvar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'blog_comments'), {
        postId: slug,
        userId: user.uid,
        userName: user.displayName || 'Anônimo',
        userPhoto: user.photoURL || null,
        text: replyText.trim(),
        isStudent: !!user.hasCompletedOnboarding,
        replyToId: parentId, // Vincula ao comentário pai
        createdAt: serverTimestamp()
      });
      setReplyText('');
      setReplyingToId(null);
      fetchComments(); 
    } catch (error) {
      console.error('Erro ao responder comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!user || !editText.trim()) return;
    setIsSubmitting(true);
    try {
      const commentRef = doc(db, 'blog_comments', commentId);
      await updateDoc(commentRef, {
        text: editText.trim()
      });
      setEditingCommentId(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este comentário?')) return;
    
    setIsSubmitting(true);
    try {
      // 1. Apaga as respostas que o usuário for dono no banco de dados (para limpar espaço)
      const replies = getReplies(commentId);
      for (const reply of replies) {
        if (reply.userId === user?.uid) {
          await deleteDoc(doc(db, 'blog_comments', reply.id));
        }
      }

      // 2. Apaga o comentário pai (Hard Delete)
      const commentRef = doc(db, 'blog_comments', commentId);
      await deleteDoc(commentRef);
      
      // Qualquer resposta de TERCEIROS que sobrar no banco ficará "órfã". 
      // Como o pai não existe mais, a UI automaticamente esconde essas respostas órfãs.
      fetchComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Organizando as Threads: Pais e Filhos
  const parentComments = comments.filter(c => !c.replyToId).reverse(); // Mais novos no topo
  const getReplies = (parentId: string) => comments.filter(c => c.replyToId === parentId);

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isOwner = user?.uid === comment.userId;
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToId === comment.id;

    return (
      <div key={comment.id} className={`flex gap-4 ${isReply ? 'mt-6' : 'mt-8'}`}>
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-brand-graphite/20 relative z-10 ${
            comment.isStudent
              ? 'border-2 border-brand-gold shadow-[0_0_15px_rgba(238,187,46,0.6)]' 
              : ''
          }`}>
            {comment.userPhoto ? (
              <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-2 text-brand-gray" />
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-foreground">
              {comment.userName}
            </span>
            {comment.isStudent && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(238,187,46,0.3)]">
                Aluno
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-2">
              {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Agora mesmo'}
            </span>
          </div>

          {/* Modo Edição vs Modo Visualização */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-card"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleEdit(comment.id)} 
                  disabled={isSubmitting || !editText.trim()}
                  className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 h-8"
                >
                  Salvar
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setEditingCommentId(null)}
                  className="h-8"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="font-body leading-relaxed whitespace-pre-wrap mt-1 text-muted-foreground">
              {comment.text}
            </p>
          )}

          {/* Ações (Apenas se logado) */}
          {user && !isEditing && (
            <div className="flex items-center gap-4 mt-2 text-xs font-bold">
              {!isReply && (
                <button 
                  onClick={() => { setReplyingToId(comment.id); setReplyText(''); }} 
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Reply className="w-3 h-3" /> Responder
                </button>
              )}
              {isOwner && (
                <>
                  <button 
                    onClick={() => { setEditingCommentId(comment.id); setEditText(comment.text); }} 
                    className="flex items-center gap-1 text-muted-foreground hover:text-brand-gold transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(comment.id)} 
                    className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Apagar
                  </button>
                </>
              )}
            </div>
          )}

          {/* Input de Resposta (Se ativo) */}
          {isReplying && !isReply && (
            <div className="mt-4 flex gap-3">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Respondendo a ${comment.userName}...`}
                className="w-full bg-card h-9 text-sm"
                autoFocus
              />
              <Button 
                size="sm" 
                onClick={() => handleReply(comment.id)} 
                disabled={isSubmitting || !replyText.trim()}
                className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 h-9 shrink-0"
              >
                Enviar
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setReplyingToId(null)}
                className="h-9 shrink-0"
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Renderização dos Filhos (Respostas) */}
          {!isReply && getReplies(comment.id).length > 0 && (
            <div className="ml-4 md:ml-12 pl-4 border-l-2 border-border/50">
              {getReplies(comment.id).map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 border-t border-border pt-12">
      <h3 className="text-2xl font-bold font-headline mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-brand-gold" />
        Comentários ({comments.length})
      </h3>

      {/* Formulário Principal */}
      <div className="mb-12">
        {user ? (
          <form onSubmit={handleSubmit} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-brand-graphite/20 border-2 border-transparent">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Você'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2 text-brand-gray" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário à discussão..."
                className="w-full bg-card"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-brand-gold text-brand-black hover:bg-brand-gold/90 font-bold"
                >
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-card border border-border p-6 rounded-2xl text-center">
            <p className="text-muted-foreground mb-4 font-body">
              Junte-se à comunidade Nota Dentro para deixar o seu comentário.
            </p>
            <Button onClick={loginWithGoogle} className="bg-white text-black hover:bg-gray-100">
              Entrar com o Google
            </Button>
          </div>
        )}
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-brand-gray italic">Carregando comentários...</p>
        ) : parentComments.length === 0 ? (
          <p className="text-brand-gray italic">Nenhum comentário ainda. Seja o primeiro!</p>
        ) : (
          parentComments.map(comment => renderComment(comment, false))
        )}
      </div>
    </div>
  );
}
