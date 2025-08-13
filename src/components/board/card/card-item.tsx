"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: data.id,
    data: {
      type: "card",
      card: data,
    },
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragOverlay) {
    return (
      <div
        className="bg-card border-2 border-primary/20 rotate-2 transform cursor-grabbing rounded-lg px-4 py-3 text-sm shadow-xl backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="font-medium text-foreground line-clamp-3 leading-relaxed">{data.title}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
        "group bg-card hover:bg-card/90 border border-border/50 hover:border-border hover:shadow-md cursor-grab rounded-lg p-4 text-sm transition-all duration-200",
        "focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary/50 focus:outline-none",
        "hover:-translate-y-0.5 hover:shadow-lg",
        isDragging && "cursor-grabbing opacity-60 shadow-xl rotate-1 scale-105",
      )}
    >
      <div className="space-y-3">
        <div className="font-medium text-foreground leading-relaxed line-clamp-4 group-hover:text-primary/90 transition-colors">
          {data.title}
        </div>

        {data.description && (
          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{data.description}</div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.description && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>1</span>
              </div>
            )}

            {data.createdAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id={`card-${data.id}-description`} className="sr-only">
        Draggable card. Use mouse to drag or keyboard to navigate and press Enter to open.
      </div>
    </div>
  );
}

export default CardItem;
