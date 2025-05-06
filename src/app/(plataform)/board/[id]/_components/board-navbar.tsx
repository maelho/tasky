import type { BoardSelect } from '~/server/db/schema'

import { BoardOptions } from './board-options'
import { BoardTitleForm } from './board-title-form'

type BoardNavbarProps = {
  data: BoardSelect
  orgId: string
}

export async function BoardNavbar({ data, orgId }: BoardNavbarProps) {
  return (
    <div className="bg-muted flex h-14 items-center justify-between gap-x-4 rounded-2xl px-6">
      <BoardTitleForm data={data} />
      <div>
        <BoardOptions id={data.id} orgId={orgId} />
      </div>
    </div>
  )
}
