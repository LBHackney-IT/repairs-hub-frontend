import { DataList, Button } from '../../Form'
import Spinner from '../../Spinner'
import TextInput from '../../Form/TextInput'
import Layout from '../Layout'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'

import useFileUpload from './useFileUpload'
import useSelectContractor from './useSelectContractor'
import { expectedHeaders } from './useFileUpload'

import {
  fetchContractors,
  fetchTrades,
  fetchContracts,
  saveSorCodesToDatabase,
  dataToRequestObject,
} from './utils'

import { useState, useEffect } from 'react'
import useSelectTrade from './useSelectTrade'

import { Trade, Contractor } from './types'

interface Errors {
  fileUpload?: string
  contractor?: string
  contract?: string
  trade?: string
}



const AddSORCodes = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [contractors, setContractors] = useState<Array<Contractor>>(null)
  const [trades, setTrades] = useState<Array<Trade>>(null)
  const [loadingContracts, setLoadingContracts] = useState<boolean>(false)
  const [contracts, setContracts] = useState<Array<string>>(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState<boolean>(null)
  const [errors, setErrors] = useState<Errors>({})

  const { selectedContractor, handleSelectContractor } = useSelectContractor(
    contractors
  )
  const { selectedTrade, handleSelectTrade } = useSelectTrade(trades)
  const {
    handleFileOnChange,
    parsedDataArray,
    validateFile,
    loading: fileLoading,
  } = useFileUpload()

  const resetForm = (): void => {
    setSelectedContract(null)
    setRequestError(null)
    setFormSuccess(null)
    setErrors({})

    handleSelectContractor(null)
    handleSelectTrade(null)
    handleFileOnChange(null)
  }

  useEffect(() => {
    Promise.all([fetchContractors(), fetchTrades()])
      .then(([contractors, trades]) => {
        setContractors(contractors)
        setTrades(trades)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    handleContractorChange()
  }, [selectedContractor])

  const handleContractorChange = (): Promise<void> => {
    if (selectedContractor === null) {
      setContracts(null)
      setSelectedContract(null)
      return
    }

    setLoadingContracts(true)

    fetchContracts(selectedContractor.contractorReference)
      .then((res) => {
        setContracts(res)
      })
      .finally(() => {
        setLoadingContracts(false)
      })
  }

  const handleSelectContract = (e: Event): void => {
    const element = e.target as HTMLInputElement

    setSelectedContract(element.value)
  }

  const validate = (): Errors => {
    const newErrors: Errors = {}

    if (parsedDataArray === null) {
      newErrors.fileUpload = 'Please upload a CSV file'
    } else if (!validateFile()) {
      newErrors.fileUpload = 'The CSV must contain the specified headers'
    }

    if (selectedContractor === null) {
      newErrors.contractor = 'Please select a contractor'
    }

    if (selectedContract === null) {
      newErrors.contract = 'Please select a contract'
    }

    if (selectedTrade === null) {
      newErrors.trade = 'Please select a trade'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault()
    setRequestError(null)
    setFormSuccess(null)

    if (loading || fileLoading) return

    var errors = validate()
    setErrors(errors)

    // there must be no errors
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const data = dataToRequestObject(
      parsedDataArray,
      selectedContract,
      selectedTrade.code
    )

    saveSorCodesToDatabase(data)
      .then(() => {
        setFormSuccess(true)
      })
      .catch((err: ErrorEvent) => {
        console.log(err)
        setRequestError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout title="Add SOR Codes">
      {loading ? (
        <Spinner resource={null} />
      ) : (
        <>
          {formSuccess ? (
            <div>
              <SuccessMessage title="SOR Codes created" />
              <p>
                <a className="lbh-link" role="button" onClick={resetForm}>
                  Bulk-close more workOrders
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {requestError && (
                <>
                  {/* 
// @ts-ignore */}
                  <ErrorMessage label={requestError} />
                </>
              )}

              {/* 
// @ts-ignore */}
              <DataList
                name="contractor"
                label="Contractor"
                options={contractors.map((x) => x.contractorName)}
                onChange={handleSelectContractor}
                error={errors.contractor && { message: errors.contractor }}
                value={selectedContractor?.contractorName}
              />

              {loadingContracts ? (
                <Spinner resource={null} />
              ) : (
                <div>
                  {/* 
// @ts-ignore */}
                  <DataList
                    name="contract"
                    label="Contract"
                    options={contracts || []}
                    disabled={selectedContractor === null}
                    onChange={handleSelectContract}
                    error={
                      contracts?.length === 0
                        ? { message: 'No contracts found' }
                        : errors.contract && { message: errors.contract }
                    }
                    value={selectedContract}
                  />
                </div>
              )}

              {/* 
// @ts-ignore */}
              <DataList
                name="trade"
                label="Trade"
                options={trades.map((x) => x.name)}
                onChange={handleSelectTrade}
                error={errors.trade && { message: errors.trade }}
                value={selectedTrade?.name || null}
              />

              <p>
                Import a CSV document with the following headers:{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {expectedHeaders.join(', ')}
                </span>
              </p>

              <div>
                {/*  @ts-ignore */}
                <TextInput
                  name="File Upload"
                  label="CSV Upload"
                  type={'file'}
                  id={'csvFileInput'}
                  accept={'.csv'}
                  onChange={handleFileOnChange}
                  error={errors.fileUpload && { message: errors.fileUpload }}
                />
              </div>

              <div>
                {/* 
// @ts-ignore */}
                <Button label="Add SOR Codes" type="submit" />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default AddSORCodes
