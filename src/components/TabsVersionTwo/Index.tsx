interface TabProps {
  titles: string[]
  onTabChange?: (index: number) => void
  ariaSelected: 0 | 1
}
const TabsVersionTwo = ({ titles, onTabChange, ariaSelected }: TabProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter') {
      onTabChange(i)
    }
  }
  return (
    <>
      <ul className="v2-hackney-tabs-list govuk-tabs__list">
        {titles.map((tab, i) => {
          return (
            <li
              onClick={() => onTabChange(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              key={i}
              id={`tab-${i + 1}`}
              className="v2-govuk-tabs__list-item"
              aria-selected={ariaSelected === i ? 'true' : 'false'}
              role="tab"
              aria-controls={`tabpanel-${i + 1}`}
              tabIndex={0}
            >
              <a className="v2-govuk-tabs_list-item-a-tag">{tab}</a>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default TabsVersionTwo
