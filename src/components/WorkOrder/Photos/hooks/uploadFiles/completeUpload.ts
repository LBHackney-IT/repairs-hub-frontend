import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import faultTolerantRequest from './faultTolerantRequest'

const completeUpload = async (
  workOrderReference: string,
  s3Objects: string[],
  description: string,
  uploadGroupLabel: string
) => {
  const requestOperation = async () => {
    const result = await frontEndApiRequest({
      method: 'post',
      path: `/api/workOrders/images/completeUpload`,
      requestData: {
        workOrderReference,
        s3Objects,
        description,
        uploadGroupLabel,
      },
    })
    return result
  }

  const faultTolerantResult = await faultTolerantRequest(requestOperation, 5)

  if (!faultTolerantResult.success) {
    return {
      success: false,
      error: faultTolerantResult.error?.message || 'Request failed',
    }
  }

  return { success: true, result: faultTolerantResult.data }
}

export default completeUpload
