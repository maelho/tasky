"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardSelect } from "~/server/db/schema";
import { useAtom } from "jotai";

import { cn } from "~/lib/utils";
import { onOpenAtom } from "~/hooks/use-card-modal";

type CardItemProps = {
  data: CardSelect;
  isDragOverlay?: boolean;
};

export function CardItem({ data, isDragOverlay = false }: CardItemProps) {
  const [, onOpen] = useAtom(onOpenAtom);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
        className="bg-primary-foreground rotate-3 transform cursor-grabbing rounded-md border-2 border-transparent px-3 py-2 text-sm shadow-lg"
        aria-hidden="true"
      >
        {data.title}
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
        "bg-primary-foreground hover:border-background focus:ring-ring cursor-grab truncate rounded-md border-2 border-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2",
        isDragging && "cursor-grabbing opacity-50",
      )}
    >
      {data.title}
      <div id={`card-${data.id}-description`} className="sr-only">
        Draggable card. Use mouse to drag or keyboard to navigate and press
        Enter to open.
      </div>
    </div>
  );
}

export default CardItem;
