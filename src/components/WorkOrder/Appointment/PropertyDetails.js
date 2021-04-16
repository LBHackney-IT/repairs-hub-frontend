import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../../Layout/Grid'
import TenureAlertDetails from '../../Property/TenureAlertDetails'

const AppointmentHeader = ({
  address,
  subTypeDescription,
  locationAlerts,
  personAlerts,
  tenure,
  canRaiseRepair,
}) => {
  return (
    <GridRow className="govuk-body-s govuk-!-margin-bottom-2">
      <GridColumn width="two-thirds">
        <h1 className="lbh-heading-l govuk-!-margin-bottom-2">
          {subTypeDescription}: {address.addressLine}
        </h1>

        <TenureAlertDetails
          tenure={tenure}
          locationAlerts={locationAlerts}
          personAlerts={personAlerts}
          canRaiseRepair={canRaiseRepair}
        />
      </GridColumn>
    </GridRow>
  )
}

AppointmentHeader.propTypes = {
  address: PropTypes.object.isRequired,
  subTypeDescription: PropTypes.string.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
}

export default AppointmentHeader
