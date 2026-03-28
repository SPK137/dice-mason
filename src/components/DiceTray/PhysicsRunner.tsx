"use client";

import { useFrame } from "@react-three/fiber";
import * as CANNON from "cannon-es";
import { RefObject } from "react";

interface PhysicsRunnerProps {
  worldRef: RefObject<CANNON.World | null>;
}

export default function PhysicsRunner({ worldRef }: PhysicsRunnerProps) {
  useFrame((_, delta) => {
    if (!worldRef.current) return;
    // Cap delta to avoid large jumps when tab is backgrounded
    worldRef.current.step(1 / 60, Math.min(delta, 0.1), 3);
  });

  return null;
}