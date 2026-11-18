import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { DataList } from '../../Form'

interface Props {
  contractors: any[]
  register: (...args: any[]) => any
  errors: any
  onContractorSelect: (...args: any[]) => any
  disabled: boolean
  loading?: any
  apiError?: any
}

const ContractorDataList = ({
  loading,
  contractors,
  register,
  errors,
  onContractorSelect,
  disabled,
  apiError,
}: Props) => {
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
          <DataList
            name="contractor"
            label="Contractor"
            labelMessage="- Search by name or code"
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

export default ContractorDataList
