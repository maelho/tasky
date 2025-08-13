"use client";

import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ListWrapper } from "./list-wrapper";

export function ListForm() {
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const utils = api.useUtils();
  const { mutate, error, isPending } = api.list.createList.useMutation({
    onSuccess: async (data) => {
      await utils.list.invalidate();

      toast.success(`List "${data?.title}" created!`);
      resetForm();
    },
  });

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setTitle("");
  }, []);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing],
  );

  useEventListener("keydown", () => handleKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ title, boardId: Number(params.id) });
  };

  return (
    <ListWrapper>
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-muted w-full space-y-4 rounded-md p-3"
          role="form"
          aria-label="Add new list"
        >
          <Input
            id="title"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="hover:border-input focus:border-input border-transparent px-2 py-1 text-sm font-medium transition"
            placeholder="Enter list title..."
            aria-label="List title"
            aria-required="true"
            aria-invalid={!!error?.data?.zodError?.fieldErrors.title}
            aria-describedby={
              error?.data?.zodError?.fieldErrors.title
                ? "list-title-error"
                : "list-title-help"
            }
          />
          <div id="list-title-help" className="sr-only">
            Press Enter to create list, Escape to cancel
          </div>
          {error?.data?.zodError?.fieldErrors.title && (
            <span
              id="list-title-error"
              className="mb-8 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {error.data.zodError.fieldErrors.title}
            </span>
          )}
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              type="submit"
              disabled={isPending}
              aria-label={
                isPending ? "Adding list, please wait" : "Add list to board"
              }
            >
              {isPending ? "Add list..." : "Add list"}
            </Button>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              aria-label="Cancel adding list"
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={enableEditing}
          className="bg-muted/75 hover:bg-muted focus:ring-ring flex w-full items-center rounded-md p-3 text-sm font-medium transition focus:ring-2 focus:ring-offset-2"
          aria-label="Add a new list to this board"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a list
        </button>
      )}
    </ListWrapper>
  );
}
