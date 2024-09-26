import { Note } from '../types'

const IMAGE_DETECTION_STRING = 'Image from user: '

const ParseUriFromImageNote = (userNote: string) => {
  return userNote.replace(IMAGE_DETECTION_STRING, '')
}

// Deprecated - from repairs online
const NoteWithImageContent = ({ note }: { note: Note }) => {
  return (
    <span>
      Housing Repairs Online request:{' '}
      <a href={ParseUriFromImageNote(note.note)}>{'Image from user'}</a>
    </span>
  )
}

export default NoteWithImageContent
