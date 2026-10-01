export interface BookData {
  title: string;
  author: string;
  /** Cover under public/images/books, ideally 500px tall or more. */
  cover: string;
}

export interface Shelf {
  title: string;
  books: BookData[];
}

const cover = (file: string) => `/images/books/${file}.jpg`;

export const shelves: Shelf[] = [
  {
    title: "Personal development",
    books: [
      { title: "The Compound Effect", author: "Darren Hardy", cover: cover("compound-effect") },
      { title: "Atomic Habits", author: "James Clear", cover: cover("atomic-habits") },
      { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", cover: cover("rich-dad-poor-dad") },
      { title: "Think and Grow Rich", author: "Napoleon Hill", cover: cover("think-and-grow-rich") },
      { title: "Success Systems", author: "David Oyedepo", cover: cover("success-systems") },
    ],
  },
  {
    title: "Entrepreneurship",
    books: [
      { title: "The Lean Startup", author: "Eric Ries", cover: cover("lean-startup") },
      { title: "Hooked", author: "Nir Eyal, Ryan Hoover", cover: cover("hooked") },
      { title: "Zero to One", author: "Peter Thiel, Blake Masters", cover: cover("zero-to-one") },
      { title: "Traction", author: "Gabriel Weinberg, Justin Mares", cover: cover("traction") },
      { title: "The Millionaire Fastlane", author: "M. J. DeMarco", cover: cover("millionaire-fastlane") },
      { title: "Crushing It!", author: "Gary Vaynerchuk", cover: cover("crushing-it") },
      { title: "Million Dollar Weekend", author: "Noah Kagan", cover: cover("million-dollar-weekend") },
    ],
  },
];

export const bookCount = shelves.reduce((total, shelf) => total + shelf.books.length, 0);
