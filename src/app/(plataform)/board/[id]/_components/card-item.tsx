'use client'

import { Draggable } from '@hello-pangea/dnd'
import { useAtom } from 'jotai'
import type { CardSelect } from '~/server/db/schema'

import { onOpenAtom } from '~/hooks/use-card-modal' // Adjust the path as necessary

type CardItemProps = {
  data: CardSelect
  index: number
}

export default function CardItem({ data, index }: CardItemProps) {
  const [, onOpen] = useAtom(onOpenAtom)

  return (
    <Draggable draggableId={String(data.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => onOpen(data.id)}
          className="bg-primary-foreground hover:border-background truncate rounded-md border-2 border-transparent px-3 py-2 text-sm shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  )
}
