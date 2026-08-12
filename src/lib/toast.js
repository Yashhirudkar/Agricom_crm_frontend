"use client";

function getSonnerToast() {
  if (typeof window !== "undefined") {
    try {
      return require("sonner").toast;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export const toast = {
  success: (msg, opts) => {
    const st = getSonnerToast();
    if (st) return st.success(msg, opts);
    console.log("✔ [Toast Success]", msg);
  },
  error: (msg, opts) => {
    const st = getSonnerToast();
    if (st) return st.error(msg, opts);
    console.error("✖ [Toast Error]", msg);
  },
  info: (msg, opts) => {
    const st = getSonnerToast();
    if (st) return st.info(msg, opts);
    console.info("ℹ [Toast Info]", msg);
  },
  warning: (msg, opts) => {
    const st = getSonnerToast();
    if (st) return st.warning(msg, opts);
    console.warn("⚠️ [Toast Warning]", msg);
  },
};

export default toast;
