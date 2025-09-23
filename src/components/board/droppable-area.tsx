"use client";

import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "~/lib/utils";

type DroppableAreaProps = {
  id: string;
  className?: string;
  children?: React.ReactNode;
};

export function DroppableArea({ id, className, children }: DroppableAreaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: "list", id }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });
    return () => cleanup();
  }, [id]);

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-[20px] rounded-md transition-colors",
        isOver && "bg-primary/10 ring-primary/20 ring-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
