import { Note } from '../types'

const NormalNoteContent = ({
  note,
  previousNote,
}: {
  note: Note
  previousNote: string | null
}) => {
  return (
    <>
      {note.note.split('\n').map((el, i) => {
        if (previousNote) {
          return (
            <span key={i}>
              Note description changed:
              <br />
              Old:
              <br />
              {previousNote}
              <br />
              New:
              <br />
              {el}
              <br />
            </span>
          )
        } else {
          return (
            <span key={i}>
              {el}
              <br />
            </span>
          )
        }
      })}
    </>
  )
}

export default NormalNoteContent
