"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

const ToastOnMount = ({
  type = "info",
  message,
  id,
  once = true,
}) => {
  useEffect(() => {
    if (!message) return;

    const storageKey = id ? `salonbook-toast:${id}` : "";

    if (once && storageKey && typeof window !== "undefined") {
      try {
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // sessionStorage may be unavailable in private browsing modes.
      }
    }

    const notify = toast[type] || toast.info;
    notify(message);
  }, [type, message, id, once]);

  return null;
};

export default ToastOnMount;
