import NoteEntry from './NoteEntry'
import { Note } from './types'

interface Props {
  notes: Note[]
  workOrder: object
}

const NotesTimeline = ({ notes, workOrder }: Props) => {
  if (notes.length === 0) {
    return <p className="lbh-body-s">There are no notes for this work order.</p>
  }

  return (
    <ul className="lbh-list note-timeline">
      {notes.map((note, index) => (
        <li key={index} className="note-entry lbh-body-s" data-note-id={index}>
          <NoteEntry key={index} note={note} workOrder={workOrder} />
        </li>
      ))}
    </ul>
  )
}

export default NotesTimeline
