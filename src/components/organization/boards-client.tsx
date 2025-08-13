"use client";

import { useState } from "react";
import Link from "next/link";
import { type BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { LayoutDashboardIcon, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";

import { CreateBoardDialog } from "~/components/forms";

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
      <Card className="group hover:shadow-primary/5 hover:border-primary/20 relative flex h-36 cursor-pointer flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <Link href={`/board/${board.id}`} className="relative z-10 flex-1">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="group-hover:text-primary flex items-center gap-3 pr-10 text-lg font-bold transition-colors">
              <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                <LayoutDashboardIcon size={18} className="text-primary" />
              </div>
              <span className="truncate">{board.title}</span>
            </CardTitle>
            <CardDescription className="text-sm opacity-70 transition-opacity group-hover:opacity-90">
              Created{" "}
              {board.createdAt
                ? board.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown date"}
            </CardDescription>
          </CardHeader>
        </Link>

        <CardAction className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0 opacity-0 transition-all duration-200 group-hover:opacity-100"
          >
            <Trash2 size={14} />
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
        <div className="text-muted-foreground text-sm">
          Are you sure you want to delete this board? This action cannot be
          undone and will permanently delete:
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
    <section className="mt-10 space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-3xl font-bold">
            Your Boards
          </h2>
          <p className="text-muted-foreground">
            Organize your projects and collaborate with your team
          </p>
        </div>
        <CreateBoardDialog orgId={orgId}>
          <Button size="lg" className="gap-2">
            <PlusIcon size={18} /> Create Board
          </Button>
        </CreateBoardDialog>
      </div>

      {!boards || boards.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="bg-primary/5 mb-6 rounded-full p-6">
            <LayoutDashboardIcon size={48} className="text-primary" />
          </div>
          <h3 className="mb-3 text-2xl font-bold">No boards yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md text-center leading-relaxed">
            Create your first board to start organizing your tasks and projects.
            Boards help you visualize your workflow and collaborate effectively.
          </p>
          <CreateBoardDialog orgId={orgId}>
            <Button size="lg" className="gap-2">
              <PlusIcon size={18} /> Create your first board
            </Button>
          </CreateBoardDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(boards as BoardSelect[])?.map((board) => (
            <BoardCard key={board.id} board={board} orgId={orgId} />
          ))}

          <CreateBoardDialog orgId={orgId}>
            <Card className="group hover:border-primary/50 hover:bg-primary/5 h-36 cursor-pointer border-2 border-dashed transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex h-full flex-col items-center justify-center space-y-3">
                <div className="border-muted-foreground/30 group-hover:border-primary/50 rounded-full border-2 border-dashed p-3 transition-colors">
                  <PlusIcon
                    size={20}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
                    Create new board
                  </p>
                  <p className="text-muted-foreground/70 text-xs">
                    Start a new project
                  </p>
                </div>
              </CardContent>
            </Card>
          </CreateBoardDialog>
        </div>
      )}
    </section>
  );
}
