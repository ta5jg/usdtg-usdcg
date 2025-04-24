// ascii/lansmanLauncher.js
import chalkAnimation from 'chalk-animation';
import fs from 'fs';
import readline from 'readline';

const stream = fs.createReadStream('./ascii/intro.txt', { encoding: 'utf8' });

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

const lines = [];

rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const joined = lines.join('\n');
  const animation = chalkAnimation.rainbow(joined);

  setTimeout(() => {
    animation.stop(); // Stop after 8 seconds
    console.log('\n🎉 USDTg is LIVE on TRON. Begin your journey.\n');
    process.exit(0);
  }, 8000);
});