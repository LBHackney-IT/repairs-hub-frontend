import { DataList, Button } from '../../Form'
import Spinner from '../../Spinner'
import TradeDataList from '../../WorkElement/TradeDataList'
import FileInput from '../Components/FileInput'
import Layout from '../Layout'

import { fetchContractors, fetchTrades, fetchContracts, saveSorCodesToDatabase } from './utils'

import { csvFileToArray } from './utils'

import { useState, useEffect } from 'react'

const AddSORCodes = () => {
  const [file, setFile] = useState(null)
  const [array, setArray] = useState(null)

  const [loading, setLoading] = useState(true)

  const [contractors, setContractors] = useState(null)
  const [selectedContractor, setSelectedContractor] = useState(null)

  const [trades, setTrades] = useState(null)
  const [selectedTradeCode, setSelectedTradeCode] = useState(null)

  const [loadingContracts, setLoadingContracts] = useState(false)
  const [contracts, setContracts] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)

  const [errors, setErrors] = useState({})

  const fileReader = typeof window !== 'undefined' && new window.FileReader()

  const handleOnChange = (e) => {
    if (e.target.files.length === 0) {
      setFile(null)
    } else {
      setFile(e.target.files[0])
    }
  }

  const readFile = () => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null)
        return
      }

      fileReader.onload = function (event) {
        const text = event.target.result

        const array = csvFileToArray(text)
        resolve(array)
      }

      fileReader.readAsText(file)
    })
  }

  

  const handleSelectContractor = (e) => {
    const selectedContractor = contractors.filter(
      (x) => x.contractorName === e.target.value
    )

    if (selectedContractor.length === 0) {
      setSelectedContractor(null)
    } else {
      setSelectedContractor(selectedContractor[0])
    }
  }

 

  useEffect(() => {
    console.log('first load')

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
  }, [selectedContractor])

  const handleSelectContract = (e) => {
    setSelectedContract(e.target.value)
  }

  const handleSelectTrade = (e) => {
    const selectedTrade = trades.filter((x) => x.name === e.target.value)

    // console.log({ selectedTrade})

    if (selectedTrade.length === 0) {
      setSelectedTradeCode(null)
    } else {
      setSelectedTradeCode(selectedTrade[0].code)
    }
  }

  const validateFileContainsExpectedHeaders = () => {
    const firstRow = array[0]

    const expectedHeaders = [
      'Code',
      'Cost',
      'StandardMinuteValue',
      'ShortDescription',
      'LongDescription',
    ]

    let fileContainsAllHeadings = true

    expectedHeaders.forEach((header) => {
      if (!firstRow.hasOwnProperty(header)) fileContainsAllHeadings = false
    })

    return fileContainsAllHeadings
  }

  const validate = () => {
    const newErrors = {}

    if (array === null) {
      newErrors.fileUpload = 'You must upload csv'
    } else if (!validateFileContainsExpectedHeaders()) {
      newErrors.fileUpload = 'The CSV must contain the specified headers'

    }

    console.log({ selectedContract })

    if (selectedContractor === null) {
      newErrors.contractor = "Please select a contractor"
    }

    if (selectedContract === null) {
      newErrors.contract = "Please select a contract"
    }

    if (selectedTradeCode === null) {
      newErrors.trade = "Please select a trade"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    // setLoading(true)

    // 1. import file
    var array = await readFile()
    setArray(array)

    var errors = validate()
    setErrors(errors)

    // there must be no erors
    if (Object.keys(errors).length > 0) return

    // console.log({ array })

    const formatted = array.map((x) => ({
      code: x.Code,
      cost: parseFloat(x.Cost),
      standardMinuteValue: parseFloat(x.StandardMinuteValue),
      shortDescription: x.ShortDescription,
      longDescription: x.LongDescription,
    }))

    const body = {
      contractReference: selectedContract,
      tradeCode: selectedTradeCode,
      contract: "placeholder",
      sorCodes: formatted,
    }


    
    setLoading(true)

    console.log(body)

    saveSorCodesToDatabase(body)
    .then(res => {
      console.log({ res})
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setLoading(false)
    })




  }

  return (
    <Layout title="Add SOR Codes">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <DataList
              name="contractor"
              label="Contractor"
              labelMessage="- Search by type (e.g. Gas) or code (e.g. GS)"
              options={contractors.map((x) => x.contractorName)}
              onChange={handleSelectContractor}
              error={errors.contractor && { message: errors.contractor }}
              value={selectedContractor?.contractorName}
            />

            {loadingContracts ? (
              <Spinner />
            ) : (
              <DataList
                name="contract"
                label="Contract"
                labelMessage="- Search by type (e.g. Gas) or code (e.g. GS)"
                options={contracts || []}
                disabled={selectedContractor === null}
                onChange={handleSelectContract}
                error={errors.contract && { message: errors.contract }}
                value={selectedContract}
              />
           
            )}

             <p>{selectedContract}</p>

            <DataList
              name="trade"
              label="Trade"
              labelMessage="- Search by type (e.g. Gas) or code (e.g. GS)"
              options={trades.map((x) => x.name)}
              onChange={handleSelectTrade}
              error={errors.trade && { message: errors.trade }}
              value={selectedTradeCode}
            />

            <p>
              Import a CSV document with the following headers:{' '}
              <pre>
                Code, Cost, StandardMinuteValue, ShortDescription,
                LongDescription
              </pre>
            </p>
            <FileInput
              name="File Upload"
              label="CSV Upload"
              type={'file'}
              id={'csvFileInput'}
              accept={'.csv'}
              onChange={handleOnChange}
              error={errors.fileUpload && { message: errors.fileUpload }}
              
            />

            <div>
              <Button label="Add SOR Codes" type="submit" />
            </div>
          </form>
        </>
      )}
    </Layout>
  )
}

export default AddSORCodes
