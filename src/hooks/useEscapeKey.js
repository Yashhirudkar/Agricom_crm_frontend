"use client";

import { useEffect, useRef } from "react";

const escapeHandlers = [];

const handleKeyDown = (event) => {
  if (event.key !== "Escape" || event.defaultPrevented || escapeHandlers.length === 0) {
    return;
  }

  const topHandler = escapeHandlers[escapeHandlers.length - 1];
  event.preventDefault();
  event.stopImmediatePropagation();
  topHandler();
};

export function useEscapeKey(onEscape, enabled = true) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!enabled) return;

    const handler = () => onEscapeRef.current?.();
    escapeHandlers.push(handler);
    if (escapeHandlers.length === 1) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      const handlerIndex = escapeHandlers.indexOf(handler);
      if (handlerIndex !== -1) escapeHandlers.splice(handlerIndex, 1);
      if (escapeHandlers.length === 0) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [enabled]);
}
