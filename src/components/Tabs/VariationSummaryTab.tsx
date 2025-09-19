import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import UserContext from '../UserContext'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import VariationAuthorisationSummary from '../WorkOrder/Authorisation/VariationAuthorisationSummary'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { calculateTotalVariedCost } from '@/utils/helpers/calculations'
import {
  Variation,
  VariationResponseObject,
} from '../../types/variations/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'

interface Props {
  workOrderReference: string
}

const VariationSummaryTab = ({ workOrderReference }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [variation, setVariation] = useState<Variation | null>(null)
  const [originalSors, setOriginalSors] = useState([])
  const { user } = useContext(UserContext)
  const [totalCostAfterVariation, setTotalCostAfterVariation] = useState()

  const requestVariationTasks = async (workOrderReference: string) => {
    setError(null)

    try {
      const variationResponse: VariationResponseObject =
        await frontEndApiRequest({
          method: 'get',
          path: `/api/workOrders/${workOrderReference}/variation-tasks`,
        })

      setVariation(variationResponse.variation)

      const totalCostAfterVariation = calculateTotalVariedCost(
        variationResponse.variation.tasks
      )
      setTotalCostAfterVariation(totalCostAfterVariation)
    } catch (e) {
      setVariation(null)
      console.error('An error has occured:', e.response)
      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
        return
      }

      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const getTasksAndSorsView = async (workOrderReference) => {
    setError(null)

    try {
      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setOriginalSors(tasksAndSors.filter((t) => t.original))
    } catch (e) {
      setOriginalSors(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    requestVariationTasks(workOrderReference)
    getTasksAndSorsView(workOrderReference)
  }, [])

  if (loading) return <Spinner />

  if (variation && variation.tasks && originalSors) {
    return (
      <>
        {user.roles.includes('contract_manager') && (
          <div className="display-inline">
            <Link
              href={`/work-orders/${workOrderReference}/variation-authorisation`}
            >
              <a className="lbh-link">Variation Authorisation</a>
            </Link>
          </div>
        )}

        <VariationAuthorisationSummary
          variationTasks={variation}
          originalSors={originalSors}
          totalCostAfterVariation={totalCostAfterVariation}
        />
        {error && <ErrorMessage label={error} />}
      </>
    )
  }

  return (
    <p className="lbh-body-s">There are no variations for this work order.</p>
  )
}

export default VariationSummaryTab
