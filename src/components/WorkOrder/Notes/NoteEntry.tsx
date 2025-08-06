import { formatDateTime } from '@/utils/time'
import { Note } from './types'
import NormalNoteContent from './NoteContent/NormalNoteContent'
import NoteWithImageContent from './NoteContent/NoteWithImageContent'
import CompletedNoteContent from './NoteContent/CompletedNoteContent'
import { WorkOrder } from '@/root/src/models/workOrder'
import { TabName } from '../../Tabs/tabNames'
import { WorkOrderAppointmentDetails } from '@/root/src/models/workOrderAppointmentDetails'

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
  if (userNote === null) return false
  return userNote.includes(IMAGE_DETECTION_STRING)
}

interface Props {
  note: Note
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  setActiveTab: (tab: string) => void
}

const NoteEntry = ({
  note,
  workOrder,
  setActiveTab,
  appointmentDetails,
}: Props) => {
  return (
    <>
      <div className="note-info lbh-body-s">
        <NoteInfo note={note} />
      </div>

      <NoteContent
        note={note}
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
        setActiveTab={setActiveTab}
      />
    </>
  )
}

const NoteContent = ({
  note,
  workOrder,
  appointmentDetails,
  setActiveTab,
}: {
  note: Note
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  setActiveTab: (tabName: TabName) => void
}) => {
  if (
    note.noteGeneratedOnFrontend &&
    note.typeCode.toString() === '0' &&
    note.otherType === 'completed'
  ) {
    return (
      <CompletedNoteContent
        note={note}
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
        setActiveTab={setActiveTab}
      />
    )
  }

  if (DetectImageNote(note.note)) {
    return <NoteWithImageContent note={note} />
  }

  return <NormalNoteContent note={note} />
}

export default NoteEntry
