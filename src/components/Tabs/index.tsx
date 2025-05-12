import { useState } from 'react'
import { useRouter } from 'next/router'
import { WorkOrder } from '../../models/workOrder'
import { TabName } from './tabNames'
import classNames from 'classnames'
import { TAB_REGISTRY } from './tabRegistry'

interface Props {
  tabsList: TabName[]
  propertyReference?: string
  workOrderReference?: string
  tasksAndSors?: any // not sure
  budgetCode?: any
  workOrder?: WorkOrder
  setActiveTab?: (tabName: TabName) => void
}

const Tabs = (props: Props) => {
  const {
    tabsList,
    propertyReference,
    workOrderReference,
    tasksAndSors,
    budgetCode,
    workOrder,
    setActiveTab,
  } = props

  const router = useRouter()

  const QUERY_KEY = 'currentTab'

  const [currentTab, setCurrentTab] = useState<TabName>(() => {
    const firstTab = tabsList[0]
    const currentQuery = router?.query?.[QUERY_KEY] ?? null

    if (currentQuery === null) return firstTab

    const matchingTabs = Object.keys(TAB_REGISTRY)
      .map((x) => TAB_REGISTRY[x])
      .filter((x) => x.id === currentQuery)

    if (matchingTabs.length === 0) return firstTab

    return matchingTabs[0].name
  })

  const handleSelectTab = (newTab: TabName) => {
    if (newTab === currentTab) return

    setCurrentTab(() => newTab)

    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        [QUERY_KEY]: TAB_REGISTRY[newTab].id,
      },
    })
  }

  const TabComponent = TAB_REGISTRY[currentTab].component

  return (
    <div>
      <ul className="tabs-list">
        {tabsList.map((tab, i) => {
          return (
            <li key={i} className="tabs-list-item">
              <button
                onClick={() => handleSelectTab(tab)}
                className={classNames('tabs-button', {
                  active: tab === currentTab,
                })}
              >
                {tab}
              </button>
            </li>
          )
        })}
      </ul>

      <hr className="tabs-hr" />

      <div id={TAB_REGISTRY[currentTab].id}>
        <TabComponent
          tabName={currentTab}
          propertyReference={propertyReference}
          workOrderReference={workOrderReference}
          tasksAndSors={tasksAndSors}
          budgetCode={budgetCode}
          workOrder={workOrder}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  )
}

export default Tabs
