import { useState } from 'react'

import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'

interface TabProps {
  titles: string[]
  onTabChange?: (index: number) => void
}
const NewTabs = ({ titles, onTabChange }: TabProps) => {
  const [workOrdersSelected, setWorkOrdersSelected] = useState<boolean>(false)
  return (
    <>
      <ul className="hackney-tabs-list-mobile govuk-tabs__list">
        {titles.map((tab, i) => {
          return (
            <li
              onClick={() => onTabChange(i)}
              key={i}
              className="govuk-tabs__list-item-mobile"
              aria-selected={workOrdersSelected ? 'true' : 'false'}
            >
              {tab}
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
