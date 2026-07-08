import fs from 'fs';
import https from 'https';
import path from 'path';

// Read elifba.js to extract the letters
const elifbaContent = fs.readFileSync('./src/data/elifba.js', 'utf8');

// A quick and dirty regex to extract letter objects: { id: ..., letter: '...', name: '...' }
const regex = /letter:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
let match;
const audioItems = [];

while ((match = regex.exec(elifbaContent)) !== null) {
  audioItems.push({ arabic: match[1], name: match[2] });
}

// Filter unique names to avoid downloading the same file multiple times
const uniqueItems = [];
const seenNames = new Set();
for (const item of audioItems) {
  if (!seenNames.has(item.name)) {
    seenNames.add(item.name);
    uniqueItems.push(item);
  }
}

const dir = './public/audio';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function download(arabic, name) {
  const encodedQuery = encodeURIComponent(arabic);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedQuery}&tl=ar`;
  const dest = path.join(dir, `${name}.mp3`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        console.error(`Failed to download ${name} (${arabic}): ${res.statusCode}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(err);
      resolve();
    });
  });
}

async function main() {
  console.log(`Downloading ${uniqueItems.length} Arabic audio files...`);
  for (const item of uniqueItems) {
    console.log(`Downloading ${item.name} (${item.arabic})...`);
    await download(item.arabic, item.name);
    await new Promise(r => setTimeout(r, 200)); 
  }
  console.log('All downloads finished!');
}

main();
