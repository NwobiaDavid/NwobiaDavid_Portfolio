export interface VideoData {
  title: string;
  description?: string;
  link: string;
  artist: string;
  thumbnail: string;
}

export const videoUrls: VideoData[] = [
  {
    title: "In The Room (Afro Beat Version)",
    thumbnail:
      "https://i.ytimg.com/vi/pb4KwPKJoFM/hq720.jpg",
    link: "https://www.youtube.com/watch?v=pb4KwPKJoFM&pp=ygUZaW4gdGhlIHJvb20gbWF2ZXJpY2sgY2l0eQ%3D%3D",
    artist: " Annatoria & Maverick City Music",
  },
  {
    title: "Love Theory",
    thumbnail:
      "https://i.ytimg.com/vi/3aD8OK07iIY/hq720.jpg",
    link: "https://www.youtube.com/watch?v=3aD8OK07iIY&pp=ygUZbG92ZSB0aGVvcnkga2lyayBmcmFua2xpbg%3D%3D",
    artist: "Kirk Franklin",
  },
];
