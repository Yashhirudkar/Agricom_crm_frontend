/**
 * Utility for printing or saving export invoices to PDF without layout clipping
 * or blank-page issues in Chrome/Edge.
 *
 * Uses an isolated hidden iframe so that Next.js layout (overflow-hidden, fixed modals,
 * app shell headers/sidebars) never interferes with or clips the printed A4 document.
 */
export function printInvoiceElement(
  elementId = "export-invoice-print-area",
  documentTitle = "Export_Invoice"
) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const printTarget = document.getElementById(elementId);
  if (!printTarget) {
    console.warn(
      `[printInvoiceElement] Target element #${elementId} not found. Falling back to window.print()`
    );
    window.print();
    return;
  }

  // Remove any previously created print iframe
  const oldIframe = document.getElementById("export-invoice-print-iframe");
  if (oldIframe) {
    try {
      oldIframe.remove();
    } catch {
      // Ignore cleanup error
    }
  }

  // Create an invisible iframe
  const iframe = document.createElement("iframe");
  iframe.id = "export-invoice-print-iframe";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.zIndex = "-9999";

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!iframeDoc) {
    console.warn(
      "[printInvoiceElement] Could not access iframe document. Falling back to window.print()"
    );
    window.print();
    return;
  }

  // Gather all style elements and stylesheets from the main document
  const headStyles = [];
  document.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
    const html = node.outerHTML;
    // Skip any styles that declare visibility:hidden on body
    if (!html.includes("visibility: hidden") && !html.includes("visibility:hidden")) {
      headStyles.push(html);
    }
  });

  // Dedicated clean A4 print styles for the iframe
  const iframeCustomCss = `
    <style id="iframe-print-rules">
      @page {
        size: A4 portrait;
        margin: 8mm 10mm 8mm 10mm;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-family: Tahoma, Calibri, Arial, Helvetica, sans-serif;
      }
      body {
        display: block !important;
      }
      .export-invoice-a4 {
        width: 100% !important;
        max-width: 210mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        visibility: visible !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        min-height: 280mm !important;
      }
      .export-invoice-a4 * {
        visibility: visible !important;
      }
      .no-print, .print-hidden, button {
        display: none !important;
      }
    </style>
  `;

  // Write HTML to the iframe
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${documentTitle}</title>
        ${headStyles.join("\n")}
        ${iframeCustomCss}
      </head>
      <body>
        ${printTarget.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Give a small delay for iframe to render styles & SVG fonts, then trigger print
  const runPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error("[printInvoiceElement] Error during iframe print:", err);
      window.print();
    } finally {
      // Clean up the iframe after print dialog is closed
      setTimeout(() => {
        try {
          iframe.remove();
        } catch {
          // Ignore
        }
      }, 2000);
    }
  };

  setTimeout(runPrint, 350);
}

