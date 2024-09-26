import { formatDateTime } from '@/root/src/utils/time'
import { Note } from '../../types'
import generateMessage from './generateMessage'

interface Props {
  note: Note
  workOrder: Object
}

const CompletedNoteContent = ({ note, workOrder }: Props) => {
  const statusMessage = generateMessage(
    note.note,
    workOrder.closedDate,
    workOrder.operatives,
    // [],
    'Bonus'
  )

  return (
    <>
      <pre>{JSON.stringify(workOrder, null, 2)}</pre>

      <span>
        {statusMessage}
        <br />
      </span>

      <div style={{ background: '#eee', padding: '15px' }}>
        <span>
          Details of further work required <br />
        </span>

        <ul className="lbh-list lbh-list--bullet lbh-body-s">
          <li>
            Different trade: Electrical - Need to reconect wiring for kitchen
            light
          </li>
          <li>Stock item required: New light switch</li>
        </ul>
      </div>

      <br />

      <span>
        <a href="#photos-tab">2 photos uploaded</a> <br />
      </span>
    </>
  )
}

export default CompletedNoteContent
