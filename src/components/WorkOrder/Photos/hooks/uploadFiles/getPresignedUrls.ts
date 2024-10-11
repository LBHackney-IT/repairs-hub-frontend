import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { Link } from '../types'

const getPresignedUrls = async (
  workOrderReference: string,
  numberOfFiles: number
) => {
  try {
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

    return { success: true, result }
  } catch (error) {
    let errorMessage = ''

    if (typeof error == 'string') {
      errorMessage = error
    } else {
      errorMessage = error.message
    }

    return { success: false, error: errorMessage }
  }
}

export default getPresignedUrls
