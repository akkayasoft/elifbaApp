import fs from 'fs';
import https from 'https';
import path from 'path';

const words = [
  'Elif', 'Be', 'Te', 'Se', 'Cim', 'Ha', 'Hı', 'Dal', 'Zel', 'Ra', 'Ze', 'Sin', 'Şın', 'Sad', 'Dat', 'Tı', 'Zı', 'Ayn', 'Gayn', 'Fe', 'Kaf', 'Kef', 'Lam', 'Mim', 'Nun', 'Vav', 'He', 'Lamelif', 'Ye',
  'E', 'Ce', 'De', 'Şe', 'Sa', 'Da', 'Ta', 'Za', 'A', 'Ga', 'Ka', 'Ke', 'Le', 'Me', 'Ne', 'Ve', 'La',
  'İ', 'Bi', 'Ti', 'Si', 'Ci', 'Di', 'Zi', 'Ri', 'Şi', 'Sı', 'Dı', 'Tı', 'I', 'Gı', 'Fi', 'Kı', 'Ki', 'Li', 'Mi', 'Ni', 'Vi', 'Hi', 'Yi',
  'Ü', 'Bü', 'Tü', 'Sü', 'Cü', 'Hu', 'Dü', 'Zü', 'Ru', 'Şü', 'Su', 'Du', 'Tu', 'Zu', 'U', 'Gu', 'Fü', 'Ku', 'Kü', 'Lü', 'Mü', 'Nü', 'Vü', 'Hü', 'Yü'
];

// Unique words only
const uniqueWords = [...new Set(words)];

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
  for (const word of uniqueWords) {
    console.log(`Downloading ${word}...`);
    await download(word);
    await new Promise(r => setTimeout(r, 200)); // sleep to avoid rate limiting
  }
  console.log('All downloads finished!');
}

main();
