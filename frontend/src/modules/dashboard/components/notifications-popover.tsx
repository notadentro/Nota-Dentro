'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Sparkles, Check, ChevronRight } from 'lucide-react';
import { getPersonalizedRecommendations } from '@/app/actions';
import type { PersonalizedLessonRecommendationsOutput } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type RecommendationWithDetails = PersonalizedLessonRecommendationsOutput[0] & {
  topic?: string;
  difficulty?: string;
};

export function NotificationsPopover() {
  const [recommendations, setRecommendations] = useState<RecommendationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load read notifications from localStorage
    const saved = localStorage.getItem('readNotifications');
    if (saved) {
      try {
        setReadIds(JSON.parse(saved));
      } catch (e) {
        // ignore parsing error
      }
    }

    async function fetchRecommendations() {
      setLoading(true);
      const result = await getPersonalizedRecommendations();
      setRecommendations(result);
      setLoading(false);
    }
    fetchRecommendations();
  }, []);

  const unreadCount = recommendations.filter(rec => !readIds.includes(rec.lessonId)).length;

  const markAllAsRead = () => {
    const allIds = recommendations.map(rec => rec.lessonId);
    setReadIds(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const handleNotificationClick = (courseId: string) => {
    setOpen(false);
    router.push(`/dashboard/course/${courseId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group-data-[collapsible=icon]:hidden">
          <Bell className="size-5 text-muted-foreground transition-colors hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 mt-2 shadow-xl border-accent" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-headline font-bold text-sm">Notificações</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs text-muted-foreground hover:text-brand-gold">
              <Check className="size-3 mr-1" /> Marcar lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-3 p-2">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="size-8 opacity-20 mb-2" />
              <p className="text-sm">Nenhuma notificação nova.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recommendations.map(rec => {
                const isUnread = !readIds.includes(rec.lessonId);
                return (
                  <div 
                    key={rec.lessonId} 
                    className={`flex gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent/50 ${isUnread ? 'bg-accent/20' : ''}`}
                    onClick={() => handleNotificationClick('fuzileiros')}
                  >
                    <div className="mt-0.5 relative">
                      <div className="bg-brand-gold/10 p-2 rounded-full text-brand-gold">
                        <Sparkles className="size-4" />
                      </div>
                      {isUnread && <span className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full border-2 border-background" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold font-headline leading-tight">
                        {rec.topic || `Lição ${rec.lessonId}`}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-2 border-t bg-muted/20">
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setOpen(false)}>
            Ver todas as atividades
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
