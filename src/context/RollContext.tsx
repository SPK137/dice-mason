import { createContext, useContext } from "react";

export interface RollContextType {
  hasResult: boolean;
  // Include the setter function in the type definition
  setHasResult: (value: boolean) => void;
}

export const RollContext = createContext<RollContextType | undefined>({hasResult: false, setHasResult: (value: boolean) => {}});

export function useRollContext() {
  const context = useContext(RollContext);
  if (context === undefined) {
    throw new Error('useRollContext must be used within a StateProvider');
  }
  return context;
}