import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import WorkOrdersHistoryView from '../Property/WorkOrdersHistory/WorkOrdersHistoryView'
import TasksAndSorsView from '../WorkOrder/TasksAndSors/TasksAndSorsView'
import NotesView from '../WorkOrder/Notes/NotesView'
import VariationSummaryTab from './VariationSummaryTab'
import PhotosTab from '../WorkOrder/Photos/PhotosTab'
import { WorkOrder } from '../../models/workOrder'
import RelatedWorkOrdersView from '../WorkOrders/RelatedWorkOrdersView/RelatedWorkOrdersView'

interface Props {
  tabsList: string[]
  propertyReference: string
  workOrderReference: string
  tasksAndSors: any // not sure
  budgetCode: any
  workOrder: WorkOrder
}

const Tabs = (props: Props) => {
  const {
    tabsList,
    propertyReference,
    workOrderReference,
    tasksAndSors,
    budgetCode,
    workOrder,
  } = props

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
    if (typeof window !== 'undefined') {
      require('lbh-frontend').initAll()
    }
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
      case 'related-work-orders-tab':
        return (
          <RelatedWorkOrdersView
            propertyReference={propertyReference}
            tabName={tabName}
          />
        )

      case 'tasks-and-sors-tab':
        return (
          <TasksAndSorsView
            tabName={tabName}
            tasksAndSors={tasksAndSors}
            budgetCode={budgetCode}
          />
        )
      case 'notes-tab':
        return (
          <NotesView
            workOrderReference={workOrderReference}
            workOrder={workOrder}
            tabName={tabName}
            setActiveTab={setActiveTab}
          />
        )
      case 'pending-variation-tab':
        return <VariationSummaryTab workOrderReference={workOrderReference} />
      case 'photos-tab':
        return (
          <PhotosTab
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

  const activeTabId = formatTabNameToId(activeTab)

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
                onClick={(e) => {
                  e.preventDefault()
                  setActiveTab(tabsList.find((elem) => elem === tab))
                }}
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
        const tabId = formatTabNameToId(tab)

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
