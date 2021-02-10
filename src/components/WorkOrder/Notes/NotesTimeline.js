import PropTypes from 'prop-types'
import NoteEntry from './NoteEntry'

const NotesTimeline = ({ notes }) => {
  return (
    <>
      {notes.length ? (
        <ul className="govuk-list note-timeline">
          {notes.map((note, index) => (
            <li
              key={index}
              className="note-entry govuk-body-s"
              data-note-id={index}
            >
              <NoteEntry key={index} {...note} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="govuk-body-s">There are no notes for this work order.</p>
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
