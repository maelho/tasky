"use client";

import { useEffect, useRef, useState } from "react";
import type { BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Input } from "~/components/ui/input";

interface BoardTitleFormProps {
  data: BoardSelect;
}

export default function BoardTitleForm({ data }: BoardTitleFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const updateBoard = api.board.updateBoard.useMutation({
    onSuccess: () => {
      toast.success("Board title updated successfully!");
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { title?: string[] } } };
            message?: string;
          }
        )?.data?.zodError?.fieldErrors?.title?.[0] ??
        (error as { message?: string })?.message ??
        "Failed to update board title";
      toast.error(errorMessage);
      setTitle(data.title);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    setTitle(data.title);
  }, [data.title]);

  const enableEditing = () => {
    setIsEditing(true);
    setTitle(data.title);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
    setTitle(data.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (updateBoard.isPending) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Board title cannot be empty");
      setTitle(data.title);
      return;
    }

    if (trimmedTitle === data.title) {
      setIsEditing(false);
      return;
    }

    updateBoard.mutate({
      boardId: data.id,
      title: trimmedTitle,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (isEditing && !updateBoard.isPending) {
        const formEvent = new Event("submit") as unknown as React.FormEvent;
        handleSubmit(formEvent);
      }
    }, 100);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-x-2">
        <Input
          ref={inputRef}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="dark:focus-visible:bg-muted h-7 border-none bg-transparent px-[7px] py-1 text-lg font-bold shadow-sm transition-colors focus-visible:bg-white"
          disabled={updateBoard.isPending}
        />
      </form>
    );
  }

  return (
    <button
      onClick={enableEditing}
      className="hover:bg-muted/50 h-auto rounded-sm p-1 px-2 text-left text-lg font-bold transition-colors"
      disabled={updateBoard.isPending}
    >
      {data.title}
    </button>
  );
}
