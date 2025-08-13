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
      <div className="bg-primary-foreground rotate-3 transform cursor-grabbing rounded-md border-2 border-transparent px-3 py-2 text-sm shadow-lg">
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
      onClick={() => onOpen(data.id)}
      className={cn(
        "bg-primary-foreground hover:border-background truncate cursor-grab rounded-md border-2 border-transparent px-3 py-2 text-sm shadow-sm transition-colors",
        isDragging && "opacity-50",
      )}
    >
      {data.title}
    </div>
  );
}

export default CardItem;
