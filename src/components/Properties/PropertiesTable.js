import PropTypes from 'prop-types'
import PropertyRow from '../Property/PropertyRow'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

const PropertiesTable = ({ properties, query }) => (
  <div>
    <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

    <Table className="govuk-!-margin-top-5">
      <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
        We found {properties.length} matching results for: {decodeURI(query)}
      </caption>
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
