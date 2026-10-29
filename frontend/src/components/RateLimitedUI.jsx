import { TriangleAlert } from "lucide-react";

const RateLimitedUI = ({ onRetry }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 sm:gap-4 sm:p-5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
        <TriangleAlert className="size-5" aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <h2 className="font-display text-lg leading-snug text-balance">
          You&rsquo;re writing faster than we can keep up
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-pretty text-base-content/70">
          Give it a moment before trying again — your notes are safe and
          nothing has been lost.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-[10px] tracking-[0.14em] text-base-content/45 uppercase">
            HTTP 429 · rate limited
          </p>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-ghost btn-xs rounded-full text-base-content/70 hover:text-base-content"
            >
              Try again
            </button>
          ) : (
            <span className="font-mono text-[10px] tracking-[0.14em] text-base-content/40 uppercase">
              Retry in a few seconds
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
