import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext'
import WorkOrderHeader from './WorkOrderHeader'
import { GridRow, GridColumn } from '../Layout/Grid'
import BackButton from '../Layout/BackButton'
import MultiButton from '../Layout/MultiButton'

import { WORK_ORDER_ACTIONS } from 'src/utils/workOrderActions'
import { WorkOrder } from '../../models/workOrder'

const WorkOrderDetails = ({
  property,
  workOrder,
  locationAlerts,
  personAlerts,
  tenure,
  schedulerSessionId,
  printClickHandler,
}) => {
  const { user } = useContext(UserContext)

  const workOrderActionMenu = () => {
    return WORK_ORDER_ACTIONS.filter((choice) => {
      if (choice.disabled) {
        return false
      } else if (
        choice.permittedRoles.some((role) => user.roles.includes(role)) &&
        choice.permittedStatuses.includes(workOrder.status)
      ) {
        return true
      }
    }).map((action) => {
      if (action.href === 'print') {
        return {
          ...action,
          onClickHandler: printClickHandler,
        }
      } else {
        return action
      }
    })
  }

  const currentWorkOrderActionMenu = workOrderActionMenu()

  return (
    <>
      <div className="govuk-!-display-none-print">
        <BackButton />

        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="lbh-heading-h1 display-inline govuk-!-margin-right-6">
              Work order: {workOrder.reference.toString().padStart(8, '0')}
            </h1>
          </GridColumn>
          <GridColumn width="one-third">
            {currentWorkOrderActionMenu?.length > 0 &&
              !workOrder.closedDated && (
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
          propertyReference={property.propertyReference}
          workOrder={workOrder}
          address={property.address}
          locationAlerts={locationAlerts}
          personAlerts={personAlerts}
          subTypeDescription={property.hierarchyType.subTypeDescription}
          tenure={tenure}
          hasLinkToProperty={true}
          canRaiseRepair={property.canRaiseRepair}
          schedulerSessionId={schedulerSessionId}
        />
      </div>
    </>
  )
}

WorkOrderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
}

export default WorkOrderDetails
