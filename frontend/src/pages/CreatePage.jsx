import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Skull } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setloading] = useState(false);
  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Both a title and some content are required");
      return;
    }

    setloading(true);
    try {
      await api.post("/notes", { title: title.trim(), content: content.trim() });
      toast.success("Note created");
      navigate("/");
    } catch (error) {
      console.error("Error creating note", error);

      if (error.response?.status === 429) {
        toast.error("Slow down — that's a lot of notes at once", {
          duration: 5000,
          icon: <Skull className="size-4 text-error" aria-hidden="true" />,
        });
      } else {
        toast.error("Couldn't create the note");
      }
    } finally {
      setloading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!loading) formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">
        <Link
          to="/"
          className="btn btn-ghost btn-sm -ml-2 gap-2 rounded-full text-sm font-normal text-base-content/55 hover:text-base-content"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to notes
        </Link>

        <header className="mt-10">
          <p className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-base-content/45 uppercase">
            New entry
            <span
              aria-hidden="true"
              className="h-px w-10 bg-primary/50"
            />
          </p>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Capture a thought.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-base-content/60 sm:text-base">
            It doesn&rsquo;t need to be finished. A title and a sentence are
            enough to start.
          </p>
        </header>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="mt-8 rounded-3xl border border-base-300/70 bg-base-200 p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="note-title"
              className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-base-content/50 uppercase"
            >
              Title
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="A name for this thought"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              autoFocus
              className="input w-full rounded-xl border-base-300/80 bg-base-100/70 focus:border-primary/50 focus:bg-base-100"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="note-content"
              className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-base-content/50 uppercase"
            >
              Content
            </label>
            <textarea
              id="note-content"
              placeholder="Write it down before it drifts away…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="textarea min-h-52 w-full resize-y rounded-xl border-base-300/80 bg-base-100/70 leading-relaxed focus:border-primary/50 focus:bg-base-100"
            />
            <p className="mt-2 text-right font-mono text-[10px] tracking-[0.12em] text-base-content/35">
              {content.length} characters
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-base-300/60 pt-6">
            <Link
              to="/"
              className="btn btn-ghost btn-sm rounded-full px-4 text-base-content/60 hover:text-base-content"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary gap-2 rounded-full px-6 shadow-sm"
            >
              {loading ? (
                <>
                  <span
                    className="loading loading-spinner loading-xs"
                    aria-hidden="true"
                  />
                  Creating…
                </>
              ) : (
                <>
                  Create note
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 flex items-center justify-end gap-2 text-xs text-base-content/45">
          <kbd className="kbd kbd-sm border-base-300/70 bg-base-200/60 font-mono text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>
          to save without reaching for the mouse
        </p>
      </main>
    </div>
  );
};

export default CreatePage;
