import { shelves } from "@/constants/data/books";

export const BookHobbyContent = () => (
  <div className="flex flex-col gap-14">
    {shelves.map((shelf) => (
      <section key={shelf.title}>
        <h2 className="mb-6 flex items-baseline gap-3 text-xl font-semibold tracking-[-0.01em]">
          {shelf.title}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground tabular-nums">
            {shelf.books.length}
          </span>
        </h2>
        <ul className="stagger grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:gap-x-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {shelf.books.map((book, index) => (
            <li key={book.title} data-no-blobity style={{ "--i": index } as React.CSSProperties}>
              <figure className="group flex flex-col gap-3">
                <div className="relative aspect-[2/3] overflow-hidden rounded-[3px_8px_8px_3px] bg-muted shadow-[0_10px_24px_-12px_hsl(var(--foreground)/0.45)] ring-1 ring-foreground/10 transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_36px_-16px_hsl(var(--foreground)/0.5)]">
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {/* The spine: a crease and a soft sheen down the bound edge. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/25 via-white/15 to-transparent"
                  />
                </div>
                <figcaption>
                  <p className="text-[0.95rem] font-medium leading-snug">{book.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{book.author}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);
