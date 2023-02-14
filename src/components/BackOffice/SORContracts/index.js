import Layout from '../Layout'
import { useState } from 'react'
import { TextInput, Button } from '../../Form'
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

import useSelectContract from './useSelectContract'

const SORContracts = () => {
  const [selectedOption, setSelectedOption] = useState(radioOptions[0].value)

  const [sourcePropertyReference, setSourcePropertyReference] = useState('')
  const [
    destinationPropertyReference,
    setDestinationPropertyReference,
  ] = useState('')

  const {
    contractors,
    handleSelectContractor,
    selectedContractor,
    contracts,
    selectedContract,
    loadingContracts,
    loadingContractors,
    handleSelectContract,
  } = useSelectContract()

  const [errors, setErrors] = useState({})

  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

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
          'Destination property reference cannot match source property reference'
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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) return

    const body = dataToRequestObject(
      sourcePropertyReference,
      destinationPropertyReference,
      selectedContract,
      selectedOption
    )

    setLoading(true)

    saveContractChangesToDatabase(body)
      .then((res) => {
        setFormSuccess(true)
      })
      .catch((err) => {
        console.error(err)
        setRequestError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout title="SOR Contract Modification">
      {loading || loadingContractors ? (
        <Spinner />
      ) : (
        <>
          {formSuccess ? (
            <div>
              <SuccessMessage title="SOR contracts modified successfully!" />
              <p>
                <a
                  className="lbh-link"
                  role="button"
                  onClick={() => setFormSuccess(null)}
                >
                  Change more SOR contracts
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {requestError && <ErrorMessage label={requestError} />}

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
                <Button label="Save Changes" type="submit" />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default SORContracts
