import WorkOrdersHistoryFilter from '../WorkOrdersHistoryFilter/Index'

const HeadingAndFilters = ({ onSelectTrade, clearFilters, tabName }) => {
  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      <WorkOrdersHistoryFilter
        onSelectTrade={(e) => onSelectTrade(e.target.value)}
        clearFilters={clearFilters}
      />
    </>
  )
}

export default HeadingAndFilters
