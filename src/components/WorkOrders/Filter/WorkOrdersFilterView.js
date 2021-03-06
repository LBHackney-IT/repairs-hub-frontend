import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getFilters } from '../../../utils/frontend-api-client/filters'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import WorkOrdersFilter from './WorkOrdersFilter'
import { SelectedFilterOptions } from '../../../utils/helpers/filter'

const WorkOrdersFilterView = ({
  onFilterSubmit,
  appliedFilters,
  clearFilters,
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
      const workOrderFilters = await getFilters('WorkOrder')

      const selectedFilters = new SelectedFilterOptions(
        appliedFilters,
        workOrderFilters
      ).getSelectedFilterOptions()

      setFilters(workOrderFilters)
      setSelectedFilters(selectedFilters)
    } catch (e) {
      setFilters(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
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
}

export default WorkOrdersFilterView
