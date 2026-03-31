import { SetStateAction } from "react";
import * as CANNON from "cannon-es";
import { RenderConfig } from "@/lib/renderConfig";

interface DiceTrayControlProps {
    diceCount: number;
    setDiceCount: (value: SetStateAction<number>) => void;
    handleRoll: () => void;
    isRolling: boolean;
    renderConfig: RenderConfig;
}

export default function DiceTrayControl({
    diceCount,
    setDiceCount,
    handleRoll,
    isRolling,
    renderConfig
}: DiceTrayControlProps) {
    return <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Dice count selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDiceCount((c) => Math.max(1, c - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary text-lg"
            style={{ background: "#1A1A24", border: "1px solid #2E2E42" }}
          >
            −
          </button>
          <span
            className="text-primary w-24 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {diceCount}d6
          </span>
          <button
            onClick={() => setDiceCount((c) => Math.min(12, c + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary text-lg"
            style={{ background: "#1A1A24", border: "1px solid #2E2E42" }}
          >
            +
          </button>
        </div>

        {/* Roll button */}
        <button
          onClick={handleRoll}
          className="px-8 py-4 rounded-xl text-primary text-lg tracking-wide transition-all opacity-90 hover:bg-accent-hover bg-accent"
          style={{
            // background: "#7C5CEF",
            fontFamily: "var(--font-display)",
          }}
        >
          {isRolling ? "Rolling..." : `Roll ${diceCount}d6`}
        </button>

        { !renderConfig.isMobile && 
            <p className="text-muted text-xs tracking-widest">
              SPACE or R to roll
            </p>
        }
      </div>
    </>
}