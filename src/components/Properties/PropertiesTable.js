import PropTypes from 'prop-types'
import PropertyRow from '../Property/PropertyRow'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

const PropertiesTable = ({ properties }) => (
  <div>
    <Table className="govuk-!-margin-top-5">
      <THead>
        <TR className="lbh-body">
          <TH scope="col">Address</TH>
          <TH scope="col">Postcode</TH>
          <TH scope="col">Property type</TH>
          <TH scope="col">Property reference</TH>
        </TR>
      </THead>
      <TBody>
        {properties.map((property, index) => (
          <PropertyRow
            key={index}
            {...property}
          />
        ))}
      </TBody>
    </Table>
  </div>
)

PropertiesTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      propertyReference: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default PropertiesTable
