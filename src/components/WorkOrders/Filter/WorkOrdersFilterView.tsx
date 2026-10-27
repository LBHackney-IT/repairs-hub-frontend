import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import WorkOrdersFilter from './WorkOrdersFilter'
import {
  SelectedFilterOptions,
  FilterOptionsByCategory,
} from '@/utils/helpers/filter'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

interface Props {
  onFilterSubmit: (formData: Record<string, Record<string, unknown>>) => void
  appliedFilters: Record<string, any>
  clearFilters: (e: MouseEvent<HTMLElement>) => void
  onFilterRemove: (category: string, index: number) => void
}

const WorkOrdersFilterView = ({
  onFilterSubmit,
  appliedFilters,
  clearFilters,
  onFilterRemove,
}: Props) => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>()
  const [filters, setFilters] = useState<FilterOptionsByCategory | null>()

  // Derived so the tags stay in step with the applied filters
  const selectedFilters = useMemo(
    () =>
      filters &&
      new SelectedFilterOptions(
        appliedFilters,
        filters
      ).getSelectedFilterOptions(),
    [filters, appliedFilters]
  )

  const onSubmit = async (
    formData: Record<string, Record<string, unknown>>
  ) => {
    formData.StatusCode = { ...formData.StatusCode }
    formData.Priorities = { ...formData.Priorities }

    onFilterSubmit(formData)
  }

  const getWorkOrdersFilterView = async () => {
    setError(null)

    try {
      const workOrderFilters = await frontEndApiRequest({
        method: 'get',
        path: '/api/filter/WorkOrder',
      })

      setFilters(workOrderFilters)
    } catch (e) {
      setFilters(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrdersFilterView()
  }, [])

  return (
    <>
      <div>
        <form
          role="form"
          id="repair-request-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <WorkOrdersFilter
            loading={loading}
            filters={filters}
            register={register}
            appliedFilters={appliedFilters}
            clearFilters={clearFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={onFilterRemove}
          />
        </form>
      </div>

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default WorkOrdersFilterView
