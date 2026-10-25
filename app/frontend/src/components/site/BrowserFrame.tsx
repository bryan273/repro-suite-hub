import { cn } from '@/lib/utils';

interface BrowserFrameProps {
  src: string;
  alt: string;
  host: string;
  className?: string;
  eager?: boolean;
  compact?: boolean;
}

/** A neutral browser-window mockup wrapping a 16:10 screenshot. */
export default function BrowserFrame({ src, alt, host, className, eager, compact }: BrowserFrameProps) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_48px_-24px_rgba(20,32,46,0.35)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 border-b border-border bg-secondary',
          compact ? 'h-6 px-2.5' : 'h-8 px-3.5',
        )}
        aria-hidden
      >
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn('rounded-full bg-[hsl(var(--subtle))]/40', compact ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5')}
            />
          ))}
        </span>
        {!compact && (
          <span className="mx-auto min-w-0 truncate rounded-md bg-card px-3 py-0.5 text-[11px] text-[hsl(var(--subtle))]">
            {host}
          </span>
        )}
      </div>
      <img
        src={src}
        alt={alt}
        width={1440}
        height={900}
        loading="eager"
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </figure>
  );
}
