"use client";

import {
  useRef,
  useState,
  type ElementRef,
  type PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type CreateBoardPopoverProps = {
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  orgId: string;
};

export function CreateBoardPopover({
  children,
  side = "bottom",
  sideOffset = 0,
  orgId,
}: PropsWithChildren<CreateBoardPopoverProps>) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [formData, setFormData] = useState({ title: "" });

  const router = useRouter();

  const utils = api.useUtils();
  const { mutate, error, isPending } = api.board.create.useMutation({
    onSuccess: async (data) => {
      await utils.board.invalidate();
      closeRef.current?.click();
      setFormData({ title: "" });
      router.replace(`/board/${data?.id}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ title: formData.title, orgId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
        aria-labelledby="create-board-title"
        aria-describedby="create-board-form"
      >
        <div
          id="create-board-title"
          className="text-muted-foreground pb-4 text-center text-sm font-medium"
        >
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant="ghost"
            className="text-muted-foreground absolute top-2 right-2 h-auto w-auto p-2"
            aria-label="Close create board dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form
          id="create-board-form"
          onSubmit={handleSubmit}
          className="space-y-4"
          role="form"
          aria-label="Create new board"
        >
          <Input
            name="title"
            type="text"
            placeholder="Enter board title"
            value={formData.title}
            onChange={handleChange}
            aria-label="Board title"
            aria-required="true"
            aria-invalid={!!error?.data?.zodError?.fieldErrors.title}
            aria-describedby={
              error?.data?.zodError?.fieldErrors.title
                ? "title-error"
                : undefined
            }
          />
          {error?.data?.zodError?.fieldErrors.title && (
            <span
              id="title-error"
              className="mb-8 text-xs text-red-500"
              role="alert"
              aria-live="polite"
            >
              {error.data.zodError.fieldErrors.title}
            </span>
          )}
          <Button
            className="w-full"
            type="submit"
            disabled={isPending}
            aria-label={
              isPending ? "Creating board, please wait" : "Create board"
            }
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
