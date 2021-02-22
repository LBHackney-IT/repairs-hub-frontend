import PropTypes from 'prop-types'
import RepairsHistoryRow from './RepairsHistoryRow'

const RepairsHistoryTable = ({
  workOrders,
  tabName,
  pageNumber,
  loadMoreWorkOrders,
}) => {
  return (
    <>
      <h2 className="govuk-heading-l">{tabName}</h2>

      <table className="govuk-table govuk-!-margin-top-5 repairs-history-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row govuk-body">
            <th scope="col" className="govuk-table__header">
              Reference
            </th>
            <th scope="col" className="govuk-table__header">
              Date raised
            </th>
            <th scope="col" className="govuk-table__header">
              Status
            </th>
            <th scope="col" className="govuk-table__header">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {workOrders.map((workOrder, index) => (
            <RepairsHistoryRow key={index} {...workOrder} />
          ))}
        </tbody>
      </table>
      <div className="page-navigation govuk-!-padding-bottom-5">
        <button
          className="govuk-button previous-page-button"
          data-module="govuk-button"
          onClick={() => loadMoreWorkOrders(pageNumber)}
        >
          Load more
        </button>
      </div>
    </>
  )
}

RepairsHistoryTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  workOrders: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.number,
      dateRaised: PropTypes.instanceOf(Date),
      status: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  pageNumber: PropTypes.number,
  loadMoreWorkOrders: PropTypes.func,
}

export default RepairsHistoryTable
