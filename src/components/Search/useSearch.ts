import { useState, useEffect, useContext, FormEvent } from 'react'
import { useRouter } from 'next/router'
import UserContext from '../UserContext'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { canSearchForProperty } from '@/utils/userPermissions'
import { PropertyListItem } from '@/models/propertyListItem'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'

interface SearchQuery {
  searchText?: string
}

interface PropertyData {
  total: string
  properties: PropertyListItem[]
}

const WORK_ORDER_REFERENCE_REGEX = /^[0-9]{7,10}$/

const useSearch = (query?: SearchQuery) => {
  const { NEXT_PUBLIC_PROPERTIES_PAGE_SIZE } = process.env

  const { user } = useContext(UserContext)
  const router = useRouter()

  const userCanSearchForProperty = user && canSearchForProperty(user)

  // The search text in the URL, e.g. ?searchText=10+Downing+St
  const urlSearchText = query?.searchText
    ? decodeURIComponent(query.searchText.replace(/\+/g, ' '))
    : ''

  // What the user has typed into the search box
  const [searchTextInput, setSearchTextInput] = useState<string>('')

  const [properties, setProperties] = useState<PropertyListItem[]>([])
  const [searchHitTotal, setSearchHitTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Users who can't search for properties, or who typed a work order
  // reference, are sent straight to the work order page
  const shouldGoToWorkOrder = (searchText: string) =>
    WORK_ORDER_REFERENCE_REGEX.test(searchText) || !userCanSearchForProperty

  const goToWorkOrder = (reference: string) => {
    router.push(`/work-orders/${reference}`)
  }

  const searchForProperties = async (searchText: string) => {
    if (searchText.trim().length <= 1) return

    setLoading(true)
    setError(null)

    try {
      const propertiesData: PropertyData = await frontEndApiRequest({
        method: 'get',
        path: '/api/properties/search',
        params: {
          searchText,
          pageSize: NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
        },
      })

      setSearchHitTotal(parseInt(propertiesData.total))
      setProperties(
        propertiesData.properties.map(
          (property) => new PropertyListItem(property)
        )
      )
    } catch (e) {
      setProperties(null)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  // On first load, act on the search text in the URL (if any)
  useEffect(() => {
    if (!urlSearchText) return

    if (shouldGoToWorkOrder(urlSearchText)) {
      goToWorkOrder(urlSearchText)
    } else {
      setSearchTextInput(urlSearchText)
      searchForProperties(urlSearchText)
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (shouldGoToWorkOrder(searchTextInput)) {
      goToWorkOrder(searchTextInput)
    } else {
      router.push({
        pathname: '/search',
        query: { searchText: searchTextInput },
      })
      searchForProperties(searchTextInput)
    }
  }

  return {
    userCanSearchForProperty,
    searchTextInput,
    setSearchTextInput,
    handleSubmit,
    urlSearchText,
    properties,
    searchHitTotal,
    loading,
    error,
  }
}

export default useSearch
