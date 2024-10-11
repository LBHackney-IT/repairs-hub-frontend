import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

const completeUpload = async (
  workOrderReference: string,
  s3Objects: string[],
  description: string,
  uploadGroupLabel: string
) => {
  try {
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

    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
}

export default completeUpload
