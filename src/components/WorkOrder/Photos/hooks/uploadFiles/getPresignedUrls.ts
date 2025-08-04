import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { Link } from '../types'
import faultTolerantRequest from './faultTolerantRequest'

const getPresignedUrls = async (
  workOrderReference: string,
  numberOfFiles: number
) => {
  const requestOperation = async () => {
    const result: {
      links: Link[]
    } = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/images/uploadLink`,
      params: {
        workOrderReference: workOrderReference,
        numberOfFiles: numberOfFiles,
      },
    })
    return result
  }

  const faultTolerantResult = await faultTolerantRequest(requestOperation)

  if (!faultTolerantResult.success) {
    return {
      success: false,
      error: faultTolerantResult.error?.message || 'Request failed',
    }
  }

  return { success: true, result: faultTolerantResult.data }
}

export default getPresignedUrls
