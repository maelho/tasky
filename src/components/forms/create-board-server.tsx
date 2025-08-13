"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { createBoardAction } from "~/app/actions/board.actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface CreateBoardServerProps {
  orgId: string;
  children?: React.ReactNode;
}

export function CreateBoardServer({ orgId, children }: CreateBoardServerProps) {
  const [state, formAction] = useFormState(createBoardAction, {
    error: undefined,
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Board created successfully!");
      formRef.current?.reset();
    }
    if (state.error) {
      toast.error(state.error ?? "An error occurred");
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? <Button>Create Board</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Create a new board to organize your tasks and collaborate with your
            team.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="orgId" value={orgId} />

          <div className="space-y-2">
            <Label htmlFor="title">Board Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter board title..."
              required
              maxLength={30}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogTrigger>
            <Button type="submit">Create Board</Button>
          </div>
        </form>

        {state.error && (
          <div className="mt-2 text-sm text-red-600">{state.error}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
