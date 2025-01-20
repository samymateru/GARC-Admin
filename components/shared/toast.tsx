// Toast.tsx
"use client";

import React from "react";
import { Toaster, toast } from "sonner";

export const showToast = (
  message?: string,
  variant?: "success" | "error" | "warning"
) => {
  switch (variant) {
    case "success":
      toast.success(message, {
        style: {
          backgroundColor: "white",
          color: "green",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
        },
      });
      break;
    case "error":
      toast.error(message, {
        style: {
          backgroundColor: "white",
          color: "red",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
        },
      });
      break;
    case "warning":
      toast(message, {
        style: {
          backgroundColor: "white",
          color: "orange",
          fontSize: "15px",
          fontWeight: "bold",
          height: "45px",
        },
      });
      break;
    default:
      toast(message);
  }
};

export const ToastProvider: React.FC<{
  alignment?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}> = ({ alignment = "top-right" }) => {
  return <Toaster position={alignment} />;
};
