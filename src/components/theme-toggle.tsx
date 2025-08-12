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

  if (!isMounted) return null;

  function toggleTheme() {
    setToggled(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      className="bg-background border-input relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border"
      onClick={toggleTheme}
      aria-label="Switch Theme"
      variant="outline"
    >
      <div
        className={`absolute inset-0 flex transform items-center justify-center transition-transform duration-300 ${
          toggled ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        }`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </div>
    </Button>
  );
}
