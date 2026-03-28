"use client";

import * as THREE from "three";
import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as CANNON from "cannon-es";
import { usePhysicsWorld } from "@/hooks/usePhysicsWorld";
import { createD6Body, throwD6Body } from "@/lib/dicePhysics";
import D6Mesh from "./D6Mesh";
import PhysicsRunner from "./PhysicsRunner";
import { useMultiDieSleep } from "@/hooks/useDieSleep";
import { useKeyboardRoll } from "@/hooks/useKeyboardRoll";
import { readAllD6Results, readD6TopFace } from "@/lib/faceReader";

const STAGGER_MS = 80; // delay between each die throw

export default function DiceTray() {
  const worldRef = usePhysicsWorld();
  const [dieBodies, setDieBodies] = useState<CANNON.Body[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [diceCount, setDiceCount] = useState(2); // how many d6s to rol

  // Fire when all dice have settled
  useMultiDieSleep(dieBodies, useCallback((bodies: CANNON.Body[]) => {
    const values = readAllD6Results(bodies);
    setResults(values);
    setIsRolling(false);
  }, []));

  const handleRoll = useCallback(() => {
    if (!worldRef.current) return;

    setResults([]);
    setIsRolling(true);

    // Clear existing dice
    dieBodies.forEach((body) => worldRef.current!.removeBody(body));

    // Create and stagger-throw dice
    const newBodies: CANNON.Body[] = [];
    for (let i = 0; i < diceCount; i++) {
      setTimeout(() => {
        if (!worldRef.current) return;
        const body = createD6Body(worldRef.current);
        throwD6Body(body);
        newBodies.push(body);
        if (newBodies.length === diceCount) {
          setDieBodies([...newBodies]);
        }
      }, i * STAGGER_MS);
    }
  }, [worldRef, dieBodies, diceCount]);

  useKeyboardRoll(handleRoll);

  const total = results.reduce((sum, r) => sum + r, 0);


  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 8, 8], fov: 45 }}
        style={{ background: "#0F0F14" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#9B7EFF" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1A1A24" roughness={0.9} />
        </mesh>

        <Grid
          position={[0, 0.01, 0]}
          args={[10, 10]}
          cellColor="#2E2E42"
          sectionColor="#2E2E42"
          fadeDistance={12}
        />

        {worldRef.current && <PhysicsRunner worldRef={worldRef} />}

        {dieBodies.map((body, i) => (
          <D6Mesh key={i} physicsBody={body} />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* Results Display */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        {isRolling && (
          <p className="text-muted text-lg" style={{ fontFamily: "var(--font-display)" }}>
            Rolling...
          </p>
        )}
        {results.length > 0 && !isRolling && (
          <div className="flex flex-col items-center gap-2">
            {/* Individual results */}
            <div className="flex gap-3">
              {results.map((r, i) => {
                const isMax = r === 6;
                const isMin = r === 1;
                const color = isMax ? "#4ADE80" : isMin ? "#F87171" : "#F0EEF8";
                return (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
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

      {/* Controls */}
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
            onClick={() => setDiceCount((c) => Math.min(10, c + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary text-lg"
            style={{ background: "#1A1A24", border: "1px solid #2E2E42" }}
          >
            +
          </button>
        </div>

        {/* Roll button */}
        <button
          onClick={handleRoll}
          className="px-8 py-4 rounded-xl text-primary text-lg tracking-wide transition-all"
          style={{
            background: "#7C5CEF",
            fontFamily: "var(--font-display)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#9B7EFF")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5CEF")}
        >
          {isRolling ? "Rolling..." : `Roll ${diceCount}d6`}
        </button>

        <p className="text-muted text-xs tracking-widest">
          SPACE or R to roll
        </p>
      </div>
    </div>
  );
}