"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onUnlock: (pin: string) => boolean;
  onClose: () => void;
}

export function PinModal({ onUnlock, onClose }: Props) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    setError(false);

    if (digit && i < 3) {
      inputRefs.current[i + 1]?.focus();
    }

    if (digit && i === 3) {
      const pin = next.join("");
      const ok = onUnlock(pin);
      if (!ok) {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setShake(false);
          setDigits(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const prev = [...digits];
      prev[i - 1] = "";
      setDigits(prev);
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={
            shake
              ? { x: [-8, 8, -6, 6, -3, 3, 0], opacity: 1, scale: 1 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          exit={{ scale: 0.92, opacity: 0 }}
          transition={
            shake
              ? { duration: 0.5 }
              : { type: "spring", stiffness: 300, damping: 25 }
          }
          className="pointer-events-auto w-full max-w-xs rounded-2xl bg-white p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
              <Lock className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <h2 className="font-korean text-lg font-bold text-black">관리자 PIN 입력</h2>
            <p className={cn(
              "font-korean text-sm transition-opacity",
              error ? "text-red-500 opacity-100" : "opacity-0"
            )}>
              PIN이 올바르지 않습니다
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={2}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "h-14 w-14 rounded-xl border-2 text-center font-korean text-2xl font-bold text-black caret-transparent focus:outline-none transition-colors",
                  error
                    ? "border-red-400 bg-red-50"
                    : d
                    ? "border-black bg-zinc-50"
                    : "border-zinc-200 focus:border-black",
                )}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl py-3 font-korean text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            취소
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
