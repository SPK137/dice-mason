"use client"
import DiceTrayWrapper from "@/components/DiceTray";
import { RollContext } from "@/context/RollContext";
import { useState } from "react";

export default function Home() {
  const [hasResult, setHasResult] = useState(false);
  return (
    <RollContext.Provider value={{hasResult, setHasResult}}>
      <main className="w-screen h-screen bg-background">
        <DiceTrayWrapper />
      </main>
      <nav className="hidden lg:flex flex-col items-left justify-center gap-1 pl-8 absolute top-8 left-0 w-screen ">
        <h1 className="text-4xl text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Dicemason
        </h1>
        <p className="text-muted">Craft and roll your dream dice</p>
      </nav>
      { !hasResult && 
        <nav className="flex lg:hidden flex-col items-center justify-center gap-1 absolute top-8 left-0 w-screen ">
          <h1 className="text-4xl text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Dicemason
          </h1>
          <p className="text-muted">Craft and roll your dream dice</p>
        </nav>
      }
    </RollContext.Provider>
  );
}