import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import WorkOrderHeader from './WorkOrderHeader'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton/BackButton'
import MultiButton from '../Layout/MultiButton/MultiButton'

import { WORK_ORDER_ACTIONS } from 'src/utils/workOrderActions'
import { WorkOrder } from '../../models/work-order'

const WorkOrderDetails = ({
  propertyReference,
  workOrder,
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  canRaiseRepair,
  schedulerSessionId,
}) => {
  const { user } = useContext(UserContext)

  const workOrderActionMenu = () => {
    return WORK_ORDER_ACTIONS.filter((choice) => {
      if (
        choice.permittedRoles.some((role) => user.roles.includes(role)) &&
        choice.permittedStatuses.includes(workOrder.status)
      ) {
        return choice
      }
    })
  }

  const currentWorkOrderActionMenu = workOrderActionMenu()

  return (
    <>
      <BackButton />

      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="lbh-heading-h1 display-inline govuk-!-margin-right-6">
            Work order: {workOrder.reference}
          </h1>
        </GridColumn>
        <GridColumn width="one-third">
          {currentWorkOrderActionMenu?.length > 0 && !workOrder.closedDated && (
            <MultiButton
              name="workOrderMenu"
              label="Select work order"
              secondary={false}
              choices={currentWorkOrderActionMenu}
              workOrderReference={workOrder.reference}
            />
          )}
        </GridColumn>
      </GridRow>
      <p className="lbh-body-m">{workOrder.description}</p>

      <WorkOrderHeader
        propertyReference={propertyReference}
        workOrder={workOrder}
        address={address}
        locationAlerts={locationAlerts}
        personAlerts={personAlerts}
        subTypeDescription={subTypeDescription}
        tenure={tenure}
        hasLinkToProperty={true}
        canRaiseRepair={canRaiseRepair}
        schedulerSessionId={schedulerSessionId}
      />
    </>
  )
}

WorkOrderDetails.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default WorkOrderDetails
