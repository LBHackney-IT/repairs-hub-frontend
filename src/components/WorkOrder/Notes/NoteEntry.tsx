import { formatDateTime } from '@/utils/time'
import { Note } from './types'
import NormalNoteContent from './NoteContent/NormalNoteContent'
import NoteWithImageContent from './NoteContent/NoteWithImageContent'
import CompletedNoteContent from './NoteContent/CompletedNoteContent'

const NoteInfo = ({ note }: { note: Note }) => {
  const { time, user, userEmail } = note

  return (
    <>
      {time ? formatDateTime(time) : '—'}{' '}
      {user && userEmail ? `by ${user} (${userEmail})` : ''}
    </>
  )
}

const IMAGE_DETECTION_STRING = 'Image from user: '

const DetectImageNote = (userNote: string) => {
  return userNote.includes(IMAGE_DETECTION_STRING)
}

interface Props {
  note: Note
  workOrder: object
}

const NoteEntry = ({ note, workOrder }: Props) => {
  return (
    <>
      <div className="note-info lbh-body-s">
        <NoteInfo note={note} />
      </div>

      <NoteContent note={note} workOrder={workOrder} />
    </>
  )
}

const NoteContent = ({
  note,
  workOrder,
}: {
  note: Note
  workOrder: Object
}) => {
  if (
    note.noteGeneratedOnFrontend &&
    note.typeCode.toString() === '0' &&
    note.otherType === 'completed'
  ) {
    return <CompletedNoteContent note={note} workOrder={workOrder} />
  }

  if (DetectImageNote(note.note)) {
    return <NoteWithImageContent note={note} />
  }

  return <NormalNoteContent note={note} />
}

export default NoteEntry
