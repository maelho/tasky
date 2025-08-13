"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Settings, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Paths } from "~/config/site";
import { Button } from "~/components/ui/button";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type BoardOptionsProps = {
  id: number;
  orgId: string;
};

export function BoardOptions({ id, orgId }: BoardOptionsProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const deleteBoard = api.board.deleteBoard.useMutation({
    onSuccess: async () => {
      toast.success("Board deleted successfully");
      await utils.board.invalidate();
      setShowDeleteDialog(false);
      setShowPopover(false);
      router.replace(`${Paths.Organization}/${orgId}`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { boardId?: string[] } } };
            message?: string;
          }
        )?.data?.zodError?.fieldErrors?.boardId?.[0] ??
        (error as { message?: string })?.message ??
        "Failed to delete board. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleDeleteConfirm = () => {
    deleteBoard.mutate({ boardId: Number(id) });
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-auto p-2"
            aria-label="Board options menu"
            aria-haspopup="true"
            aria-expanded={showPopover}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="px-0 py-3"
          side="bottom"
          align="start"
          role="menu"
          aria-labelledby="board-actions-title"
        >
          <div
            id="board-actions-title"
            className="pb-4 text-center text-sm font-medium text-neutral-600"
          >
            Board actions
          </div>
          <PopoverClose asChild>
            <Button
              className="absolute top-2 right-2 h-auto w-auto p-2 text-neutral-600"
              variant="ghost"
              aria-label="Close board options menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </PopoverClose>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
            role="menuitem"
            aria-label="Delete this board permanently"
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete this board
          </Button>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={deleteBoard.isPending ? "Deleting..." : "Delete Board"}
        isLoading={deleteBoard.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        aria-describedby="delete-board-description"
      >
        <div
          id="delete-board-description"
          className="text-muted-foreground text-sm"
        >
          <p className="mb-2">
            Are you sure you want to delete this board? This action cannot be
            undone and will permanently delete:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1" role="list">
            <li>All lists in this board</li>
            <li>All cards in those lists</li>
            <li>All associated data</li>
          </ul>
          <p className="text-destructive mt-2 font-medium" role="alert">
            This action is irreversible.
          </p>
        </div>
      </ConfirmationDialog>
    </>
  );
}
