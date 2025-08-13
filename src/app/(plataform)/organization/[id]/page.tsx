import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { type BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/server";

import { BoardsClient } from "~/components/organization";

export default async function OrganizationIdPage() {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = (await api.board.getBoards({ orgId })) as BoardSelect[] | null;

  return <BoardsClient initialBoards={boards} orgId={orgId} />;
}
