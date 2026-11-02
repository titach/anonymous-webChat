import { useEffect, useState } from "react";

// Match every verdict to the exact current draft: late responses never enable a new text.
function useDraftCheck(text, scope, request, enabled, type) {
  const value = text.trim();
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!enabled || !value) return;
    let active = true;
    const timer = setTimeout(async () => {
      const reply = await request(type, { scope, text: value });
      if (active)
        setResult({
          value,
          retry,
          status: !reply.ok
            ? "error"
            : type === "sentiment"
              ? "ready"
              : reply.allowed
                ? "allowed"
                : "blocked",
          message: reply.message,
          negative: reply.ok && reply.negative === true,
        });
    }, 650);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [value, scope, request, enabled, retry, type]);
  const current =
    enabled && result?.value === value && result?.retry === retry
      ? result
      : null;
  const status = !value || !enabled ? "idle" : current?.status || "checking";
  return {
    status,
    allowed: status === "allowed",
    message: current?.message || "",
    negative: current?.negative === true,
    retry: () => setRetry((n) => n + 1),
  };
}

export function useModeration(text, scope, request, enabled = true) {
  const moderation = useDraftCheck(text, scope, request, enabled, "moderate");
  const sentiment = useDraftCheck(text, scope, request, enabled, "sentiment");
  // Only the bullying verdict controls the action buttons, never SSENSE.
  return { ...moderation, sentiment };
}
