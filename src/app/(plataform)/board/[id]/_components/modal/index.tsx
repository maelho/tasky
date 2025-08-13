"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { CardSelect, lists } from "~/server/db/schema";
import { api } from "~/trpc/react";
import type { InferSelectModel } from "drizzle-orm";
import { useAtom } from "jotai";
import { toast } from "sonner";

import { cardModalAtom } from "~/hooks/use-card-modal";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Actions } from "./actions";
import { Activity } from "./activity";
import { Description } from "./description";
import { Header } from "./header";

export type ListSelect = Omit<InferSelectModel<typeof lists>, "order">;
export type CardWithList = CardSelect & { list: ListSelect };

export function CardModal() {
  const [modalState, dispatch] = useAtom(cardModalAtom);
  const { id: modalId, isOpen } = modalState;

  const [cardRetryCount, setCardRetryCount] = useState(0);
  const [logsRetryCount, setLogsRetryCount] = useState(0);
  const maxRetries = 3;

  const {
    data: cardData,
    isLoading: isCardLoading,
    error: cardError,
  } = api.card.getCardById.useQuery(
    { id: modalId ?? -1 },
    {
      enabled: !!modalId,
      retry:
        cardRetryCount < maxRetries
          ? () => {
              setCardRetryCount(cardRetryCount + 1);
              return true;
            }
          : false,
    },
  );

  const {
    data: auditLogsData,
    isLoading: isLogsLoading,
    error: logsError,
  } = api.logs.getAuditLogs.useQuery(
    { id: modalId ?? -1 },
    {
      enabled: !!modalId,
      retry:
        logsRetryCount < maxRetries
          ? () => {
              setLogsRetryCount(logsRetryCount + 1);
              return true;
            }
          : false,
    },
  );

  const handleClose = () => {
    dispatch({ type: "close" });
  };

  if (cardError) {
    toast.error(`Error loading card data: ${cardError.message}`);
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <VisuallyHidden>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Error loading card data</DialogDescription>
          </VisuallyHidden>
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-3">Failed to load card</h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{cardError.message}</p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (logsError) {
    toast.error(`Error loading audit logs: ${logsError.message}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{cardData?.title ?? "Card Details"}</DialogTitle>
          <DialogDescription>{cardData?.description ?? "Card information and activity"}</DialogDescription>
        </VisuallyHidden>

        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="border-b bg-card px-6 py-5">
            {isCardLoading || !cardData ? <Header.Skeleton /> : <Header data={cardData} />}
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
              <div className="lg:col-span-3 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 px-6 py-6">
                  <div className="space-y-8 max-w-3xl">
                    {cardData ? <Description data={cardData} /> : <Description.Skeleton />}
                    {isLogsLoading ? <Activity.Skeleton /> : <Activity items={auditLogsData ?? []} />}
                  </div>
                </ScrollArea>
              </div>

              <div className="lg:col-span-1 border-l bg-muted/20">
                <ScrollArea className="h-full">
                  <div className="p-6">{cardData ? <Actions data={cardData} /> : <Actions.Skeleton />}</div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
