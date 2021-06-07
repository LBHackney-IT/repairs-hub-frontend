import PropTypes from 'prop-types'

const WorkOrderInfoTable = ({ workOrder }) => (
  <div>
    <table className="govuk-table lbh-table govuk-!-margin-top-5 govuk-!-width-full">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row" id="property">
          <th scope="row" className="govuk-table__header">
            Property
          </th>
          <td className="govuk-table__cell">{workOrder.property}</td>
        </tr>
        <tr className="govuk-table__row" id="tradeDescription">
          <th scope="row" className="govuk-table__header">
            Trade
          </th>
          <td className="govuk-table__cell">{workOrder.tradeDescription}</td>
        </tr>
        <tr className="govuk-table__row" id="description">
          <th scope="row" className="govuk-table__header">
            Description
          </th>
          <td className="govuk-table__cell">{workOrder.description}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

WorkOrderInfoTable.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default WorkOrderInfoTable
