"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, InfoIcon } from "lucide-react";

type StatusType = "success" | "error" | "warning" | "info";

interface StatusPopupProps {
  isOpen: boolean;
  type: StatusType;
  message: string;
  closeText?: string;
  onClose: () => void;
  autoCloseTime?: number;
}

export function StatusPopup({
  isOpen,
  type = "success",
  message,
  closeText = "Đóng",
  onClose,
  autoCloseTime = 0,
}: StatusPopupProps) {
  // Auto-close timer
  useEffect(() => {
    if (!isOpen || autoCloseTime <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseTime, onClose]);

  // Status-specific styles
  const statusConfig = {
    success: {
      icon: CheckCircle,
      gradient: "from-emerald-400 to-green-500",
      bgGradient:
        "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
      border: "border-emerald-200 dark:border-emerald-800/50",
      text: "text-emerald-800 dark:text-emerald-300",
      button:
        "bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600",
    },
    error: {
      icon: XCircle,
      gradient: "from-rose-400 to-red-500",
      bgGradient:
        "from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30",
      border: "border-rose-200 dark:border-rose-800/50",
      text: "text-rose-800 dark:text-rose-300",
      button:
        "bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600",
    },
    warning: {
      icon: AlertCircle,
      gradient: "from-amber-400 to-orange-500",
      bgGradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      border: "border-amber-200 dark:border-amber-800/50",
      text: "text-amber-800 dark:text-amber-300",
      button:
        "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600",
    },
    info: {
      icon: InfoIcon,
      gradient: "from-sky-400 to-blue-500",
      bgGradient:
        "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
      border: "border-sky-200 dark:border-sky-800/50",
      text: "text-sky-800 dark:text-sky-300",
      button:
        "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600",
    },
  };

  const config = statusConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-full max-w-md overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br ${config.bgGradient} shadow-xl`}
          >
            {/* Top decorative bar */}
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`}
            />

            <div className="p-6">
              {/* Icon and message */}
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                  className={`flex-shrink-0 rounded-full bg-gradient-to-br ${config.gradient} p-3 shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1"
                >
                  <h3 className={`text-lg font-semibold ${config.text}`}>
                    {type === "success" && "Success!"}
                    {type === "error" && "Error!"}
                    {type === "warning" && "Warning!"}
                    {type === "info" && "Information"}
                  </h3>
                  <p className={`mt-1 text-sm ${config.text} opacity-90`}>
                    {message}
                  </p>
                </motion.div>
              </div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex justify-end"
              >
                <button
                  onClick={onClose}
                  className={`px-5 py-2 rounded-lg text-sm font-medium text-white shadow-md transition-all duration-200 ${config.button}`}
                >
                  {closeText}
                </button>
              </motion.div>
            </div>

            {/* Progress bar for auto-close */}
            {autoCloseTime > 0 && (
              <motion.div
                initial={{ scaleX: 1, transformOrigin: "left" }}
                animate={{ scaleX: 0, transformOrigin: "left" }}
                transition={{ duration: autoCloseTime / 1000, ease: "linear" }}
                className={`h-1 w-full bg-gradient-to-r ${config.gradient}`}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
