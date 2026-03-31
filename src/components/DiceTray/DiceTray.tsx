"use client";

import { useState, useCallback } from "react";
import * as CANNON from "cannon-es";
import { usePhysicsWorld } from "@/hooks/usePhysicsWorld";
import { createD6Body, throwD6Body } from "@/lib/dicePhysics";
import { useMultiDieSleep } from "@/hooks/useDieSleep";
import { useKeyboardRoll } from "@/hooks/useKeyboardRoll";
import { readAllD6Results } from "@/lib/faceReader";
import { useRollContext } from "@/context/RollContext";
import RollResult from "./RollResult";
import { useMobile } from "@/hooks/useMobile";
import { getRenderConfig } from "@/lib/renderConfig";
import DiceTrayCanvas from "./DiceTrayCanvas";
import DiceTrayControl from "./Control/DiceTrayControl";

const STAGGER_MS = 80; // delay between each die throw

export default function DiceTray() {
  const { hasResult, setHasResult } = useRollContext();

  const worldRef = usePhysicsWorld();
  const { tier } = useMobile();
  const renderConfig = getRenderConfig(tier);

  const [dieBodies, setDieBodies] = useState<CANNON.Body[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [diceCount, setDiceCount] = useState(6); // how many d6s to rol

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
    if (!hasResult) setHasResult(true);

    // Clear existing dice
    dieBodies.forEach((body) => worldRef.current!.removeBody(body));

    // Create and stagger-throw dice
    const newBodies: CANNON.Body[] = [];
    for (let i = 0; i < diceCount; i++) {
      setTimeout(() => {
        if (!worldRef.current) return;
        const body = createD6Body(worldRef.current, renderConfig.diceScale);
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
      <DiceTrayCanvas renderConfig={renderConfig} worldRef={worldRef} dieBodies={dieBodies} />
      <RollResult isRolling = {isRolling} results = {results} total = {total}/>
      <DiceTrayControl diceCount = {diceCount} setDiceCount = {setDiceCount} handleRoll = {handleRoll} isRolling = {isRolling} renderConfig = {renderConfig}/>
    </div>
  );
}