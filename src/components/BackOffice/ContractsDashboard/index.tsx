import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import ContractorsListItems from './ContractorsListItems'
import ContractListItems from './Contract/ContractListItems'
import { fetchContracts } from '@/root/src/components/BackOffice/requests'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const router = useRouter()
  const pageFromQuery = parseInt(router.query.page as string) || 1

  const { data, isLoading, error } = useQuery(
    ['contracts', { isActive: null, contractorReference: null }],
    () => fetchContracts(null, null)
  )

  const contracts = data as Contract[] | null

  const [pageNumber, setPageNumber] = useState(pageFromQuery)
  const pageSize = 10
  const startIndex = (pageNumber - 1) * pageSize
  const totalPages = Math.ceil((contracts?.length ?? 0) / pageSize)
  const endIndex = startIndex + pageSize

  useEffect(() => {
    if (pageNumber !== pageFromQuery) {
      setPageNumber(pageFromQuery)
    }
  }, [router.query.page])

  const handleSetPageNumber = (newPage: number) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Layout title="Contracts Dashboard">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage
          label={
            error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unexpected error occurred'
          }
        />
      ) : contracts?.length ? (
        <>
          <ContractListItems contracts={contracts} />
          <ContractorsListItems
            contracts={contracts}
            isLoading={isLoading}
            pageNumber={pageNumber}
            setPageNumber={handleSetPageNumber}
            totalPages={totalPages}
          />
        </>
      ) : (
        <WarningInfoBox
          header="No contracts found"
          name="No contracts warning"
        />
      )}
    </Layout>
  )
}

export default ContractsDashboard
