import { useEffect } from "react";

export function useKeyboardRoll(onRoll: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space or R to roll
      if (e.code === "Space" || e.code === "KeyR") {
        e.preventDefault();
        onRoll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRoll]);
}