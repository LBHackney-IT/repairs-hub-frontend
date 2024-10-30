import { ReactEventHandler, useState } from 'react'
import { useRouter } from 'next/router'
const NewTabs = () => {
  const router = useRouter()
  const tabTitles = ['Current Work Orders', 'Past Work Orders']

  const [activeTab, setActiveTab] = useState(0)

  const changeActiveTab = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setActiveTab(index)
    activeTab === 1 ? router.push('/oldjobs') : router.push('/')
  }

  return (
    <>
      <div
        className="govuk-tabs lbh-tabs govuk-!-display-none-print"
        data-module="govuk-tabs"
      >
        <ul className="govuk-tabs__list hackney-tabs-list govuk-tabs__panel hackney-tabs-info hackney-tabs-panel">
          {tabTitles.map((tab, i) => {
            return (
              <li key={i} className="govuk-tabs__list-item">
                <a
                  onClick={(e) => changeActiveTab(e, i)}
                  className="govuk-tabs__tab"
                >
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

export default NewTabs
