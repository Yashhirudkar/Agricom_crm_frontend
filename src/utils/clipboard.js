/**
 * Cross-environment clipboard copy utility.
 * Falls back to execCommand for HTTP (non-secure) contexts where
 * the navigator.clipboard API is unavailable.
 *
 * @param {string} text - The text to copy to the clipboard.
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-secure contexts (HTTP) or unsupported browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!success) throw new Error("execCommand copy failed");
  }
}

