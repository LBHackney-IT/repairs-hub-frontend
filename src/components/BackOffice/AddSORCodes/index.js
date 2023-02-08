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

import { useState, useEffect, useReducer } from 'react'
import useSelectTrade from './useSelectTrade'
import NewSORCode from '../NewSORCode'
import SorCode from '@/root/src/models/sorCode'

const initialState = {
  sorCodes: [
    new SorCode(1, 'asd1', '123', '456', 'short', 'long'),
    new SorCode(2, 'asd2', '456', '878', 'short', 'long'),
  ]
};

function reducer(state, action) {
  switch (action.type) {
    case 'add_new_sor_code':
      return {
        sorCodes: [...state.sorCodes, action.payload]
      };
    case 'remove_last_sor_code':
      return {
        sorCodes: state.sorCodes.filter(sorCode => sorCode.sorCode !== action.payload.sorCode)
      };
    default:
      return state;
  }
}

const AddSORCodes = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true)
  const [contractors, setContractors] = useState(null)
  const [trades, setTrades] = useState(null)
  const [loadingContracts, setLoadingContracts] = useState(false)
  const [contracts, setContracts] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
  const [errors, setErrors] = useState({})

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

  const resetForm = () => {
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

  const handleContractorChange = () => {
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

  const handleSelectContract = (e) => {
    setSelectedContract(e.target.value)
  }

  const handleAddSORCode = (sorCode) => {
    dispatch({ type: "add_new_sor_code", payload: new SorCode(generateNewSORCodeId(), 'asd3', '456', '878', 'short', 'long') })
  }

  const handleRemoveSORCode = (sorCode) => {
    dispatch({ type: 'remove_last_sor_code', payload: sorCode })
  }

  const renderSorCodesToAdd = () => {
    const sorCodesToAdd = state.sorCodes.map((sorCode) => {
      return (
        <NewSORCode key={sorCode.id} sorCode={sorCode} handleRemoveSORCode={handleRemoveSORCode}></NewSORCode>
      )
    })
    return sorCodesToAdd
  }

  const generateNewSORCodeId = () => {
    const assignedIds = state.sorCodes.map((sorCode) => sorCode.id)

    // If there are no new Added SorCodes, there will be no assigned Ids, 
    // so we start with ID 1, otherwise we pick the next higher/available one.
    return assignedIds.length == 0 ? 1 : Math.max(...assignedIds) + 1
  }

  const validate = () => {
    const newErrors = {}

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

  const handleSubmit = async (e) => {
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
      .catch((err) => {
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
        <Spinner />
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
              {requestError && <ErrorMessage label={requestError} />}

              <DataList
                name="contractor"
                label="Contractor"
                options={contractors.map((x) => x.contractorName)}
                onChange={handleSelectContractor}
                error={errors.contractor && { message: errors.contractor }}
                value={selectedContractor?.contractorName}
              />

              {loadingContracts ? (
                <Spinner />
              ) : (
                <div>
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

              <DataList
                name="trade"
                label="Trade"
                options={trades.map((x) => x.name)}
                onChange={handleSelectTrade}
                error={errors.trade && { message: errors.trade }}
                value={selectedTrade?.name || null}
              />

              <hr />

              {renderSorCodesToAdd()}

              <div>
                <a className="lbh-link" href="#" onClick={handleAddSORCode}>
                  + Add another SOR code
                </a>
              </div>

              {/* <div class="govuk-form-group lbh-form-group">
                <label class="govuk-label lbh-label" for="input-with-hint-text">
                  SOR code
                </label>
                <span id="input-with-hint-text-hint" class="govuk-hint lbh-hint">
                  Example: 4896830H
                </span>
                <input
                  class="govuk-select lbh-select"
                  id="input-with-hint-text"
                  name="test-name-2"
                  type="text"
                  aria-describedby="input-with-hint-text-hint"
                />
              </div>

              <div class="govuk-form-group lbh-form-group">
                <label class="govuk-label lbh-label" for="input-with-hint-text">
                  Cost (£)
                </label>
                <span id="input-with-hint-text-hint" class="govuk-hint lbh-hint">
                  Example: 10.47
                </span>
                <input
                  class="govuk-select lbh-select"
                  id="input-with-hint-text"
                  name="test-name-2"
                  type="text"
                  aria-describedby="input-with-hint-text-hint"
                />
              </div>


              <div class="govuk-form-group lbh-form-group">
                <label class="govuk-label lbh-label" for="input-with-hint-text">
                  Standard Minute Value (SMV)
                </label>
                <span id="input-with-hint-text-hint" class="govuk-hint lbh-hint">
                  Example: 29
                </span>
                <input
                  class="govuk-select lbh-select"
                  id="input-with-hint-text"
                  name="test-name-2"
                  type="text"
                  aria-describedby="input-with-hint-text-hint"
                />
              </div>

              <div class="govuk-form-group lbh-form-group">
                <label class="govuk-label lbh-label" for="input-with-hint-text">
                  Short description
                </label>
                <span id="input-with-hint-text-hint" class="govuk-hint lbh-hint">
                  Example: "LH Gas Carcass LGSR inc cooker"
                </span>
                <input
                  class="govuk-input lbh-input"
                  id="input-with-hint-text"
                  name="test-name-2"
                  type="text"
                  aria-describedby="input-with-hint-text-hint"
                />
              </div>

              <div class="govuk-form-group lbh-form-group">
                <label class="govuk-label lbh-label" for="input-with-hint-text">
                  Long description
                </label>
                <span id="input-with-hint-text-hint" class="govuk-hint lbh-hint">
                  Example: "LH Gas Carcass test. Test internal gas pipework for soundness from meter to all appliances. Visual check cooker or any other gas appliances, excludes gas fire. Issue LGSR Landlord gas safety record incl..."
                </span>
                <input
                  class="govuk-input lbh-input"
                  id="input-with-hint-text"
                  name="test-name-2"
                  type="text"
                  aria-describedby="input-with-hint-text-hint"
                />
              </div> */}

              {/* <p>
                Import a CSV document with the following headers:{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {expectedHeaders.join(', ')}
                </span>
              </p>

              <div>
                <TextInput
                  name="File Upload"
                  label="CSV Upload"
                  type={'file'}
                  id={'csvFileInput'}
                  accept={'.csv'}
                  onChange={handleFileOnChange}
                  error={errors.fileUpload && { message: errors.fileUpload }}
                />
              </div> */}

              <div>
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
