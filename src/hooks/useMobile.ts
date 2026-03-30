import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export type DeviceTier = "mobile" | "tablet" | "desktop";

export interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  tier: DeviceTier;
  screenWidth: number;
  screenHeight: number;
}

export function useMobile(): MobileInfo {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const [screenHeight, setScreenHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 1080
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < MOBILE_BREAKPOINT;
  const isTablet = screenWidth >= MOBILE_BREAKPOINT && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  const tier: DeviceTier = isMobile
    ? "mobile"
    : isTablet
    ? "tablet"
    : "desktop";

  return {
    isMobile,
    isTablet,
    isDesktop,
    tier,
    screenWidth,
    screenHeight,
  };
}