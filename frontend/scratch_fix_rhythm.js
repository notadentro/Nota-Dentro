const fs = require('fs');

function fixFile(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Fix getCurrentTimeMs to only use performance.now()
  c = c.replace(/const getCurrentTimeMs = \(\) => \{[\s\S]*?return Date\.now\(\);\s+\};/, 'const getCurrentTimeMs = () => performance.now();');

  // Fix scheduling offset to use ctx.currentTime
  const prepRegex = /const nowTimeMs = getCurrentTimeMs\(\);\s+const beatSec = 60 \/ bpm;\s+if \(ctx\) \{[\s\S]*?for \(let i = 0; i < 4 \+ beatsToComplete; i\+\+\) \{[\s\S]*?const freq = .*?;\s+scheduleClick\(ctx, freq, \(nowTimeMs \/ 1000\) \+ 0\.1 \+ i \* beatSec\);\s+\}\s+\}/;
  
  const prepReplacement = `const nowTimeMs = getCurrentTimeMs();
    const beatSec = 60 / bpm;

    if (ctx) {
      const audioNow = ctx.currentTime;
      for (let i = 0; i < 4 + beatsToComplete; i++) {
        const freq = (i === 0) ? 1200 : 800;
        scheduleClick(ctx, freq, audioNow + 0.1 + i * beatSec);
      }
    }`;
    
  c = c.replace(prepRegex, prepReplacement);

  // Increase auto-miss tolerance
  c = c.replace(/if \(timeSinceBeat > toleranceMs && resultsRef\.current\[currentBeatIndex\] === null\)/g, 'if (timeSinceBeat > (beatMs * 0.4) && resultsRef.current[currentBeatIndex] === null)');
  c = c.replace(/if \(elapsed > beatExpectedTime \+ toleranceMs && nextResults\[i\] === null\)/g, 'if (elapsed > beatExpectedTime + (beatMs * 0.4) && nextResults[i] === null)');

  fs.writeFileSync(file, c);
}

fixFile('src/modules/lesson/components/RhythmicReadingView.tsx');
fixFile('src/modules/lesson/components/PulsationView.tsx');
