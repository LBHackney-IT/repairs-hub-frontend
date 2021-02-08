import PropTypes from 'prop-types'
import { formatDateTime } from '../../../utils/time'

const NoteInfo = ({ time, user, email }) => {
  return (
    <>
      {time ? formatDateTime(time) : '—'}{' '}
      {user && email ? `by ${user} (${email})` : ''}
    </>
  )
}

const NoteEntry = ({ note, time, user, userEmail }) => {
  return (
    <>
      <div className="note-info govuk-body-s">
        <NoteInfo time={time} user={user} email={userEmail} />
      </div>
      {note}
    </>
  )
}

NoteEntry.propTypes = {
  note: PropTypes.string.isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  user: PropTypes.string,
}

export default NoteEntry
