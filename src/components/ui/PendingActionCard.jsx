/**
 * PendingActionCard
 * -----------------
 * Reusable wrapper that renders an animated red "marching-ants" dashed border
 * around any section that is awaiting a required user action.
 *
 * Animation is defined in globals.css (.pending-action-card / ::before).
 * Pass `active={false}` once the action is fulfilled to drop back to the
 * default border style without any layout shift.
 *
 * Props
 * -----
 * @param {boolean}   active      – true  → animated red border (default)
 *                                  false → plain border (action fulfilled)
 * @param {string}    className   – extra Tailwind classes forwarded to the wrapper
 * @param {ReactNode} children    – slot content
 */
export default function PendingActionCard({ active = true, className = "", children }) {
  if (!active) {
    return (
      <div className={`rounded-2xl border border-slate-200/90 bg-white ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`pending-action-card ${className}`}>
      {children}
    </div>
  );
}

