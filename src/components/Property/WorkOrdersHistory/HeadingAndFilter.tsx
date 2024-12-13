import WorkOrdersHistoryFilter from '../WorkOrdersHistoryFilter/Index'

interface HeadingAndFiltersProps {
  onSelectTrade: (trade: string) => void
  clearFilters: () => void
  tabName: string
}

const HeadingAndFilters = ({
  onSelectTrade,
  clearFilters,
  tabName,
}: HeadingAndFiltersProps) => {
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
