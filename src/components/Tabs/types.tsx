import { ComponentType } from 'react'
import { WorkOrder } from '../../models/workOrder'
import WorkOrdersHistoryView from '../Property/WorkOrdersHistory/WorkOrdersHistoryView'
import RelatedWorkOrdersView from '../WorkOrders/RelatedWorkOrdersView/RelatedWorkOrdersView'
import TasksAndSorsView from '../WorkOrder/TasksAndSors/TasksAndSorsView'
import NotesView from '../WorkOrder/Notes/NotesView'
import VariationSummaryTab from './VariationSummaryTab'
import PhotosTab from '../WorkOrder/Photos/PhotosTab'

interface TabComponentProps {
  propertyReference: string
  workOrderReference: string
  tasksAndSors: any
  budgetCode: any
  workOrder: WorkOrder
  tabName: string
  setActiveTab: (tab: string) => void
}

interface TabDefinition {
  name: string
  id: string
  component: ComponentType<TabComponentProps> // Component to render
}

export enum TabName {
  TasksAndSors = 'Tasks and SORs',
  Notes = 'Notes',
  PendingVariation = 'Pending variation',
  WorkOrderHistory = 'Work orders history',
  RelatedWorkOrders = 'Related work orders',
  Photos = 'Photos',
}

type TabRegistry = {
  [key in TabName]: TabDefinition & { name: key }
}

// export const TABS_REGISTRY: Record<string, TabDefinition> = {
export const TABS_REGISTRY: TabRegistry = {
  [TabName.WorkOrderHistory]: {
    name: TabName.WorkOrderHistory,
    id: 'work-orders-history-tab',
    component: WorkOrdersHistoryView,
  },
  [TabName.RelatedWorkOrders]: {
    name: TabName.RelatedWorkOrders,
    id: 'related-work-orders-tab',
    component: RelatedWorkOrdersView,
  },
  [TabName.TasksAndSors]: {
    name: TabName.TasksAndSors,
    id: 'tasks-and-sors-tab',
    component: TasksAndSorsView,
  },
  [TabName.Notes]: {
    name: TabName.Notes,
    id: 'notes-tab',
    component: NotesView,
  },
  [TabName.PendingVariation]: {
    name: TabName.PendingVariation,
    id: 'pending-variation-tab',
    component: VariationSummaryTab,
  },
  [TabName.Photos]: {
    name: TabName.Photos,
    id: 'photos-tab',
    component: PhotosTab,
  },
}
