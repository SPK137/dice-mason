
interface RollResultProps {
    isRolling: boolean
    results: number[]
    total: number
}

export default function RollResult({
    isRolling = false,
    results = [],
    total = 0
}: RollResultProps) {

    return <>
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center max-w-screen w-full">
        {isRolling && (
          <p className="text-muted text-lg" style={{ fontFamily: "var(--font-display)" }}>
            Rolling...
          </p>
        )}
        {results.length > 0 && !isRolling && (
          <div className="flex flex-col items-center gap-2">
            {/* Individual results */}
            <div className="flex gap-3 flex-wrap justify-center">
              {results.map((r, i) => {
                const isMax = r === 6;
                const isMin = r === 1;
                const color = isMax ? "#4ADE80" : isMin ? "#F87171" : "#F0EEF8";
                return (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold opacity-75 "
                    style={{
                      background: "#1A1A24",
                      border: `2px solid ${color}`,
                      color,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {r}
                  </div>
                );
              })}
            </div>

            {/* Total */}
            {results.length > 1 && (
              <div className="flex flex-col items-center">
                <p className="text-muted text-xs tracking-widest uppercase">Total</p>
                <p
                  className="text-6xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "#F0EEF8" }}
                >
                  {total}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>;
}