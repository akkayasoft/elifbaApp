import fs from 'fs';
import https from 'https';
import path from 'path';

const words = [
  'Bete', 'Tebe', 'Sebe', 'Ketebe', 'Hasede', 'Ehede', 'Samede', 'Haleka', 'Tabaka', 'Kaleme', 'Belede', 'Nezele', 'Dehale', 'Zehebe', 'Velede'
];

const dir = './public/audio';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function download(word) {
  const encodedName = encodeURIComponent(word);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedName}&tl=tr`;
  const dest = path.join(dir, `${word}.mp3`);
  
  if (fs.existsSync(dest)) return;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        console.error(`Failed to download ${word}: ${res.statusCode}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(err);
      resolve();
    });
  });
}

async function main() {
  for (const word of words) {
    console.log(`Downloading ${word}...`);
    await download(word);
    await new Promise(r => setTimeout(r, 200)); 
  }
  console.log('All downloads finished!');
}

main();
