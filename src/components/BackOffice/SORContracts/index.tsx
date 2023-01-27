import Layout from '../Layout'
import React, { useState } from 'react'
import { TextInput, Button } from '../../Form'
import ControlledRadio from '../Components/ControlledRadio'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'

import { Errors, RadioInputOption } from './types'

const radioOptions: Array<RadioInputOption> = [
  {
    text: 'Copy contracts from another property',
    value: 'Copy',
  },
  {
    text: 'Add explicit property and contract references',
    value: 'Add',
  },
]

const SORContracts = () => {
  const [selectedOption, setSelectedOption] = useState(radioOptions[0].value)

  const [sourcePropertyReference, setSourcePropertyReference] = useState('')
  const [
    destinationPropertyReference,
    setDestinationPropertyReference,
  ] = useState<string>('')
  const [contractReference, setContractReference] = useState<string>('')

  const [errors, setErrors] = useState<Errors>({})

  const [loading, setLoading] = useState<boolean>(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState<boolean>(null)

  const copyContractsSelected = (): boolean => {
    return selectedOption === 'Copy'
  }

  const addContractsSelected = (): boolean => {
    return selectedOption === 'Add'
  }

  const validateRequest = (): Errors => {
    const newErrors: Errors = {}

    if (!selectedOption) {
      newErrors.selectedOption = 'Please select an option'
    }

    if (copyContractsSelected()) {
      if (!sourcePropertyReference) {
        newErrors.sourcePropertyReference =
          'You must enter a source property reference'
      }
      if (!destinationPropertyReference) {
        newErrors.sourcePropertyReference =
          'You must enter a destination property reference'
      }
    }

    if (addContractsSelected()) {
      if (!destinationPropertyReference) {
        newErrors.destinationPropertyReference =
          'You must enter a destination property reference'
      }
      if (!contractReference) {
        newErrors.contractReference = 'You must enter a contract reference'
      }
    }

    return newErrors
  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const sourcePropertyReferenceReq = sourcePropertyReference
      .trim()
      .replaceAll(' ', '')
    const destinationPropertyReferenceReq = destinationPropertyReference
      .trim()
      .replaceAll(' ', '')
    const contractReferenceReq = contractReference.trim().replaceAll(' ', '')

    const body = {
      sourcePropertyReference: sourcePropertyReferenceReq,
      destinationPropertyReference: destinationPropertyReferenceReq,
      contractReference: contractReferenceReq,
      mode: selectedOption,
    }

    const url = `/api/backOffice/sor-contracts`

    setLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: url,
      requestData: body,
      params: null,
      paramsSerializer: null,
    })
      .then(() => {
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
      {loading ? (
        <Spinner resource={null} />
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
              {requestError && (
                <>
                  {/*  @ts-ignore */}
                  <ErrorMessage label={requestError} />
                </>
              )}

              <div>
                {/*  @ts-ignore */}
                <ControlledRadio
                  label="Select workflow type"
                  name="selectedOption"
                  options={radioOptions.map((x) => x.value)}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  selectedOption={selectedOption}
                  error={
                    errors.selectedOption && { message: errors.selectedOption }
                  }
                />
              </div>

              {selectedOption === 'Copy' && (
                <div>
                  {/*  @ts-ignore */}
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
                {/*  @ts-ignore */}
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
                  {/*  @ts-ignore */}
                  <TextInput
                    label="Contract reference"
                    name="contractRefInput"
                    placeholder="eg. 001-H01-MAT2"
                    value={contractReference}
                    onChange={(event) =>
                      setContractReference(event.target.value)
                    }
                    error={
                      errors.contractReference && {
                        message: errors.contractReference,
                      }
                    }
                  />
                </div>
              )}

              <div>
                {/*  @ts-ignore */}
                <Button label="Execute" type="submit" />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default SORContracts
