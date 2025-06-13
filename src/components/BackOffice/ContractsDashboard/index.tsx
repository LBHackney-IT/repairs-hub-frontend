import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Layout from '../Layout'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { ContractsListItems } from './ContractsListItems'
import { getContracts } from '@/root/src/utils/requests/contracts'

import Contract from '@/root/src/models/contract'

const ContractsDashboard = () => {
  const router = useRouter()
  const pageFromQuery = parseInt(router.query.page as string) || 1

  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>()
  const [contracts, setContracts] = useState<null | Contract[]>(null)
  const [pageNumber, setPageNumber] = useState(pageFromQuery)
  const pageSize = 10

  useEffect(() => {
    if (pageNumber !== pageFromQuery) {
      setPageNumber(pageFromQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page])

  // When user clicks next/prev, update the URL (which will update pageNumber via the effect above)
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

  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const totalPages = Math.ceil(contracts?.length / 10)

  const fetchContracts = async () => {
    const contractsReponse = await getContracts()

    if (!contractsReponse.success) {
      setError(contractsReponse.error?.message)
      setLoading(false)
      return
    }
    setContracts(contractsReponse.response)
    setLoading(false)
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const filteredContracts = () => {
    return contracts?.slice().reverse().slice(startIndex, endIndex)
  }

  return (
    <Layout title="Contracts Dashboard">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage label={error} />
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
