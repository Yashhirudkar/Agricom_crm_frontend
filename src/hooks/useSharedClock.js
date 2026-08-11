import { useState, useEffect } from "react";

/**
 * Shared 1-second clock hook.
 * Instead of N components creating N separate setInterval timers,
 * all active subscribers share a SINGLE global setInterval instance.
 * When subscriber count drops to 0, the timer automatically stops.
 */
const listeners = new Set();
let globalTimer = null;

function notifyListeners() {
  listeners.forEach((callback) => callback());
}

export function useSharedClock(enabled = true) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const callback = () => setTick((n) => n + 1);
    listeners.add(callback);

    if (listeners.size === 1 && !globalTimer) {
      globalTimer = setInterval(notifyListeners, 1000);
    }

    return () => {
      listeners.delete(callback);
      if (listeners.size === 0 && globalTimer) {
        clearInterval(globalTimer);
        globalTimer = null;
      }
    };
  }, [enabled]);
}
