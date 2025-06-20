import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import WorkOrdersFilter from './WorkOrdersFilter'
import { SelectedFilterOptions } from '@/utils/helpers/filter'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

const WorkOrdersFilterView = ({
  onFilterSubmit,
  appliedFilters,
  clearFilters,
  onFilterRemove,
}) => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [filters, setFilters] = useState()
  const [selectedFilters, setSelectedFilters] = useState()

  const onSubmit = async (formData) => {
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

      const selectedFilters = new SelectedFilterOptions(
        appliedFilters,
        workOrderFilters
      ).getSelectedFilterOptions()

      setFilters(workOrderFilters)
      setSelectedFilters(selectedFilters)
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

WorkOrdersFilterView.propTypes = {
  onFilterSubmit: PropTypes.func.isRequired,
  appliedFilters: PropTypes.object,
  onFilterRemove: PropTypes.func.isRequired,
}

export default WorkOrdersFilterView
