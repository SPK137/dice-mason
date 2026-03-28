import DiceTrayWrapper from "@/components/DiceTray";

export default function Home() {
  return (
    <>
      <main className="w-screen h-screen bg-background">
        <DiceTrayWrapper />
      </main>
      <nav className="absolute top-8 left-0 w-screen flex flex-col items-left justify-center gap-1 pl-8">
        <h1 className="text-4xl text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Dicemason
        </h1>
        <p className="text-muted">Craft and roll your dream dice</p>
      </nav>
    </>
  );
}