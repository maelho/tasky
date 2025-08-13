"use client";

import { useRef, useState, type ElementRef } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "~/lib/utils";
import type { ListWithCards } from "~/hooks/use-optimistic-board";

import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { DroppableArea } from "./droppable-area";
import { ListHeader } from "./list-header";

type ListItemProps = {
  data: ListWithCards;
};

export function ListItem({ data }: ListItemProps) {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      type: "list",
      list: data,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }

  const cardIds = data.cards?.map((card) => card.id) || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-full w-[272px] shrink-0 select-none",
        isDragging && "opacity-50",
      )}
    >
      <div className="bg-muted w-full rounded-md pb-2 shadow-md">
        <div {...attributes} {...listeners}>
          <ListHeader onAddCard={enableEditing} data={data} />
        </div>

        <DroppableArea
          id={`list-${data.id}`}
          className={cn(
            "mx-1 px-1 py-0.5",
            data.cards && data.cards.length > 0 ? "mt-2" : "mt-0",
          )}
        >
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex min-h-[20px] flex-col gap-y-2">
              {data.cards?.map((card) => (
                <CardItem key={card.id} data={card} />
              ))}
            </div>
          </SortableContext>
        </DroppableArea>

        <CardForm
          listId={data.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </div>
  );
}
