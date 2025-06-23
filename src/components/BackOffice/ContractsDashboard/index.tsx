import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { ContractsListItems } from './ContractsListItems'
import { fetchContracts } from '@/root/src/components/BackOffice/requests'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const router = useRouter()
  const pageFromQuery = parseInt(router.query.page as string) || 1

  const { data, isLoading, error } = useQuery('contracts', () =>
    fetchContracts(null, null)
  )

  const contracts = data as Contract[] | null

  const [pageNumber, setPageNumber] = useState(pageFromQuery)
  const pageSize = 10
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const totalPages = Math.ceil(contracts?.length / 10)

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

  const filteredContracts = () => {
    return contracts?.slice().reverse().slice(startIndex, endIndex)
  }

  return (
    <Layout title="Contracts Dashboard">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage label={error as string | null} />
      ) : contracts?.length ? (
        <ol className="lbh-list">
          <ContractsListItems
            filteredContracts={filteredContracts()}
            pageNumber={pageNumber}
            setPageNumber={handleSetPageNumber}
            totalPages={totalPages}
          />
        </ol>
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
