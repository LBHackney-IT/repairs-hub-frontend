import ErrorMessage from '../../Errors/ErrorMessage'
import { Button, DataList } from '../../Form'
import Spinner from '../../Spinner'
import SuccessMessage from '../Components/SuccessMessage'
import Layout from '../Layout'
import useSelectContractor from './useSelectContractor'

import {
  fetchContractors,
  fetchContracts,
  fetchTrades,
  saveSorCodesToDatabase,
} from './utils'

import SorCode from '@/root/src/models/sorCode'
import { useEffect, useReducer, useState } from 'react'
import NewSORCode from '../Components/NewSORCode'
import useSelectTrade from './useSelectTrade'

const initialState = {
  sorCodes: [new SorCode(1)],
}

function reducer(state, action) {
  switch (action.type) {
    case 'add_new_sor_code':
      return {
        sorCodes: [...state.sorCodes, action.payload],
      }
    case 'remove_last_sor_code':
      return {
        sorCodes: state.sorCodes.filter(
          (sorCode) => sorCode.id !== action.payload.id
        ),
      }
    case 'sor_code_change': {
      const index = state.sorCodes.findIndex(
        (sorCode) => sorCode.id == action.payload.sorCodeId
      )

      state.sorCodes[index][action.payload.editedField] =
        action.payload.targetValue
      return { sorCodes: state.sorCodes }
    }
    default:
      return state
  }
}

const AddSORCodes = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
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

  // Used for CSV bulk upload
  // const {
  //   handleFileOnChange,
  //   parsedDataArray,
  //   validateFile,
  //   loading: fileLoading,
  // } = useFileUpload()

  const resetForm = () => {
    setSelectedContract(null)
    setRequestError(null)
    setFormSuccess(null)
    setErrors({})

    handleSelectContractor(null)
    handleSelectTrade(null)

    // Used for CSV bulk upload
    // handleFileOnChange(null)
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

  const handleAddNewSORCode = (e) => {
    e.preventDefault()
    dispatch({
      type: 'add_new_sor_code',
      payload: new SorCode(generateNewSORCodeId()),
    })
  }

  const handleRemoveSORCode = (e, sorCode) => {
    e.preventDefault()
    dispatch({ type: 'remove_last_sor_code', payload: sorCode })
  }

  const handleSORCodeFieldChange = (e, sorCodeId, editedField) => {
    dispatch({
      type: 'sor_code_change',
      payload: {
        targetValue: e.target.value,
        sorCodeId: sorCodeId,
        editedField: editedField,
      },
    })
  }

  const renderSorCodesToAdd = () => {
    const sorCodesToAdd = state.sorCodes.map((sorCode) => {
      const errorsForThisSORCode = errors.sorCodesErrors?.find(
        (sorCodeErrorsObject) => sorCodeErrorsObject.id == sorCode.id
      )

      return (
        <NewSORCode
          key={sorCode.id}
          sorCode={sorCode}
          handleRemoveSORCode={handleRemoveSORCode}
          handleSORCodeFieldChange={handleSORCodeFieldChange}
          errors={errorsForThisSORCode}
        ></NewSORCode>
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

  const checkFormForErrors = () => {
    const formErrors = {}

    // Used for CSV bulk upload
    // if (parsedDataArray === null) {
    //   formErrors.fileUpload = 'Please upload a CSV file'
    // } else if (!validateFile()) {
    //   formErrors.fileUpload = 'The CSV must contain the specified headers'
    // }

    if (selectedContractor === null) {
      formErrors.contractor = 'Please select a contractor'
    }

    if (selectedContract === null) {
      formErrors.contract = 'Please select a contract'
    }

    if (selectedTrade === null) {
      formErrors.trade = 'Please select a trade'
    }

    // Create array to track potential errors with new SOR codes
    formErrors.sorCodesErrors = []

    state.sorCodes.forEach((sorCode) => {
      const sorCodeErrorsObject = checkNewSORCodeForErrors(sorCode)

      // Now we check if the SorCodeErrorObject has any errors (any properties set to 'true'), if yes it's an error.
      if (!isNewSORCodeValid(sorCodeErrorsObject)) {
        formErrors.sorCodesErrors.push(sorCodeErrorsObject)
      }
    })

    return formErrors
  }

  const checkNewSORCodeForErrors = (sorCode) => {
    // We have a look at each property/field of each new SOR code.
    // If the form field value of a property is falsy, we mark it as true,
    // meaning there's an error with it (most likely field left blank)
    const sorCodeErrorsObject = {
      id: sorCode.id,
      code: !sorCode.code ? true : false,
      cost: !sorCode.cost ? true : false,
      standardMinuteValue: !sorCode.standardMinuteValue ? true : false,
      shortDescription: !sorCode.shortDescription ? true : false,
      longDescription: !sorCode.longDescription ? true : false,
    }

    return sorCodeErrorsObject
  }

  const isNewSORCodeValid = (sorCodeErrorsObject) => {
    // Any property set to 'true' represents an error
    for (const property in sorCodeErrorsObject) {
      if (property == 'id') continue
      if (sorCodeErrorsObject[property] == true) return false
    }

    return true
  }

  const validateForm = () => {
    const formErrors = checkFormForErrors()
    setErrors(formErrors)

    // The 'Add SOR codes' button would be disabled, but if this was enabled via dev tools for any reason,
    // this prevents a web request with no SOR codes to be sent.
    if (state.sorCodes.length < 1) {
      return false
    }

    // If the form is valid, formErrors will have a key of "sorCodesErrors" set to "[]".
    // The empty array indicates no errors were found with the new added SOR codes.
    if (
      Object.keys(formErrors).length === 1 &&
      Object.keys(formErrors).includes('sorCodesErrors')
    ) {
      if (formErrors.sorCodesErrors.length > 0) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRequestError(null)
    setFormSuccess(null)

    // Used for CSV bulk upload
    // if (loading || fileLoading) return

    const formValid = validateForm()

    if (formValid == false) return

    setLoading(true)

    // Used for CSV bulk upload
    // const data = dataToRequestObject(
    //   parsedDataArray,
    //   selectedContract,
    //   selectedTrade.code
    // )

    const data = {
      sorCodes: state.sorCodes,
      contractReference: selectedContract,
      tradeCode: selectedTrade.code,
    }

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
                {state.sorCodes.length == 0 ? (
                  <a
                    className="lbh-link"
                    href="#"
                    onClick={(e) => handleAddNewSORCode(e)}
                  >
                    + Add a new SOR code
                  </a>
                ) : (
                  <a
                    className="lbh-link"
                    href="#"
                    onClick={(e) => handleAddNewSORCode(e)}
                  >
                    + Add another SOR code
                  </a>
                )}
              </div>
              <div>
                <Button
                  label="Add SOR Codes"
                  type="submit"
                  disabled={state.sorCodes.length == 0}
                  data-testid="submit-button"
                />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default AddSORCodes
