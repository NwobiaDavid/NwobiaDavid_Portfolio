import { cn } from "@/lib/utils";

// The mark: a "d" and an underscore cursor, a prompt waiting for input. The same
// drawing as public/favicon.svg, kept in the brand's own colours in every theme so it
// always matches the browser tab. Inside a `.brand` link the cursor blinks on hover.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={cn("shrink-0", className)} aria-hidden>
      <rect width="512" height="512" rx="112" fill="#30364F" />
      <g transform="translate(-17 -9)" fill="#F0F0DB">
        <circle cx="196" cy="304" r="84" fill="none" stroke="#F0F0DB" strokeWidth="60" />
        <rect x="250" y="112" width="60" height="306" />
        <rect className="logo-cursor" x="340" y="358" width="124" height="60" fill="#F5B85C" />
      </g>
    </svg>
  );
}
