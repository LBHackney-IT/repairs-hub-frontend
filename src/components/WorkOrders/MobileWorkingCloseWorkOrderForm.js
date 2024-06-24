import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import WarningInfoBox from '../Template/WarningInfoBox'
import { CLOSURE_STATUS_OPTIONS } from '@/utils/statusCodes'

const MobileWorkingCloseWorkOrderForm = ({ onSubmit }) => {
  const { handleSubmit, register, errors } = useForm({
    shouldUnregister: false,
  })

  return (
    <>
      <div>
        <BackButton onClick={null} />

        <h1 className="lbh-heading-h2">Close work order form</h1>

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="lbh-heading-h4" style={{ marginBottom: '60px' }}>
              Work order status
            </h2>

            <Radios
              labelSize="s"
              label="Select reason for closing"
              name="reason"
              options={CLOSURE_STATUS_OPTIONS.map((r) => {
                return {
                  text: r.text,
                  value: r.value,
                }
              })}
              register={register({
                required: 'Please select a reason for closing the work order',
              })}
              error={errors && errors.reason}
            />

            <TextArea
              name="notes"
              label="Final report"
              register={register}
              error={errors && errors.notes}
            />

            <div className="govuk-!-margin-top-8">
              <WarningInfoBox
                header="Other changes?"
                text="Any follow on and material change must be made on paper."
              />
            </div>
          </div>{' '}
        </form>
      </div>
    </>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
