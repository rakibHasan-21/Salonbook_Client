"use client";

import { AlertTriangle, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

const ConfirmToast = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone,
  closeToast,
  resolve,
}) => {
  const finish = (value) => {
    resolve(value);

    if (typeof closeToast === "function") {
      closeToast();
    }
  };

  const Icon = tone === "danger" ? AlertTriangle : HelpCircle;

  return (
    <div className="w-[320px] max-w-full">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
            tone === "danger"
              ? "bg-rose-50 text-rose-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="size-5" />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-5 text-gray-600">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => finish(false)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {cancelLabel || "Cancel"}
        </button>

        <button
          type="button"
          onClick={() => finish(true)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition ${
            tone === "danger"
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {confirmLabel || "Confirm"}
        </button>
      </div>
    </div>
  );
};

export const confirmAction = ({
  title,
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
}) =>
  new Promise((resolve) => {
    let settled = false;

    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    toast(
      <ConfirmToast
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        tone={tone}
        resolve={settle}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center",
        onClose: () => settle(false),
      }
    );
  });
