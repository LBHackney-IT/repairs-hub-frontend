import Layout from '../Layout'
import { useState } from 'react'
import { TextInput, Button } from '../../Form'
import ConfirmationModal from '../../ConfirmationModal'
import ControlledRadio from '../Components/ControlledRadio'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'
import {
  addContractsSelected,
  copyContractsSelected,
  dataToRequestObject,
  propertyReferencesMatch,
  saveContractChangesToDatabase,
  validatePropertyReference,
} from './utils'

import { DataList } from '../../Form'

const radioOptions = [
  {
    text: 'Copy contracts from another property',
    value: 'Copy',
  },
  {
    text: 'Add explicit property and contract references',
    value: 'Add',
  },
]

import useSelectContract from '../hooks/useSelectContract'

const SORContracts = () => {
  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const [selectedOption, setSelectedOption] = useState(radioOptions[0].value)

  const [sourcePropertyReference, setSourcePropertyReference] = useState('')
  const [destinationPropertyReference, setDestinationPropertyReference] =
    useState('')
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

  const [errors, setErrors] = useState({})

  const validateRequest = () => {
    const newErrors = {}

    if (!selectedOption) {
      newErrors.selectedOption = 'Please select an option'
    }

    if (!destinationPropertyReference) {
      newErrors.destinationPropertyReference =
        'You must enter a destination property reference'
    } else if (!validatePropertyReference(destinationPropertyReference)) {
      newErrors.destinationPropertyReference = 'PropertyReference is invalid'
    }

    if (copyContractsSelected(selectedOption)) {
      if (!sourcePropertyReference) {
        newErrors.sourcePropertyReference =
          'You must enter a source property reference'
      } else if (!validatePropertyReference(sourcePropertyReference)) {
        newErrors.sourcePropertyReference = 'PropertyReference is invalid'
      } else if (
        propertyReferencesMatch(
          sourcePropertyReference,
          destinationPropertyReference
        )
      ) {
        newErrors.destinationPropertyReference =
          'The destination property reference cannot match source property reference'
      }
    }

    if (addContractsSelected(selectedOption)) {
      if (!selectedContractor) {
        newErrors.contractor = 'You must select a contractor'
      }

      if (!selectedContract) {
        newErrors.contract = 'You must select a contract'
      }
    }

    return newErrors
  }

  const resetForm = () => {
    setSourcePropertyReference('')
    setDestinationPropertyReference('')
    handleFormReset()
    setFormSuccess(null)
    setErrors({})
    setRequestError(null)
    setShowDialog(false)
  }

  const renderConfirmationModal = () => {
    if (showDialog) {
      return (
        <ConfirmationModal
          title={'Modify SOR contracts?'}
          showDialog
          setShowDialog={setShowDialog}
          modalText={
            'The operation cannot be undone, please make sure the details entered are correct before proceeding.'
          }
          onSubmit={modifySORContracts}
          yesButtonText={'Modify contracts'}
        />
      )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) return

    setShowDialog(true)
  }

  const modifySORContracts = () => {
    setLoading(true)

    const body = dataToRequestObject(
      sourcePropertyReference,
      destinationPropertyReference,
      selectedContract,
      selectedOption
    )

    saveContractChangesToDatabase(body)
      .then(() => {
        setFormSuccess(true)
      })
      .catch((err) => {
        console.error(err)

        if (err?.response?.data?.message !== null) {
          setRequestError(err?.response?.data?.message)
          return
        }

        setRequestError(err)
      })
      .finally(() => {
        setLoading(false)
        setShowDialog(false)
      })
  }

  return (
    <Layout title="SOR contract modification">
      {loading || loadingContractors ? (
        <Spinner />
      ) : (
        <>
          {formSuccess ? (
            <SuccessMessage
              title="SOR Contracts Updated"
              resetFormText="Update more SOR contracts"
              resetFormCallback={resetForm}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {requestError && <ErrorMessage label={requestError} />}

              {renderConfirmationModal()}

              <div>
                <ControlledRadio
                  label="Select workflow type"
                  name="selectedOption"
                  options={radioOptions}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  selectedOption={selectedOption}
                  error={
                    errors.selectedOption && { message: errors.selectedOption }
                  }
                />
              </div>

              {selectedOption === 'Copy' && (
                <div>
                  <TextInput
                    data-test="sourcePropertyReference"
                    label="Source property reference (include leading zeroes)"
                    name="sourceInput"
                    placeholder="eg. 00023400"
                    value={sourcePropertyReference}
                    onChange={(event) =>
                      setSourcePropertyReference(event.target.value)
                    }
                    error={
                      errors.sourcePropertyReference && {
                        message: errors.sourcePropertyReference,
                      }
                    }
                  />
                </div>
              )}

              <div>
                <TextInput
                  data-test="destinationPropertyReference"
                  label="Destination property reference (include leading zeroes)"
                  name="destInput"
                  placeholder="eg. 00023400"
                  value={destinationPropertyReference}
                  onChange={(event) =>
                    setDestinationPropertyReference(event.target.value)
                  }
                  error={
                    errors.destinationPropertyReference && {
                      message: errors.destinationPropertyReference,
                    }
                  }
                />
              </div>

              {selectedOption === 'Add' && (
                <div>
                  <DataList
                    name="contractor"
                    label="Contractor"
                    options={contractors?.map((x) => x.contractorName) || []}
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
                </div>
              )}

              <div>
                <Button
                  data-test="submit-button"
                  label="Save changes"
                  type="submit"
                />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default SORContracts
