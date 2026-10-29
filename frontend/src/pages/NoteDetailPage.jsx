import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  FileQuestion,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { formatDate } from "../lib/utils";
import ConfirmDialog from "../components/ConfirmDialog";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error("Error fetching note", error);
        setNote(null);
        toast.error("Couldn't open that note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
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

  const handleSave = async () => {
    if (!note.title?.trim() || !note.content?.trim()) {
      toast.error("Please keep a title and some content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated");
      navigate("/");
    } catch (error) {
      console.error("Error saving note", error);
      toast.error("Couldn't save your changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
          <div className="flex items-center justify-between">
            <div className="skeleton h-8 w-32 rounded-full bg-base-300/50" />
            <div className="skeleton h-8 w-28 rounded-full bg-base-300/50" />
          </div>

          <div
            className="mt-10 rounded-3xl border border-base-300/70 bg-base-200 p-6 sm:p-10"
            aria-busy="true"
            aria-label="Loading note"
          >
            <div className="skeleton h-3 w-40 rounded bg-base-300/50" />
            <div className="skeleton mt-6 h-9 w-2/3 rounded-md bg-base-300/60" />
            <div className="mt-8 space-y-3 border-t border-base-300/60 pt-8">
              <div className="skeleton h-4 w-full rounded bg-base-300/45" />
              <div className="skeleton h-4 w-11/12 rounded bg-base-300/45" />
              <div className="skeleton h-4 w-10/12 rounded bg-base-300/45" />
              <div className="skeleton h-4 w-3/4 rounded bg-base-300/45" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-dvh flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-3xl border border-base-300/70 bg-base-200 px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-base-200 text-base-content/40">
              <FileQuestion className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-display text-2xl tracking-tight">
              Note not found
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-base-content/60">
              This note may have been deleted, or the link has gone stale.
            </p>
            <Link
              to="/"
              className="btn btn-primary mt-7 gap-2 rounded-full px-5 shadow-sm"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to notes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="btn btn-ghost btn-sm -ml-2 gap-2 rounded-full text-sm font-normal text-base-content/55 hover:text-base-content"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to notes
          </Link>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="btn btn-ghost btn-sm gap-2 rounded-full text-error/80 hover:bg-error/10 hover:text-error"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete note
          </button>
        </div>

        <article className="mt-6 rounded-3xl border border-base-300/70 bg-base-200 p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-base-content/45 uppercase">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <time dateTime={note.createdAt ?? undefined}>
                {note.createdAt
                  ? formatDate(new Date(note.createdAt))
                  : "Undated"}
              </time>
            </span>
            <span aria-hidden="true" className="text-base-content/25">
              ·
            </span>
            <span className="badge badge-sm h-5 gap-1.5 rounded-full border-primary/25 bg-primary/10 px-2 font-mono text-[9px] tracking-[0.14em] text-primary uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
              Editing
            </span>
          </div>

          <label htmlFor="note-title" className="sr-only">
            Note title
          </label>
          <input
            id="note-title"
            type="text"
            placeholder="Untitled note"
            value={note.title ?? ""}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="mt-5 w-full border-0 bg-transparent p-0 font-display text-3xl tracking-tight outline-none placeholder:text-base-content/25 sm:text-4xl"
          />

          <div aria-hidden="true" className="mt-5 h-px bg-base-300/70" />

          <label htmlFor="note-content" className="sr-only">
            Note content
          </label>
          <textarea
            id="note-content"
            placeholder="Start writing…"
            value={note.content ?? ""}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            className="mt-5 min-h-[45vh] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-7 outline-none placeholder:text-base-content/25 sm:text-base"
          />

          <div className="sticky bottom-5 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300/70 bg-base-200/95 px-4 py-3 shadow-sm backdrop-blur">
            <p className="text-xs leading-relaxed text-base-content/50">
              Unsaved changes stay here until you save.
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary gap-2 rounded-full px-6 shadow-sm"
            >
              {saving ? (
                <>
                  <span
                    className="loading loading-spinner loading-xs"
                    aria-hidden="true"
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="size-4" aria-hidden="true" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </article>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description="This removes the note from your board for good. It can't be undone once you leave this page."
      >
        <p className="font-mono text-[10px] tracking-[0.16em] text-base-content/40 uppercase">
          You're about to delete
        </p>
        <p className="mt-1 line-clamp-2 font-display text-base leading-snug text-base-content/90">
          {note.title?.trim() || "Untitled note"}
        </p>
      </ConfirmDialog>
    </div>
  );
};

export default NoteDetailPage;
