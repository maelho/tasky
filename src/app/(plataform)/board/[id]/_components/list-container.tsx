"use client";

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { CardSelect } from "~/server/db/schema";

import { useOptimisticBoard } from "~/hooks/use-optimistic-board";

import { CardItem } from "./card-item";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

type ListContainerProps = {
  boardId: number;
};

export function ListContainer({ boardId: _boardId }: ListContainerProps) {
  const { lists, isLoading, isError, moveCard, moveList } = useOptimisticBoard();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType] = useState<"list" | "card" | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeList = useMemo(() => {
    if (!activeId || activeType !== "list") return null;
    return lists.find((list) => list.id === activeId);
  }, [activeId, activeType, lists]);

  const activeCard = useMemo(() => {
    if (!activeId || activeType !== "card") return null;
    for (const list of lists) {
      const card = list.cards?.find((card) => card.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, activeType, lists]);

  const listIds = useMemo(() => lists.map((list) => list.id), [lists]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { data } = active;

    setActiveId(active.id);

    if (data.current?.type === "list") {
      setActiveType("list");
    } else if (data.current?.type === "card") {
      setActiveType("card");
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeType = active.data.current?.type as string | undefined;
    const overType = over.data.current?.type as string | undefined;

    if (activeType === "card" && overType === "card") {
      const activeCard = findCardById(activeId);
      const overCard = findCardById(overId);

      if (!activeCard || !overCard) return;
      if (activeCard.listId === overCard.listId) return;

      const activeListIndex = lists.findIndex((list) => list.id === activeCard.listId);
      const overListIndex = lists.findIndex((list) => list.id === overCard.listId);

      if (activeListIndex === -1 || overListIndex === -1) return;

      const activeCardIndex = lists[activeListIndex]?.cards?.findIndex((card) => card.id === activeId) ?? -1;
      const overCardIndex = lists[overListIndex]?.cards?.findIndex((card) => card.id === overId) ?? -1;

      if (activeCardIndex === -1 || overCardIndex === -1) return;

      moveCard(Number(activeId), activeCard.listId, overCard.listId, activeCardIndex, overCardIndex);
    }

    if (activeType === "card" && (overType === "list" || over.id.toString().startsWith("list-"))) {
      const activeCard = findCardById(activeId);
      let overListId: number;

      if (over.id.toString().startsWith("list-")) {
        overListId = Number(over.id.toString().replace("list-", ""));
      } else {
        overListId = Number(overId);
      }

      if (!activeCard || activeCard.listId === overListId) return;

      const activeListIndex = lists.findIndex((list) => list.id === activeCard.listId);
      const overList = lists.find((list) => list.id === overListId);

      if (activeListIndex === -1 || !overList) return;

      const activeCardIndex = lists[activeListIndex]?.cards?.findIndex((card) => card.id === activeId) ?? -1;

      if (activeCardIndex === -1) return;

      moveCard(Number(activeId), activeCard.listId, overListId, activeCardIndex, overList.cards?.length ?? 0);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeType = active.data.current?.type as string | undefined;

    if (activeType === "list") {
      const activeIndex = lists.findIndex((list) => list.id === activeId);
      const overIndex = lists.findIndex((list) => list.id === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        moveList(Number(activeId), activeIndex, overIndex);
      }
      return;
    }

    if (activeType === "card") {
      const activeCard = findCardById(activeId);

      if (over.id.toString().startsWith("list-")) {
        const overListId = Number(over.id.toString().replace("list-", ""));

        if (!activeCard) return;

        const activeListIndex = lists.findIndex((list) => list.id === activeCard.listId);
        const overList = lists.find((list) => list.id === overListId);

        if (activeListIndex === -1 || !overList) return;

        const activeCardIndex = lists[activeListIndex]?.cards?.findIndex((card) => card.id === activeId) ?? -1;

        if (activeCardIndex === -1) return;

        moveCard(Number(activeId), activeCard.listId, overListId, activeCardIndex, overList.cards?.length ?? 0);
        return;
      }

      const overCard = findCardById(overId);

      if (!activeCard || !overCard) return;
      if (activeCard.listId !== overCard.listId) return;

      const listIndex = lists.findIndex((list) => list.id === activeCard.listId);
      if (listIndex === -1) return;

      const activeIndex = lists[listIndex]?.cards?.findIndex((card) => card.id === activeId) ?? -1;
      const overIndex = lists[listIndex]?.cards?.findIndex((card) => card.id === overId) ?? -1;

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        moveCard(Number(activeId), activeCard.listId, activeCard.listId, activeIndex, overIndex);
      }
    }
  }

  function findCardById(id: UniqueIdentifier): (CardSelect & { listId: number }) | null {
    for (const list of lists) {
      const card = list.cards?.find((card) => card.id === id);
      if (card) {
        return { ...card, listId: list.id };
      }
    }
    return null;
  }

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading board</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full w-full relative">
        <div
          className="flex h-full gap-x-4 pb-6 px-1 overflow-x-auto overflow-y-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "hsl(var(--border)) transparent",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: hsl(var(--muted) / 0.3);
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: hsl(var(--border));
              border-radius: 4px;
              transition: background-color 0.2s ease;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--muted-foreground) / 0.6);
            }
          `}</style>

          <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
            {lists.map((list) => (
              <ListItem key={list.id} data={list} />
            ))}
          </SortableContext>

          <ListForm />
          <div className="w-4 shrink-0" />
        </div>
      </div>

      <DragOverlay>
        {activeType === "list" && activeList ? (
          <div className="w-[272px] rotate-2 transform opacity-95 shadow-xl">
            <ListItem data={activeList} />
          </div>
        ) : null}

        {activeType === "card" && activeCard ? (
          <div className="rotate-2 transform opacity-95 shadow-xl">
            <CardItem data={activeCard} isDragOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
