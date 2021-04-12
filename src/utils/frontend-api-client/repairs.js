import axios from 'axios'
import qs from 'qs'

export const PAGE_SIZE_CONTRACTORS = 10
export const PAGE_SIZE_AGENTS = 50

export const getRepairs = async (pageNumber = 1, options) => {
  const { data } = await axios.get('/api/repairs/', {
    params: {
      PageSize: PAGE_SIZE_CONTRACTORS,
      PageNumber: pageNumber,
      ...(options.StatusCode && { StatusCode: options.StatusCode }),
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })

  return data
}

export const getRepairsForProperty = async (
  propertyReference,
  pageNumber = 1
) => {
  const { data } = await axios.get('/api/repairs/', {
    params: {
      propertyReference: propertyReference,
      PageSize: PAGE_SIZE_AGENTS,
      PageNumber: pageNumber,
    },
  })

  return data
}

// export const getPendingApprovalRepairs = async (pageNumber = 1) => {
//   const { data } = await axios.get('/api/repairs/', {
//     params: {
//       PageSize: PAGE_SIZE_CONTRACTORS,
//       PageNumber: pageNumber,
//       StatusCode: PENDING_APPROVAL,
//     },
//   })

//   return data
// }

export const getRepair = async (workOrderReference) => {
  const { data } = await axios.get(`/api/repairs/${workOrderReference}`)

  return data
}
