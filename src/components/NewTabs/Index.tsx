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
      <ul className="hackney-tabs-list-mobile govuk-tabs__list">
        {titles.map((tab, i) => {
          return (
            <li
              onClick={() => onTabChange(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              key={i}
              id={`tab-${i + 1}`}
              className="govuk-tabs__list-item-mobile"
              aria-selected={ariaSelected === i ? 'true' : 'false'}
              role="tab"
              aria-controls={`tabpanel-${i + 1}`}
              tabIndex={0}
            >
              <a className="govuk-tabs_list-item-mobile-a-tag">{tab}</a>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export const getServerSideProps = getQueryProps

NewTabs.permittedRoles = [OPERATIVE_ROLE]

export default NewTabs
