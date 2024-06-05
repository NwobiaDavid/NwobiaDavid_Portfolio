/**
 * Pads a number with a leading zero if it is less than 10.
 * 
 * @param angka - The number to pad.
 * @returns The padded number as a string.
*/
const pad = (angka: number) => {
  return angka < 10 ? "0" + angka : angka;
};

/**
 * Converts seconds to a formatted time string in the format HH:MM:SS.
 * @param detik - The number of seconds to be converted.
 * @returns The formatted time string.
 */
export const detikKeStringWaktu = (detik: number) => {
  // Menghitung jam, menit, dan detik
  const jam = Math.floor(detik / 3600);
  const sisaDetik = detik % 3600;
  const menit = Math.floor(sisaDetik / 60);
  const detikSisa = sisaDetik % 60;

  // Mengonversi ke format string dengan format JJ:MM:DD
  const waktuString = pad(jam) + ":" + pad(menit) + ":" + pad(detikSisa);

  return waktuString;
};