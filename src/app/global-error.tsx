"use client";

import { useEffect } from "react";

/**
 * Catches failures in the root layout itself (where the normal error page cannot render).
 * Kept dependency-free: the providers it would otherwise use are what failed.
 */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[UNHANDLED_UI_ERROR]", { operation: "root-layout", digest: error.digest }, error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#F4F7FB", fontFamily: "system-ui, sans-serif", color: "#182338" }}>
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>The examination centre could not start</h1>
          <p style={{ fontSize: 13.5, color: "#667085", lineHeight: 1.5 }}>
            Something went wrong while loading. Any exam answers already given are saved on this device.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 16, height: 44, padding: "0 20px", borderRadius: 12, border: 0, background: "#2468B2", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
