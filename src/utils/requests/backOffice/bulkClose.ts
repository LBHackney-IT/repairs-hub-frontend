import { frontEndApiRequest } from '../../frontEndApiClient/requests'

export const bulkCloseWorkOrdersRequest = (
  closeToBase: boolean,
  requestData: object
) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/backOffice/bulk-close/${
      closeToBase ? 'close-to-base' : 'cancel'
    }`,
    requestData,
  })
