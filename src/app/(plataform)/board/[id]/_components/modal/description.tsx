"use client";

import { useRef, useState, type ElementRef } from "react";
import { api } from "~/trpc/react";
import { AlignLeft, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";

import type { CardWithList } from ".";

type DescriptionProps = {
  data: CardWithList;
};

export function Description({ data }: DescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const utils = api.useUtils();
  const updateCard = api.card.updateCard.useMutation({
    onSuccess: async (updatedCard) => {
      await utils.card.getCardById.invalidate({
        id: updatedCard?.id as number,
      });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      const errorMessage =
        error?.data &&
        "zodError" in error.data &&
        error.data.zodError &&
        typeof error.data.zodError === "object" &&
        "fieldErrors" in error.data.zodError &&
        error.data.zodError.fieldErrors &&
        typeof error.data.zodError.fieldErrors === "object" &&
        "description" in error.data.zodError.fieldErrors
          ? String(error.data.zodError.fieldErrors.description)
          : "Failed to update description";
      toast.error(errorMessage);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    updateCard.mutate({ id: data.id, description });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="p-2 rounded-lg bg-secondary/50 text-secondary-foreground shrink-0">
          <AlignLeft className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">Description</h3>
      </div>

      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="space-y-3 ml-11">
          <Textarea
            id="description"
            name="description"
            placeholder="Add a more detailed description..."
            defaultValue={data.description ?? ""}
            className="min-h-[120px] resize-none border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            ref={textareaRef}
          />
          <div className="flex items-center gap-x-2">
            <Button disabled={updateCard.isPending} size="sm" className="h-8 px-3">
              {updateCard.isPending ? "Saving..." : "Save"}
            </Button>
            <Button type="button" onClick={disableEditing} size="sm" variant="ghost" className="h-8 px-3">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="ml-11">
          <div
            onClick={enableEditing}
            role="button"
            tabIndex={0}
            className={cn(
              "group relative rounded-lg border-2 border-dashed border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer",
              "min-h-[80px] p-4 text-sm",
              data.description && "border-solid border-border bg-background hover:bg-muted/20",
            )}
          >
            {data.description ? (
              <>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{data.description}</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 rounded bg-background/80 backdrop-blur-sm border shadow-sm">
                    <Edit3 className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-2">
                  <Edit3 className="h-5 w-5 mx-auto opacity-40" />
                  <p>Add a more detailed description...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="p-2 rounded-lg bg-muted shrink-0">
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="ml-11">
        <Skeleton className="h-[80px] w-full rounded-lg" />
      </div>
    </div>
  );
};
