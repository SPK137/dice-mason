"use client";

import { useFrame } from "@react-three/fiber";
import * as CANNON from "cannon-es";
import { RefObject } from "react";

interface PhysicsRunnerProps {
  worldRef: RefObject<CANNON.World | null>;
  physicsFps?: number;
}

export default function PhysicsRunner({ worldRef, physicsFps = 60 }: PhysicsRunnerProps) {
  const fixedStep = 1 / physicsFps;
  useFrame((_, delta) => {
    if (!worldRef.current) return;
    // Cap delta to avoid large jumps when tab is backgrounded
    worldRef.current.step(fixedStep, Math.min(delta, 0.1), 3);
  });

  return null;
}