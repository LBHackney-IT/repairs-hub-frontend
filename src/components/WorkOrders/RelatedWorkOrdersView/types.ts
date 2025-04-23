import { WorkOrder } from '@/root/src/models/workOrder'

export interface WorkOrderHierarchy {
  rootParentId: string
  workOrders: {
    directParentId: string
    isRoot: boolean
    isSelf: boolean
    workOrder: WorkOrder
  }[]
}
