export interface WorkOrderHierarchy {
  rootParentId: string
  workOrders: {
    directParentId: string
    isRoot: boolean
    isSelf: boolean
    workOrder: HierarchyWorkOrder
  }[]
}

class HierarchyWorkOrder {
  reference: string
  dateRaised: string
  description: string
  status: string
  tradeCode: string
  tradeDescription: string
  isFollowOn: boolean
}
