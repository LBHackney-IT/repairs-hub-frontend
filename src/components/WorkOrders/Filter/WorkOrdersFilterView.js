import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getFilters } from '../../../utils/frontend-api-client/filters'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import WorkOrdersFilter from './WorkOrdersFilter'

const WorkOrdersFilterView = ({
  onFilterSubmit,
  appliedFilters,
  clearFilters,
}) => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [statusFilters, setStatusFilters] = useState()
  const [priorityFilters, setPriorityFilters] = useState()

  const onSubmit = async (formData) => {
    formData.StatusCode = { ...formData.StatusCode }
    formData.Priorities = { ...formData.Priorities }

    onFilterSubmit(formData)
  }

  const getWorkOrdersFilterView = async () => {
    setError(null)

    try {
      const workOrderFilters = await getFilters('WorkOrder')

      removeUnusedFilters(workOrderFilters)
    } catch (e) {
      setStatusFilters(null)
      setPriorityFilters(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const removeUnusedFilters = (allFilters) => {
    const filteredFilters = allFilters.Status.filter(
      (status) => status.key != '70' && status.key != '110'
    )

    setStatusFilters(filteredFilters)
    setPriorityFilters(allFilters.Priority)
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
            statusFilters={statusFilters}
            priorityFilters={priorityFilters}
            register={register}
            appliedFilters={appliedFilters}
            clearFilters={clearFilters}
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
