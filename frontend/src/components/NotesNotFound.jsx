import { Link } from "react-router";
import { NotebookPen } from "lucide-react";

const NotesNotFound = () => {
  return (
    <div className="mx-auto max-w-md">
      <div className="bg-grain flex flex-col items-center rounded-3xl border border-dashed border-base-300 bg-base-200/40 px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-base-100 text-primary shadow-sm ring-1 ring-base-300/70">
          <NotebookPen className="size-6" aria-hidden="true" />
        </span>

        <h2 className="mt-6 font-display text-2xl leading-tight text-balance sm:text-[1.7rem]">
          Note Created will Appear Hear
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-pretty text-base-content/60">
          ThinkBoard is quiet until you fill it. Start with a single sentence —
          the rest tends to follow.
        </p>

        <Link
          to="/create"
          className="btn btn-primary mt-8 gap-2 rounded-full px-5 shadow-sm"
        >
          <NotebookPen className="size-4" aria-hidden="true" />
          Write your first note
        </Link>
      </div>
    </div>
  );
};

export default NotesNotFound;
