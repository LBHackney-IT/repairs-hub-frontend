import WorkOrderUpdateView from '../WorkOrder/Update'
import { mobileViewUpdateWorkOrderLinks } from '../../utils/successPageLinks'

interface Props {
  workOrderReference: string
  operativePayrollNumber: string
}

const NewTaskForm = (props: Props) => {
  const { workOrderReference, operativePayrollNumber } = props

  return (
    <WorkOrderUpdateView
      reference={workOrderReference}
      // isMobileView={true}
      mobileViewLinks={mobileViewUpdateWorkOrderLinks(
        operativePayrollNumber,
        workOrderReference
      )}
    />
  )
}

export default NewTaskForm
