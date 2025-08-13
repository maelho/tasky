"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { CardSelect, ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export type ListWithCards = ListSelect & { cards: CardSelect[] };

interface OptimisticBoardContextType {
  lists: ListWithCards[];
  isLoading: boolean;
  isError: boolean;
  moveCard: (cardId: number, sourceListId: number, destListId: number, sourceIndex: number, destIndex: number) => void;
  moveList: (listId: number, sourceIndex: number, destIndex: number) => void;
  refetch: () => void;
}

const OptimisticBoardContext = createContext<OptimisticBoardContextType | undefined>(undefined);

interface OptimisticBoardProviderProps {
  children: React.ReactNode;
  boardId: number;
}

export function OptimisticBoardProvider({ children, boardId }: OptimisticBoardProviderProps) {
  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = api.list.getlistsWithCards.useQuery({
    boardId: boardId,
  });

  const utils = api.useUtils();

  const updateListOrderMutation = api.list.updateListOrder.useMutation({
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: () => {
      toast.error("Failed to reorder list");
      void utils.list.getlistsWithCards.invalidate({ boardId });
    },
  });

  const updateCardOrderMutation = api.card.updateCardOrder.useMutation({
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: () => {
      toast.error("Failed to reorder card");
      void utils.list.getlistsWithCards.invalidate({ boardId });
    },
  });

  const moveCard = useCallback(
    (cardId: number, sourceListId: number, destListId: number, sourceIndex: number, destIndex: number) => {
      if (!lists) return;

      utils.list.getlistsWithCards.setData({ boardId }, (old) => {
        if (!old) return old;

        const newLists = [...old];
        const sourceList = newLists.find((list) => list.id === sourceListId);
        const destList = newLists.find((list) => list.id === destListId);

        if (!sourceList || !destList) return old;

        const sourceCards = [...(sourceList.cards || [])];
        const destCards = sourceListId === destListId ? sourceCards : [...(destList.cards || [])];

        const [movedCard] = sourceCards.splice(sourceIndex, 1);
        if (!movedCard) return old;

        if (sourceListId !== destListId) {
          movedCard.listId = destListId;
        }

        destCards.splice(destIndex, 0, movedCard);

        if (sourceListId === destListId) {
          destCards.forEach((card, index) => {
            card.order = index;
          });
          sourceList.cards = destCards;
        } else {
          sourceCards.forEach((card, index) => {
            card.order = index;
          });
          destCards.forEach((card, index) => {
            card.order = index;
          });
          sourceList.cards = sourceCards;
          destList.cards = destCards;
        }

        return newLists;
      });

      const updatedCacheData = utils.list.getlistsWithCards.getData({ boardId });
      if (updatedCacheData) {
        const allAffectedCards: Array<{ id: number; title: string; order: number; listId: number }> = [];

        if (sourceListId === destListId) {
          const updatedList = updatedCacheData.find((list) => list.id === destListId);
          if (updatedList?.cards) {
            allAffectedCards.push(
              ...updatedList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }
        } else {
          const updatedSourceList = updatedCacheData.find((list) => list.id === sourceListId);
          const updatedDestList = updatedCacheData.find((list) => list.id === destListId);

          if (updatedSourceList?.cards) {
            allAffectedCards.push(
              ...updatedSourceList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }

          if (updatedDestList?.cards) {
            allAffectedCards.push(
              ...updatedDestList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }
        }

        if (allAffectedCards.length > 0) {
          updateCardOrderMutation.mutate({
            items: allAffectedCards as [
              { id: number; title: string; order: number; listId: number },
              ...{ id: number; title: string; order: number; listId: number }[],
            ],
          });
        }
      }
    },
    [lists, boardId, utils, updateCardOrderMutation],
  );

  const moveList = useCallback(
    (listId: number, sourceIndex: number, destIndex: number) => {
      if (!lists) return;

      utils.list.getlistsWithCards.setData({ boardId }, (old) => {
        if (!old) return old;

        const newLists = [...old];
        const [movedList] = newLists.splice(sourceIndex, 1);
        if (!movedList) return old;

        newLists.splice(destIndex, 0, movedList);

        return newLists.map((list, index) => ({
          ...list,
          order: index,
        }));
      });

      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(sourceIndex, 1);
      if (movedList) {
        reorderedLists.splice(destIndex, 0, movedList);
        const updatedLists = reorderedLists.map((list, index) => ({
          ...list,
          order: index,
        }));

        if (updatedLists.length > 0) {
          updateListOrderMutation.mutate({
            items: updatedLists.map((list) => ({
              id: list.id,
              title: list.title,
              order: list.order,
            })) as [{ id: number; title: string; order: number }, ...{ id: number; title: string; order: number }[]],
          });
        }
      }
    },
    [lists, boardId, utils, updateListOrderMutation],
  );

  const value = useMemo(
    () => ({
      lists: lists ?? [],
      isLoading,
      isError,
      moveCard,
      moveList,
      refetch,
    }),
    [lists, isLoading, isError, moveCard, moveList, refetch],
  );

  return <OptimisticBoardContext.Provider value={value}>{children}</OptimisticBoardContext.Provider>;
}

export function useOptimisticBoard() {
  const context = useContext(OptimisticBoardContext);
  if (context === undefined) {
    throw new Error("useOptimisticBoard must be used within an OptimisticBoardProvider");
  }
  return context;
}
