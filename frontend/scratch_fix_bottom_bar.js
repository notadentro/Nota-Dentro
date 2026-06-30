const fs = require('fs');

const file = 'src/modules/lesson/components/LessonEngine.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = /\{\/\* Bottom Bar \(Navigation\) \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;

const replacement = `{/* Bottom Bar (Navigation) */}
      <div className="px-4 py-5 pb-[40px] md:pb-8 border-t border-brand-graphite/20 bg-background flex items-center justify-between gap-4 w-full mt-auto shrink-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="rounded-2xl font-bold py-8 px-4 text-brand-gray border-brand-graphite/30 hover:bg-brand-graphite/10 text-base md:text-lg min-w-[100px] min-h-[64px]"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isCompleted}
          className={cn(
            "rounded-2xl font-bold py-8 px-6 text-base md:text-lg flex-1 max-w-[250px] transition-all min-h-[64px] active:scale-95",
            isCompleted 
              ? "bg-system-success hover:bg-green-600 text-white shadow-[0_6px_0_0_#1e5f3f] active:shadow-[0_0px_0_0_#1e5f3f]" 
              : "bg-brand-graphite/20 text-brand-gray cursor-not-allowed border-none shadow-none"
          )}
        >
          {currentIndex === totalSteps - 1 ? 'Finalizar' : 'Avançar'}
        </Button>
      </div>
    </div>
  );
}`;

c = c.replace(target, replacement);
fs.writeFileSync(file, c);
