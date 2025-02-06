import NoteEntry from './NoteEntry'
import { Note, WorkOrderRequest } from './types'

interface Props {
  notes: Note[]
  workOrder: WorkOrderRequest
  setActiveTab: (tab: string) => void
}

const NotesTimeline = ({ notes, workOrder, setActiveTab }: Props) => {
  if (notes.length === 0) {
    return <p className="lbh-body-s">There are no notes for this work order.</p>
  }

  return (
    <ul className="lbh-list note-timeline">
      {notes.map((note, index) => {
        return (
          <li
            key={index}
            className="note-entry lbh-body-s"
            data-note-id={index}
          >
            <NoteEntry
              note={note}
              workOrder={workOrder}
              setActiveTab={setActiveTab}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default NotesTimeline
