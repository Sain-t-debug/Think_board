import { useEffect, useId, useRef } from "react";
import { Trash2, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Delete note",
  busyLabel = "Deleting…",
  busy = false,
  onCancel,
  onConfirm,
  children,
}) => {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // Land on the safe choice, not the destructive one.
      requestAnimationFrame(() => cancelRef.current?.focus());
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const requestClose = () => {
    if (!busy) onCancel?.();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // Keep Esc from dismissing the dialog mid-request.
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        // Clicks on the backdrop target the dialog itself.
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      <div className="modal-box max-w-md rounded-3xl border border-base-300/70 bg-base-200 p-0 shadow-2xl ring-1 ring-base-300/40">
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-error/10 text-error ring-1 ring-error/25">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="font-display text-xl leading-snug tracking-tight text-balance"
              >
                {title}
              </h2>
              <p
                id={descriptionId}
                className="mt-2 text-sm leading-relaxed text-pretty text-base-content/65"
              >
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={requestClose}
              disabled={busy}
              className="btn btn-ghost btn-circle btn-sm -mt-1 -mr-1 text-base-content/45 hover:text-base-content"
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {children ? (
            <div className="mt-5 rounded-xl border border-base-300/70 bg-base-100/60 px-4 py-3">
              {children}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-base-300/60 pt-5 sm:flex-row sm:justify-end">
            <button
              ref={cancelRef}
              type="button"
              onClick={requestClose}
              disabled={busy}
              className="btn btn-ghost rounded-full px-5 text-base-content/65 hover:text-base-content"
            >
              Keep note
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="btn btn-error gap-2 rounded-full px-5"
            >
              {busy ? (
                <>
                  <span
                    className="loading loading-spinner loading-xs"
                    aria-hidden="true"
                  />
                  {busyLabel}
                </>
              ) : (
                <>
                  <Trash2 className="size-4" aria-hidden="true" />
                  {confirmLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
