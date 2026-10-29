import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden bg-base-100 text-base-content">
      {/* Decorative paper atmosphere — never intercepts clicks or reads to AT. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/[0.09] blur-[130px]" />
        <div className="absolute -right-40 -bottom-56 h-[32rem] w-[32rem] rounded-full bg-accent/[0.07] blur-[140px]" />
        <div className="absolute top-1/3 -left-48 h-[28rem] w-[28rem] rounded-full bg-secondary/[0.08] blur-[130px]" />
        <div className="bg-grain absolute inset-0 opacity-60" />
      </div>

      <div className="min-h-dvh">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
      </div>

      <Toaster
        position="top-center"
        gutter={10}
        containerClassName="toast-appear"
        toastOptions={{
          duration: 3500,
          style: {
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            border: "1px solid var(--color-base-300)",
            borderRadius: "14px",
            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
            fontSize: "14px",
            lineHeight: "1.45",
            padding: "10px 14px",
            boxShadow: "0 18px 40px -26px rgb(0 0 0 / 0.65)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--color-base-100)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-error)",
              secondary: "var(--color-base-100)",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
