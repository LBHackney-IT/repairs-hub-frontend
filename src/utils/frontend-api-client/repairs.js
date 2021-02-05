import axios from 'axios'

const PAGE_SIZE = 10

export const getRepairs = async (pageNumber = 1) => {
  const { data } = await axios.get(
    `/api/repairs/?PageSize=${PAGE_SIZE}&PageNumber=${pageNumber}`
  )

  return data
}

export const getRepairsForProperty = async (propertyReference = null) => {
  if (propertyReference) {
    const { data } = await axios.get(
      `/api/repairs/?propertyReference=${propertyReference}`
    )

    return data
  }
}

export const getRepair = async (workOrderReference) => {
  const { data } = await axios.get(`/api/repairs/${workOrderReference}`)

  return data
}
