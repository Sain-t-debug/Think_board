import { Link } from "react-router";
import { Plus, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/80 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-offset-4"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral text-neutral-content shadow-sm transition-transform duration-300 group-hover:-rotate-3">
            <Sparkles className="size-4.5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-accent ring-2 ring-base-100"
            />
          </span>

          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-xl leading-none tracking-tight">
              ThinkBoard
            </span>
            <span className="mt-1 hidden text-[10px] font-medium tracking-[0.22em] text-base-content/45 uppercase sm:block">
              notes &amp; ideas
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            to="/create"
            className="btn btn-primary btn-sm gap-2 rounded-full shadow-sm"
            aria-label="Create a new note"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">New Note</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
