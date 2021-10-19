import OperativeWorkOrderDetails from './OperativeWorkOrderDetails'
import OperativeTasksAndSorsTable from '../WorkOrder/TasksAndSors/OperativeTasksAndSorsTable'
import WarningInfoBox from '../Template/WarningInfoBox'
import Link from 'next/link'
import { sortArrayByDate } from '../../utils/helpers/array'

const OperativeWorkOrder = ({
  workOrderReference,
  property,
  workOrder,
  personAlerts,
  locationAlerts,
  tasksAndSors,
}) => {
  return (
    <>
      <OperativeWorkOrderDetails
        property={property}
        workOrder={workOrder}
        personAlerts={personAlerts}
        locationAlerts={locationAlerts}
        tasksAndSors={tasksAndSors}
      />

      <OperativeTasksAndSorsTable
        workOrderReference={workOrderReference}
        tasksAndSors={sortArrayByDate(tasksAndSors, 'dateAdded')}
        tabName={'Tasks and SORs'}
      />

      <WarningInfoBox
        header="Need to make a change?"
        text="Any changes to the work order must be made on paper."
      />
      <Link href={`/work-orders/${workOrderReference}/tasks/new`}>
        <a
          role="button"
          draggable="false"
          class="govuk-button govuk-secondary lbh-button lbh-button--secondary"
          data-module="govuk-button"
        >
          Add new SOR
        </a>
      </Link>
      <br></br>
      <Link href={`/work-orders/${workOrderReference}/close`}>
        <a
          role="button"
          draggable="false"
          class="govuk-button lbh-button"
          data-module="govuk-button"
        >
          Confirm
        </a>
      </Link>
    </>
  )
}

export default OperativeWorkOrder
