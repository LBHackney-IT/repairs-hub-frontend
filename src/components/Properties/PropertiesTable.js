import PropTypes from 'prop-types'
import PropertyRow from '../Property/PropertyRow'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

const PropertiesTable = ({ properties, query }) => (
  <div>
    <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

    <h4 className="lbh-heading-h4">
      We found {properties.length} matching results for: {decodeURI(query)}
    </h4>

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
          <PropertyRow key={index} {...property} />
        ))}
      </TBody>
    </Table>
  </div>
)

PropertiesTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      propertyReference: PropTypes.string,
      address: PropTypes.object.isRequired,
      hierarchyType: PropTypes.object.isRequired,
    })
  ).isRequired,
  query: PropTypes.string.isRequired,
}

export default PropertiesTable
