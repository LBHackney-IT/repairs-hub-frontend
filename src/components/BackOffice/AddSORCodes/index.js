import ErrorMessage from '../../Errors/ErrorMessage'
import { Button, DataList } from '../../Form'
import Spinner from '../../Spinner'
import SuccessMessage from '../Components/SuccessMessage'

import Layout from '../Layout'

import { fetchTrades, saveSorCodesToDatabase } from './utils'

import SorCode from '@/root/src/models/sorCode'
import { useEffect, useReducer, useState } from 'react'
import NewSORCode from '../Components/NewSORCode'
import useSelectTrade from './useSelectTrade'
import ConfirmationModal from '../../ConfirmationModal'

import useSelectContract from '../hooks/useSelectContract'

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
  const [trades, setTrades] = useState(null)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
  const [errors, setErrors] = useState({})
  const [showDialog, setShowDialog] = useState(false)

  const {
    contractors,
    handleSelectContractor,
    selectedContractor,
    contracts,
    selectedContract,
    loadingContracts,
    loadingContractors,
    handleSelectContract,
    handleFormReset,
  } = useSelectContract()

  const { selectedTrade, handleSelectTrade } = useSelectTrade(trades)

  const resetForm = () => {
    setRequestError(null)
    setFormSuccess(null)
    setErrors({})
    setShowDialog(false)
    state.sorCodes = [new SorCode(1)]

    handleFormReset()
    handleSelectTrade(null)
  }

  useEffect(() => {
    fetchTrades()
      .then((res) => {
        setTrades(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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

  const renderConfirmationModal = () => {
    if (showDialog) {
      return (
        <ConfirmationModal
          title={'Add new SOR codes?'}
          showDialog
          setShowDialog={setShowDialog}
          modalText={
            'You will not be able to edit the fields once the new SOR codes have been added. Please make sure the information entered is accurate before proceeding.'
          }
          onSubmit={addNewSORCodes}
          yesButtonText={'Add SOR codes'}
        />
      )
    }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setRequestError(null)
    setFormSuccess(null)

    if (!validateForm()) return

    setShowDialog(!showDialog)
  }

  const addNewSORCodes = async () => {
    setLoading(true)

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
        setShowDialog(false)
      })
  }

  return (
    <Layout title="Add SOR codes">
      {loading || loadingContractors ? (
        <Spinner />
      ) : (
        <>
          {formSuccess ? (
            <SuccessMessage
              title="SOR Codes created"
              resetFormText="Add more SOR codes"
              resetFormCallback={resetForm}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {requestError && <ErrorMessage label={requestError} />}

              {renderConfirmationModal()}

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
                    data-testid="add-new-sor-code-link"
                  >
                    + Add a new SOR code
                  </a>
                ) : (
                  <a
                    className="lbh-link"
                    href="#"
                    onClick={(e) => handleAddNewSORCode(e)}
                    data-testid="add-new-sor-code-link"
                  >
                    + Add another SOR code
                  </a>
                )}
              </div>
              <div>
                <Button
                  label="Add SOR codes"
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
