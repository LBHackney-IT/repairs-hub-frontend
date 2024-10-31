import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'

interface TabProps {
  titles: string[]
  onTabChange?: (index: number) => void
}
const NewTabs = ({ titles, onTabChange }: TabProps) => {
  return (
    <>
      <div
        className="govuk-tabs lbh-tabs govuk-!-display-none-print"
        data-module="govuk-tabs"
      >
        <ul className="govuk-tabs__list hackney-tabs-list govuk-tabs__panel hackney-tabs-info hackney-tabs-panel">
          {titles.map((tab, i) => {
            return (
              <li key={i} className="govuk-tabs__list-item">
                <a onClick={() => onTabChange(i)} className={`govuk-tabs__tab`}>
                  {tab}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export const getServerSideProps = getQueryProps

NewTabs.permittedRoles = [OPERATIVE_ROLE]

export default NewTabs
