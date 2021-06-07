import PropTypes from 'prop-types'
import NoteEntry from './NoteEntry'

const NotesTimeline = ({ notes }) => {
  return (
    <>
      {notes.length ? (
        <ul className="lbh-list note-timeline">
          {notes.map((note, index) => (
            <li
              key={index}
              className="note-entry lbh-body-s"
              data-note-id={index}
            >
              <NoteEntry key={index} {...note} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="lbh-body-s">There are no notes for this work order.</p>
      )}
    </>
  )
}

NotesTimeline.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      note: PropTypes.string,
      user: PropTypes.string,
      time: PropTypes.instanceOf(Date),
    })
  ).isRequired,
}

export default NotesTimeline
