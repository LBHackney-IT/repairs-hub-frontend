import { useMemo } from 'react'
import { getWorkOrderTasksRequest } from '@/requests/workOrders'
import { WorkOrderTasks } from '@/root/src/models/workOrderTasks'
import { sortObjectsByDateKey } from '@/utils/date'
import { useApiRequest } from './useApiRequest'

export const useWorkOrderTasks = (workOrderReference: string) => {
  const { data, error, isLoading } = useApiRequest(() =>
    getWorkOrderTasksRequest(workOrderReference)
  )

  const tasksAndSors = useMemo<WorkOrderTasks[]>(
    () =>
      data
        ? (sortObjectsByDateKey(
            data,
            ['dateAdded'],
            'dateAdded'
          ) as WorkOrderTasks[])
        : [],
    [data]
  )

  return { tasksAndSors, error, isLoading }
}
