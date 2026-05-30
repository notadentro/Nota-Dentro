'use client';

import { useRouter } from 'next/navigation';
import { Lesson } from '@/types/lesson';
import { TrailNode } from './TrailNode';
import { cn } from '@/lib/utils';

interface TrailMapProps {
  lessons: Lesson[];
  onLessonClick?: (lesson: Lesson) => void;
}

const Y_OFFSETS = [
  -30,  15, -10, // Row 0
  -10,  30,   0, // Row 1
    0, -20,  20, // Row 2
   20, -15, -30  // Row 3
];

export function TrailMap({ lessons, onLessonClick }: TrailMapProps) {
  const router = useRouter();
  
  // Divide lessons into chunks of 3 or 4 to create the "Staff Rows"
  const CHUNK_SIZE = 3;
  const rows: Lesson[][] = [];
  for (let i = 0; i < lessons.length; i += CHUNK_SIZE) {
    rows.push(lessons.slice(i, i + CHUNK_SIZE));
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-12 px-4 md:px-12 z-10">
      {rows.map((row, rowIndex) => {
        const nextRow = rows[rowIndex + 1];
        const isLastRow = rowIndex === rows.length - 1;
        return (
          <StaffRow 
            key={rowIndex} 
            lessons={row} 
            rowIndex={rowIndex} 
            router={router} 
            nextRowFirstNode={nextRow ? nextRow[0] : undefined}
            nextRowLength={nextRow ? nextRow.length : 0}
            nextRowOffset={nextRow ? Y_OFFSETS[((rowIndex + 1) * 3) % Y_OFFSETS.length] : 0}
            isLastRow={isLastRow}
            onLessonClick={onLessonClick}
          />
        );
      })}
    </div>
  );
}

interface StaffRowProps {
  lessons: Lesson[];
  rowIndex: number;
  router: any;
  nextRowFirstNode?: Lesson;
  nextRowLength?: number;
  nextRowOffset?: number;
  isLastRow?: boolean;
  onLessonClick?: (lesson: Lesson) => void;
}

function StaffRow({ lessons, rowIndex, router, nextRowFirstNode, nextRowLength, nextRowOffset, isLastRow, onLessonClick }: StaffRowProps) {
  // X coordinates for 896px width (max-w-4xl)
  const getXCoord = (index: number, total: number) => {
    return ((index * 2 + 1) / (total * 2)) * 896;
  };

  return (
    <div className="relative w-full h-[140px] flex items-center max-w-4xl mx-auto">
      
      {/* The 5 Lines of the Musical Staff with Barlines */}
      <div className="absolute left-0 right-0 h-[80px] flex flex-col justify-between z-0 pointer-events-none opacity-40">
        {/* Horizontal Lines */}
        {[...Array(5)].map((_, i) => (
          <div key={`line-${i}`} className="h-[2px] w-full bg-brand-white" />
        ))}
        
        {/* Barra Inicial */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-white" />

        {/* Barras de compasso intermediárias */}
        {[...Array(lessons.length - 1)].map((_, i) => {
          const leftPercent = ((i + 1) / lessons.length) * 100;
          return (
            <div 
              key={`barline-${i}`} 
              className="absolute top-0 bottom-0 w-[2px] bg-brand-white" 
              style={{ left: `${leftPercent}%` }}
            />
          );
        })}

        {/* Barra Final (Simples se continua, Dupla se for a última pauta) */}
        {isLastRow ? (
          <div className="absolute right-0 top-0 bottom-0 flex gap-1">
            <div className="w-[2px] bg-brand-white" />
            <div className="w-[6px] bg-brand-white" />
          </div>
        ) : (
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-brand-white" />
        )}
      </div>

      {/* SVG Ligaduras (Connections) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 896 140"
        preserveAspectRatio="none"
      >
        {lessons.map((lesson, i) => {
          const isLastInRow = i === lessons.length - 1;
          const nextLesson = isLastInRow ? nextRowFirstNode : lessons[i + 1];
          
          if (!nextLesson) return null; // Último nó do mapa inteiro
          
          const x1 = getXCoord(i, lessons.length);
          const y1 = 70 + Y_OFFSETS[(rowIndex * 3 + i) % Y_OFFSETS.length];
          const isGreen = lesson.status === 'completed';

          // Conexão entre pautas (Sheet Music style)
          if (isLastInRow) {
            const x2 = getXCoord(0, nextRowLength!);
            const y2 = 70 + 172 + nextRowOffset!; // 140 height + 32 gap = 172px de distância vertical
            
            const isCurrentRowTitleTop = rowIndex % 2 === 0;
            const dir1 = isCurrentRowTitleTop ? 1 : -1;
            
            const isNextRowTitleTop = (rowIndex + 1) % 2 === 0;
            const dir2 = isNextRowTitleTop ? 1 : -1;

            // Arco 1 sai reto na horizontal (endY = y1)
            const cy1 = y1 + (40 * dir1);
            const path1 = `M ${x1} ${y1} Q ${(x1 + 896)/2} ${cy1}, 896 ${y1}`;
            
            // Arco 2 chega reto da horizontal (startY = y2)
            const cy2 = y2 + (40 * dir2);
            const path2 = `M 0 ${y2} Q ${x2/2} ${cy2}, ${x2} ${y2}`;

            return (
              <g key={`line-inter-${rowIndex}`}>
                <path
                  d={path1}
                  fill="none"
                  stroke={isGreen ? "#2D8A5C" : "#4A4A4A"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={cn("transition-colors duration-500", isGreen && "opacity-80")}
                />
                <path
                  d={path2}
                  fill="none"
                  stroke={isGreen ? "#2D8A5C" : "#4A4A4A"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={cn("transition-colors duration-500", isGreen && "opacity-80")}
                />
              </g>
            );
          }

          // Conexão normal dentro da mesma pauta
          const x2 = getXCoord(i + 1, lessons.length);
          const y2 = 70 + Y_OFFSETS[(rowIndex * 3 + i + 1) % Y_OFFSETS.length];
          
          const cx = (x1 + x2) / 2;
          const curvesDown = rowIndex % 2 === 0;
          const cy = curvesDown ? Math.max(y1, y2) + 60 : Math.min(y1, y2) - 60; 

          return (
            <path
              key={`line-${i}`}
              d={`M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`}
              fill="none"
              stroke={isGreen ? "#2D8A5C" : "#4A4A4A"}
              strokeWidth="4"
              strokeLinecap="round"
              className={cn("transition-colors duration-500", isGreen && "opacity-80")}
            />
          );
        })}
      </svg>

      {/* The Nodes (Notes) */}
      <div className="relative z-10 w-full flex justify-around items-center h-full">
        {lessons.map((lesson, i) => {
          const offset = Y_OFFSETS[(rowIndex * 3 + i) % Y_OFFSETS.length];
          
          // Título sempre do lado oposto da curva da ligadura
          const titlePosition = rowIndex % 2 === 0 ? 'top' : 'bottom';
          
          return (
            <div 
              key={lesson.id} 
              className="relative flex items-center justify-center"
              style={{ transform: `translateY(${offset}px)` }}
            >
              <TrailNode 
                status={lesson.status}
                title={lesson.title}
                onClick={() => {
                  if (onLessonClick) {
                    onLessonClick(lesson);
                  } else {
                    router.push(`/lesson/${lesson.slug}`);
                  }
                }}
                titlePosition={titlePosition}
              />
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
