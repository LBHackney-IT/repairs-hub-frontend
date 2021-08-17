import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import WorkOrdersHistoryView from '../Property/WorkOrdersHistory/WorkOrdersHistoryView'
import TasksAndSorsView from '../WorkOrder/TasksAndSors/TasksAndSorsView'
import NotesView from '../WorkOrder/Notes/NotesView'
import VariationSummaryTab from './VariationSummaryTab'
import { enableGOVUKFrontendJavascript } from '../../utils/govuk'

const Tabs = ({
  tabsList,
  propertyReference,
  workOrderReference,
  tasksAndSors,
}) => {
  const router = useRouter()

  const formatTabNameToId = (tabName) => {
    if (tabName.includes('tab')) {
      return tabName
    }

    return `${tabName.replace(/ +/g, '-').toLowerCase()}-tab`
  }
  const [activeTab, setActiveTab] = useState(
    router.asPath.split('#')[1] || formatTabNameToId(tabsList[0])
  )

  useEffect(() => {
    // Required for GOVUK tabs functionality
    enableGOVUKFrontendJavascript()
  }, [])

  const renderTabComponentView = (activeTabId, tabName) => {
    switch (activeTabId) {
      case 'work-orders-history-tab':
        return (
          <WorkOrdersHistoryView
            propertyReference={propertyReference}
            tabName={tabName}
          />
        )
      case 'tasks-and-sors-tab':
        return (
          <TasksAndSorsView
            workOrderReference={workOrderReference}
            tabName={tabName}
            tasksAndSors={tasksAndSors}
          />
        )
      case 'notes-tab':
        return (
          <NotesView
            workOrderReference={workOrderReference}
            tabName={tabName}
          />
        )
      case 'pending-variation-tab':
        return (
          <VariationSummaryTab
            workOrderReference={workOrderReference}
            tabName={tabName}
          />
        )
      default:
        return (
          <WorkOrdersHistoryView
            propertyReference={propertyReference}
            tabName={tabName}
          />
        )
    }
  }

  let activeTabId = formatTabNameToId(activeTab)

  return (
    <div
      className="govuk-tabs lbh-tabs govuk-!-display-none-print"
      data-module="govuk-tabs"
    >
      <h2 className="govuk-tabs__title">Contents</h2>

      <ul className="govuk-tabs__list hackney-tabs-list">
        {tabsList.map((tab, i) => {
          return (
            <li key={i} className="govuk-tabs__list-item">
              <a
                onClick={() =>
                  setActiveTab(tabsList.find((elem) => elem === tab))
                }
                className="govuk-tabs__tab"
                href={`#${formatTabNameToId(tab)}`}
              >
                {tab}
              </a>
            </li>
          )
        })}
      </ul>

      {tabsList.map((tab, i) => {
        let tabId = formatTabNameToId(tab)

        return (
          <div
            key={i}
            className="govuk-tabs__panel hackney-tabs-info hackney-tabs-panel"
            id={tabId}
          >
            {activeTabId == tabId && renderTabComponentView(activeTabId, tab)}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
