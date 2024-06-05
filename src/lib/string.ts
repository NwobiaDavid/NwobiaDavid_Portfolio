/**
 * Creates an avatar fallback based on the given name.
 * 
 * @param name - The name to create the avatar fallback from.
 * @returns The avatar fallback string.
 */
export const createAvatarFallback = (name: string): string => {
  // Menghilangkan spasi pada awal dan akhir nama
  name = name.trim();

  // Memisahkan kata-kata dalam nama
  const words: string[] = name.split(" ");

  // Mengambil tiga huruf pertama dari setiap kata
  const initials: string[] = words.map((word) => word[0].toUpperCase());

  // Mengambil tiga huruf pertama dari nama jika kurang dari tiga kata
  while (initials.length < 3) {
    initials.push(name[initials.length].toUpperCase());
  }

  // Menggabungkan huruf-huruf awal
  const avatarFallback: string = initials.join("");

  return avatarFallback;
}
