import { auth } from '~/lib/auth'
import { Provider } from 'jotai'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { api } from '~/trpc/server'

import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'

import { BoardNavbar } from './_components/board-navbar'
import { ListContainer } from './_components/list-container'
import { CardModal } from './_components/modal'

type BoardIdPageProps = Promise<{ id: string }>

// export async function generateMetadata(props: { params: BoardIdPageProps }) {
//   const { orgId } = await auth();
//
//   if (!orgId) {
//     return {
//       title: "Board",
//     };
//   }
//
//   const { id } = await props.params;
//   const board = await api.board.getBoardById({
//     boardId: Number(id),
//     orgId,
//   });
//
//   return {
//     title: board?.title ?? "Board",
//   };
// }

export default async function BoardIdPage(props: { params: BoardIdPageProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>Not authenticated</div>
  }

  const { id } = await props.params
  const board = await api.board.getBoardById({
    boardId: Number(id),
    userId: session.user.id,
  })

  console.log(board)

  if (!board) {
    return
  }

  // <BoardNavbar data={board} orgId={orgId} />
  void api.list.getlistsWithCards.prefetch({ boardId: board.id })
  return (
    <Provider>
      <CardModal />
      <div className="mb-5 space-y-5">
        <ScrollArea>
          <div className="mb-10">
            <ListContainer boardId={board.id} />
          </div>
          <ScrollBar hidden orientation="horizontal" />
        </ScrollArea>
      </div>
    </Provider>
  )
}
