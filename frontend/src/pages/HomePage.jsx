import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import { getGreeting } from "../lib/utils";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"];

const requestNotes = async () => {
  const res = await api.get("/notes");
  return Array.isArray(res.data) ? res.data : [];
};

const reportLoadFailure = (error, setRateLimited) => {
  console.error("Error fetching notes", error);

  if (error.response?.status === 429) {
    setRateLimited(true);
  } else {
    toast.error("Couldn't load your notes");
  }
};

const HomePage = () => {
  const [isRateLimited, setRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const retry = async () => {
    setRateLimited(false);
    setLoading(true);
    try {
      const data = await requestNotes();
      setNotes(data);
      setRateLimited(false);
    } catch (error) {
      reportLoadFailure(error, setRateLimited);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await requestNotes();
        if (!active) return;
        setNotes(data);
        setRateLimited(false);
      } catch (error) {
        if (!active) return;
        reportLoadFailure(error, setRateLimited);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const greeting = getGreeting();
  const noteCount = notes.length;
  const showEmptyState = !loading && !isRateLimited && noteCount === 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 sm:px-6 lg:px-8">
        <section className="bg-grain relative -mx-4 mt-2 rounded-b-[2rem] px-4 pt-10 pb-8 sm:-mx-6 sm:px-6 sm:pt-14 sm:pb-10 lg:-mx-8 lg:px-8">
          <p className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-base-300/80 bg-base-200/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-base-content/55 uppercase backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Your workspace
          </p>

          <h1 className="animate-rise mt-6 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            {greeting}, thinker.
          </h1>

          <p
            className="animate-rise mt-4 max-w-2xl text-base leading-relaxed text-pretty text-base-content/60 sm:text-lg"
            style={{ animationDelay: "80ms" }}
          >
            {noteCount > 0
              ? `${noteCount} ${noteCount === 1 ? "note" : "notes"}, captured and counting.`
              : "Every idea starts as a scribble. Start yours."}
          </p>
        </section>

        {isRateLimited ? (
          <div className="mt-10">
            <RateLimitedUI onRetry={retry} />
          </div>
        ) : (
          <>
            {loading && (
              <div
                className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                aria-busy="true"
                aria-label="Loading notes"
              >
                {SKELETON_KEYS.map((key) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-base-300/70 bg-base-200 p-5"
                  >
                    <div className="skeleton h-5 w-3/4 rounded-md bg-base-300/60" />
                    <div className="mt-4 space-y-2.5">
                      <div className="skeleton h-3 w-full rounded bg-base-300/50" />
                      <div className="skeleton h-3 w-11/12 rounded bg-base-300/50" />
                      <div className="skeleton h-3 w-4/5 rounded bg-base-300/50" />
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-base-300/60 pt-4">
                      <div className="skeleton h-3 w-24 rounded bg-base-300/50" />
                      <div className="skeleton size-6 rounded-full bg-base-300/50" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showEmptyState && (
              <div className="mt-10">
                <NotesNotFound />
              </div>
            )}

            {!loading && noteCount > 0 && (
              <>
                <div className="mt-10 flex items-end justify-between gap-4 border-b border-base-300/60 pb-4">
                  <h2 className="font-mono text-[10px] tracking-[0.22em] text-base-content/45 uppercase">
                    All notes
                  </h2>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-base-content/35 uppercase">
                    {noteCount} {noteCount === 1 ? "entry" : "entries"}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map((note, index) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      setNotes={setNotes}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-base-300/70">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs text-base-content/50">
            <Sparkles className="size-3.5" aria-hidden="true" />
            ThinkBoard — built for slow thinking.
          </p>
          <p className="font-mono text-[10px] tracking-[0.18em] text-base-content/35 uppercase">
            v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
