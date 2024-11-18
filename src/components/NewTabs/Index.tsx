import { useState } from 'react'

import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'

interface TabProps {
  titles: string[]
  onTabChange?: (index: number) => void
  ariaSelected: 0 | 1
}
const NewTabs = ({ titles, onTabChange, ariaSelected }: TabProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter') {
      onTabChange(i)
    }
  }
  return (
    <>
      <ul className="new-hackney-tabs-list govuk-tabs__list">
        {titles.map((tab, i) => {
          return (
            <li
              onClick={() => onTabChange(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              key={i}
              id={`tab-${i + 1}`}
              className="new-govuk-tabs__list-item"
              aria-selected={ariaSelected === i ? 'true' : 'false'}
              role="tab"
              aria-controls={`tabpanel-${i + 1}`}
              tabIndex={0}
            >
              <a className="new-govuk-tabs_list-item-a-tag">{tab}</a>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default NewTabs
