import { LayoutDashboardIcon, PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { api } from '~/trpc/server'
import { headers } from 'next/headers'
import { auth } from '~/lib/auth'

import { Button } from '~/components/ui/button'

import { CreateBoardPopover } from '../../_components/create-board'

export default async function OrganizationIdPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>Not authenticated</div>
  }
  // const { orgId } = await auth()
  //
  // if (!orgId) {
  //   return redirect('/select-org')
  // }
  //
  // void api.board.getBoards.prefetch({ orgId })
  return (
    <section className="mt-10 flex flex-col items-center">
      <h3 className="text-center text-xl font-semibold">No Board Selected</h3>
      <p className="text-muted-foreground mb-4 flex items-center text-center">
        Please choose a board by clicking the icon below to get started!
        <LayoutDashboardIcon className="ml-2 inline" size={18} />
      </p>
      <CreateBoardPopover sideOffset={5} userId={session.user.id}>
        <Button>
          <PlusIcon className="mr-2" size={18} /> Create new board
        </Button>
      </CreateBoardPopover>
    </section>
  )
}
