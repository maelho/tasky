"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "~/lib/utils";

type DroppableAreaProps = {
  id: string;
  className?: string;
  children?: React.ReactNode;
};

export function DroppableArea({ id, className, children }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: "list",
    },
  });

  return (
    <div
      ref={setNodeRef}
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
