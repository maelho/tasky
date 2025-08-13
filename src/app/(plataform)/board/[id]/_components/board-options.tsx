"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Settings, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Paths } from "~/config/site";
import { Button } from "~/components/ui/button";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

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
    onError: (error) => {
      const errorMessage =
        error?.data?.zodError?.fieldErrors?.boardId?.[0] ??
        error?.message ??
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
          <Button variant="ghost" className="h-auto w-auto p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 py-3" side="bottom" align="start">
          <div className="pb-4 text-center text-sm font-medium text-neutral-600">Board actions</div>
          <PopoverClose asChild>
            <Button className="absolute top-2 right-2 h-auto w-auto p-2 text-neutral-600" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            <Trash2 className="mr-2 h-4 w-4" />
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
      >
        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete this board? This action cannot be undone and will permanently delete:
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>All lists in this board</li>
            <li>All cards in those lists</li>
            <li>All associated data</li>
          </ul>
        </div>
      </ConfirmationDialog>
    </>
  );
}
