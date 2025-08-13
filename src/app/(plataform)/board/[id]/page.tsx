import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { Provider } from "jotai";

import { createPageMetadata } from "~/lib/metadata";
import { OptimisticBoardProvider } from "~/hooks/use-optimistic-board";

import { BoardNavbar } from "./_components/board-navbar";
import { ListContainer } from "./_components/list-container";
import { CardModal } from "./_components/modal";
import { ScreenReaderAnnouncements } from "./_components/screen-reader-announcements";

type BoardIdPageProps = Promise<{ id: string }>;

export async function generateMetadata(props: { params: BoardIdPageProps }): Promise<Metadata> {
  const { orgId } = await auth();

  if (!orgId) {
    return createPageMetadata({
      title: "Board",
      description: "Access your project board to manage tasks and collaborate with your team",
      noIndex: true,
    });
  }

  try {
    const { id } = await props.params;
    const board = await api.board.getBoardById({
      boardId: Number(id),
      orgId,
    });

    if (!board) {
      return createPageMetadata({
        title: "Board Not Found",
        description: "The requested board could not be found",
        noIndex: true,
      });
    }

    return createPageMetadata({
      title: board.title,
      description: `Manage tasks and collaborate on ${board.title} board with your team`,
      path: `/board/${board.id}`,
    });
  } catch {
    return createPageMetadata({
      title: "Board",
      description: "Access your project board to manage tasks and collaborate with your team",
      noIndex: true,
    });
  }
}

export default async function BoardIdPage(props: { params: BoardIdPageProps }) {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const { id } = await props.params;
  const board = await api.board.getBoardById({
    boardId: Number(id),
    orgId,
  });

  if (!board) {
    return;
  }

  void api.list.getlistsWithCards.prefetch({ boardId: board.id });
  return (
    <Provider>
      <OptimisticBoardProvider boardId={board.id}>
        <div role="main" aria-label={`Board: ${board.title}`}>
          <h1 className="sr-only">Board: {board.title}</h1>
          <ScreenReaderAnnouncements announcement="" />

          <CardModal />

          <div className="mb-5 space-y-5">
            <BoardNavbar data={board} orgId={orgId} />

            <section aria-label="Board lists and cards" role="region" aria-describedby="board-instructions">
              <div id="board-instructions" className="sr-only">
                Navigate between lists and cards using Tab and arrow keys. Press Enter to open cards or edit items. Drag
                and drop is supported for reordering.
              </div>

              <div className="overflow-x-auto overflow-y-hidden" role="application" aria-label="Kanban board">
                <ListContainer boardId={board.id} />
              </div>
            </section>
          </div>
        </div>
      </OptimisticBoardProvider>
    </Provider>
  );
}
