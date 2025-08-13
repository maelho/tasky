"use client";

import { useState } from "react";
import Link from "next/link";
import { type BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { LayoutDashboardIcon, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";

import { CreateBoardPopover } from "../../../_components/create-board";

function BoardCard({ board, orgId }: { board: BoardSelect; orgId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const utils = api.useUtils();

  const deleteBoard = api.board.deleteBoard.useMutation({
    onSuccess: async () => {
      toast.success("Board deleted successfully");
      await utils.board.getBoards.invalidate({ orgId });
      setShowDeleteDialog(false);
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
    deleteBoard.mutate({ boardId: board.id });
  };

  return (
    <>
      <Card className="group cursor-pointer transition-all hover:shadow-md hover:scale-105 h-32 flex flex-col relative">
        <Link href={`/board/${board.id}`} className="flex-1">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2 pr-8">
              <LayoutDashboardIcon size={20} />
              {board.title}
            </CardTitle>
            <CardDescription>
              Created {board.createdAt ? board.createdAt.toLocaleDateString() : "Unknown date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
        </Link>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </CardAction>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={deleteBoard.isPending ? "Deleting..." : "Delete Board"}
        isLoading={deleteBoard.isPending}
        onConfirm={handleDeleteConfirm}
      >
        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete this board? This action cannot be undone and will permanently delete:
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>All lists in this board</li>
            <li>All cards in those lists</li>
          </ul>
        </div>
      </ConfirmationDialog>
    </>
  );
}

interface BoardsClientProps {
  initialBoards: BoardSelect[] | null;
  orgId: string;
}

export function BoardsClient({ initialBoards, orgId }: BoardsClientProps) {
  const { data: boards } = api.board.getBoards.useQuery(
    { orgId },
    {
      initialData: initialBoards ?? undefined,
    },
  );

  return (
    <section className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Boards</h2>
        <CreateBoardPopover sideOffset={5} orgId={orgId}>
          <Button>
            <PlusIcon className="mr-2" size={18} /> Create new board
          </Button>
        </CreateBoardPopover>
      </div>

      {!boards || boards.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <LayoutDashboardIcon size={64} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Create your first board to start organizing your tasks and projects
          </p>
          <CreateBoardPopover sideOffset={5} orgId={orgId}>
            <Button size="lg">
              <PlusIcon className="mr-2" size={18} /> Create your first board
            </Button>
          </CreateBoardPopover>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(boards as BoardSelect[])?.map((board) => (
            <BoardCard key={board.id} board={board} orgId={orgId} />
          ))}

          <CreateBoardPopover sideOffset={5} orgId={orgId}>
            <Card className="group cursor-pointer border-dashed border-2 hover:border-primary hover:shadow-md transition-all h-32">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <PlusIcon size={24} className="text-muted-foreground mb-2 group-hover:text-primary" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">Create new board</p>
              </CardContent>
            </Card>
          </CreateBoardPopover>
        </div>
      )}
    </section>
  );
}
