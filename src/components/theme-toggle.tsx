"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [toggled, setToggled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    if (toggled) {
      timeoutId = setTimeout(() => {
        setToggled(false);
      }, 200);
    }
    return () => clearTimeout(timeoutId);
  }, [toggled]);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0 relative overflow-hidden rounded-full" disabled>
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </Button>
    );
  }

  function toggleTheme() {
    setToggled(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0 relative overflow-hidden rounded-md border border-border/40 hover:border-border hover:scale-105 transition-all duration-200"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon className="h-4 w-4 text-foreground" />
        ) : (
          <SunIcon className="h-4 w-4 text-foreground" />
        )}
      </div>

      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-all duration-300 ${
          toggled ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-4 w-4 text-foreground" />
        ) : (
          <MoonIcon className="h-4 w-4 text-foreground" />
        )}
      </div>
    </Button>
  );
}
