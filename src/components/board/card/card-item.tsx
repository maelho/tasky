"use client";

import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardSelect } from "~/server/db/schema";
import { useAtom } from "jotai";
import { Calendar, MessageSquare } from "lucide-react";

import { cn } from "~/lib/utils";
import { onOpenAtom } from "~/hooks/use-card-modal";

type CardItemProps = {
  data: CardSelect;
  isDragOverlay?: boolean;
};

export function CardItem({ data, isDragOverlay = false }: CardItemProps) {
  const [, onOpen] = useAtom(onOpenAtom);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current || isDragOverlay) return;
    const el = ref.current;
    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "card", id: data.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "card", id: data.id }),
    });
    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [data.id, isDragOverlay]);

  if (isDragOverlay) {
    return (
      <div
        className="bg-card border-primary/20 rotate-2 transform cursor-grabbing rounded-lg border-2 px-4 py-3 text-sm shadow-xl backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="text-foreground line-clamp-3 leading-relaxed font-medium">
          {data.title}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(data.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(data.id);
        }
      }}
      aria-label={`Card: ${data.title}. Press Enter or Space to open, use arrow keys to move`}
      aria-describedby={`card-${data.id}-description`}
      className={cn(
        "group bg-card hover:bg-card/90 border-border/50 hover:border-border cursor-grab rounded-lg border p-4 text-sm transition-all duration-200 hover:shadow-md",
        "focus:ring-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "hover:-translate-y-0.5 hover:shadow-lg",
        isDragging && "scale-105 rotate-1 cursor-grabbing opacity-60 shadow-xl",
      )}
    >
      <div className="space-y-3">
        <div className="text-foreground group-hover:text-primary/90 line-clamp-4 leading-relaxed font-medium transition-colors">
          {data.title}
        </div>

        {data.description && (
          <div className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            {data.description}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.description && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>1</span>
              </div>
            )}

            {data.createdAt && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id={`card-${data.id}-description`} className="sr-only">
        Draggable card. Use mouse to drag or keyboard to navigate and press
        Enter to open.
      </div>
    </div>
  );
}

export default CardItem;
