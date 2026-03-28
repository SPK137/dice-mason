import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";

export function useMultiDieSleep(
  bodies: CANNON.Body[],
  onAllSleep: (bodies: CANNON.Body[]) => void
) {
  const sleepCountRef = useRef(0);

  useEffect(() => {
    if (bodies.length === 0) return;

    sleepCountRef.current = 0;

    const handlers: Array<{ body: CANNON.Body; handler: () => void }> = [];

    bodies.forEach((body) => {
      const handler = () => {
        sleepCountRef.current += 1;
        if (sleepCountRef.current === bodies.length) {
          onAllSleep(bodies);
        }
      };
      body.addEventListener("sleep", handler);
      handlers.push({ body, handler });
    });

    return () => {
      handlers.forEach(({ body, handler }) => {
        body.removeEventListener("sleep", handler);
      });
    };
  }, [bodies, onAllSleep]);
}