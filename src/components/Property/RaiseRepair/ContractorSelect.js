import PropTypes from 'prop-types'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { Select } from '../../Form'

const ContractorSelect = ({
  loading,
  contractors,
  register,
  errors,
  onContractorSelect,
  disabled,
  apiError,
}) => {
  const contractorList = contractors
    .map(
      (contractor) =>
        `${contractor.contractorName} - ${contractor.contractorReference}`
    )
    .filter(Boolean)

  return (
    <div className="min-height-100">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Select
            name="contractor"
            label="Contractor"
            options={contractorList}
            onChange={onContractorSelect}
            disabled={disabled}
            required={true}
            register={register({
              required: 'Please select a contractor',
              validate: (value) =>
                contractorList.includes(value) || 'Contractor is not valid',
            })}
            error={errors && errors.contractor}
            widthClass="govuk-!-width-one-half"
          />
          {apiError && <ErrorMessage label={apiError} />}
        </>
      )}
    </div>
  )
}

ContractorSelect.propTypes = {
  contractors: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onContractorSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default ContractorSelect
