import PropTypes from 'prop-types'
import PropertyRow from '../Property/PropertyRow'

const PropertiesTable = ({ properties, query }) => (
  <div>
    <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

    <p className="govuk-heading-s">We found {properties.length} matching results for: {decodeURI(query)}</p>

    <table className="govuk-table govuk-!-margin-top-5">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row govuk-body">
          <th scope="col" className="govuk-table__header">Address</th>
          <th scope="col" className="govuk-table__header">Postcode</th>
          <th scope="col" className="govuk-table__header">Property type</th>
          <th scope="col" className="govuk-table__header">Property reference</th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {properties.map((property, index) => (
          <PropertyRow key={index} {...property} />
        ))}
      </tbody>
    </table>
  </div>
)

PropertiesTable.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      propertyReference: PropTypes.string,
      address: PropTypes.object.isRequired,
      hierarchyType: PropTypes.object.isRequired
    })
  ).isRequired,
  query: PropTypes.string.isRequired
}

export default PropertiesTable
