"use client";

import dynamic from "next/dynamic";

const DiceTray = dynamic(() => import("./DiceTray"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <p className="text-muted" style={{ fontFamily: "var(--font-display)" }}>
        Conjuring the tray...
      </p>
    </div>
  ),
});

//Client Component Wrapper
export default function DiceTrayWrapper() {
  return <DiceTray />;
}