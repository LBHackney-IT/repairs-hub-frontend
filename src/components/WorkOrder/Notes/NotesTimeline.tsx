import { WorkOrder } from '@/root/src/models/workOrder'
import NoteEntry from './NoteEntry'
import { Note } from './types'
import { TabName } from '../../Tabs/tabNames'
import { WorkOrderAppointmentDetails } from '@/root/src/models/workOrderAppointmentDetails'

interface Props {
  notes: Note[]
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  setActiveTab: (tabName: TabName) => void
}

const NotesTimeline = (props: Props) => {
  const {
    notes,
    workOrder,
    setActiveTab,
    appointmentDetails,
    appointmentDetailsError,
  } = props

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
              appointmentDetails={appointmentDetails}
              appointmentDetailsError={appointmentDetailsError}
              setActiveTab={setActiveTab}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default NotesTimeline
