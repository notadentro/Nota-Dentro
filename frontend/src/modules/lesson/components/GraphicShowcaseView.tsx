import { motion } from 'framer-motion';
import { GraphicShowcaseStep } from '@/types/lesson';
import { useState } from 'react';
import { TeacherBubble } from './TeacherBubble';
import { MusicSymbol, MusicSymbolName } from '@/components/music-symbols';

interface Props {
  data: GraphicShowcaseStep;
  avatar?: any;
  isCompleted: boolean;
  onComplete: () => void;
}

export function GraphicShowcaseView({ data, avatar, isCompleted, onComplete }: Props) {
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pb-20 mt-4 md:mt-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {data.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card text-card-foreground rounded-xl p-4 shadow-sm border flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="h-32 w-full flex items-center justify-center bg-white rounded-lg p-2 border border-gray-200">
                {item.symbol ? (
                  <div className="w-20 h-20 text-brand-black flex items-center justify-center drop-shadow-sm">
                    <MusicSymbol name={item.symbol as MusicSymbolName} />
                  </div>
                ) : (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span class="text-xs text-muted-foreground">Sem imagem</span>';
                    }}
                  />
                )}
              </div>
              <h3 className="font-bold font-headline">{item.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {avatar && data.content && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 mb-4 max-w-2xl mx-auto"
          >
            <TeacherBubble avatar={avatar}>
              <p className="text-lg leading-relaxed text-inherit font-body">{data.content}</p>
            </TeacherBubble>
          </motion.div>
        )}
      </div>
    </div>
  );
}
