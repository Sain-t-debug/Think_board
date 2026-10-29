import { useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import ConfirmDialog from "./ConfirmDialog";

const NoteCard = ({ note, setNotes, index = 0 }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = note._id ?? note.id;
  const title = note.title?.trim() || "Untitled note";

  const restoreNote = async () => {
    try {
      const res = await api.post("/notes", {
        title: note.title ?? "",
        content: note.content ?? "",
      });

      if (res.data?._id) {
        setNotes((prev) => [res.data, ...prev]);
      } else {
        const list = await api.get("/notes");
        setNotes(Array.isArray(list.data) ? list.data : []);
      }

      toast.success("Note restored");
    } catch (error) {
      console.error("Error restoring note", error);
      toast.error("Couldn't restore the note");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => (n._id ?? n.id) !== id));
      setConfirmOpen(false);

      toast.success(
        (t) => (
          <span className="flex items-center gap-3">
            <span>Note deleted</span>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                restoreNote();
              }}
              className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Undo
            </button>
          </span>
        ),
        { duration: 6000 },
      );
    } catch (error) {
      console.error("Error deleting note", error);
      setConfirmOpen(false);
      toast.error(
        error.response?.status === 429
          ? "Slow down a little before deleting"
          : "Couldn't delete the note",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <article
        className="card-lift animate-rise group relative flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/70 bg-base-200 p-5"
        style={{ animationDelay: `${(index ?? 0) * 45}ms` }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Full-card link sits beneath the content so the footer stays interactive. */}
        <Link
          to={`/note/${id}`}
          className="absolute inset-0 z-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-inset focus-visible:outline-none"
          aria-label={`Open note: ${title}`}
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <h3 className="line-clamp-2 font-display text-lg leading-snug text-balance transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>

          {note.content?.trim() ? (
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap text-base-content/65">
              {note.content}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-base-content/40 italic">
              Nothing written yet.
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-300/60 pt-4">
            <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-base-content/45 uppercase">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              <time dateTime={note.createdAt ?? undefined} className="truncate">
                {note.createdAt
                  ? formatDate(new Date(note.createdAt))
                  : "Undated"}
              </time>
            </span>

            <span className="pointer-events-auto flex shrink-0 items-center gap-0.5">
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full text-base-content/35 transition-colors duration-200 group-hover:text-primary/70"
              >
                <Pencil className="size-3.5" />
              </span>

              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="btn btn-ghost btn-circle btn-xs text-base-content/45 opacity-100 transition-all duration-200 hover:bg-error/10 hover:text-error focus-visible:opacity-100 sm:opacity-50 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                aria-label={`Delete note: ${title}`}
                title="Delete note"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          </div>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description="It will disappear from your board. You can undo for a few seconds afterwards, but not once the toast is gone."
      >
        <p className="font-mono text-[10px] tracking-[0.16em] text-base-content/40 uppercase">
          You're about to delete
        </p>
        <p className="mt-1 line-clamp-2 font-display text-base leading-snug text-base-content/90">
          {title}
        </p>
      </ConfirmDialog>
    </>
  );
};

export default NoteCard;
