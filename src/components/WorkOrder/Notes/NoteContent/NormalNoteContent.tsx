import { Note } from '../types'

const NormalNoteContent = ({ note }: { note: Note }) => {
  return note.note.split('\n').map((el, i) => (
    <span key={i}>
      {el}
      <br />
    </span>
  ))
}

export default NormalNoteContent
