let currentAudio = null;

export const playAudio = (letter, name) => {
  // Eğer daha önce çalan bir ses varsa durdur
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // İnternet kısıtlamalarını ve gizli sekme yasaklarını aşmak için
  // önceden indirilmiş yerel .mp3 dosyalarını kullanıyoruz.
  const url = `${import.meta.env.BASE_URL}audio/${name}.mp3`;

  currentAudio = new Audio(url);
  
  // Sesi oynat
  currentAudio.play().catch(e => {
    console.error("Yerel ses dosyası çalınamadı:", e);
  });
};
