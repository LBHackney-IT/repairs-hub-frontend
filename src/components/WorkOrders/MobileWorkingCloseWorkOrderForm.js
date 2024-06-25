import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import WarningInfoBox from '../Template/WarningInfoBox'
import { CLOSURE_STATUS_OPTIONS } from '@/utils/statusCodes'
import { Checkbox, PrimarySubmitButton } from '../Form'
import { useState } from 'react'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const AVAILABLE_TRADES = [
  'Carpentry',
  'Drainage',
  'Gas',
  'Electrical',
  'Multitrade',
  'Painting',
  'Plumbing',
  'Roofing',
  'UPVC',
  'Other (please specify)',
]

const VisitCompleteFurtherOptions = (props) => {
  const { register, errors } = props

  return (
    <Radios
      // label="Select reason for closing"
      name="followOnStatus"
      options={['No further work required', 'Further work required']}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

const DifferentTradesFurtherOptions = (props) => {
  const { register } = props

  return (
    <div>
      <ul>
        {/* // Checkboxes */}
        {AVAILABLE_TRADES.map((x) => (
          <li style={{ display: 'flex' }}>
            <Checkbox
              className="govuk-!-margin-0"
              labelClassName="lbh-body-xs govuk-!-margin-0"
              // key={index}
              name={`ContractorReference`}
              label={x}
              register={register}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

const MobileWorkingCloseWorkOrderForm = ({ onSubmit }) => {
  const { handleSubmit, register, errors, watch } = useForm({
    shouldUnregister: false,
  })

  const showFollowOnRadioOptions = watch('reason') === 'Work Order Completed'
  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'Further work required'



  const newReasonOptions = CLOSURE_STATUS_OPTIONS.map((r) => {
    return {
      ...r,
      children:
        r.value === 'Work Order Completed' && showFollowOnRadioOptions ? (
          <VisitCompleteFurtherOptions register={register} errors={errors} />
        ) : null,
    }
  })

  const [currentPage, setCurrentPage] = useState(PAGES.FOLLOW_ON_DETAILS)

  const viewFollowOnDetailsPage = () => {
    setCurrentPage(PAGES.FOLLOW_ON_DETAILS)
  }

  const viewWorkOrderStatusPage = () => {
    setCurrentPage(PAGES.WORK_ORDER_STATUS)
  }


  return (
    <>
      <div>
        {/* if on second page, override back button */}
        <BackButton
          onClick={
            currentPage === PAGES.FOLLOW_ON_DETAILS
              ? viewWorkOrderStatusPage
              : null
          }
        />

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display:
                currentPage === PAGES.WORK_ORDER_STATUS ? 'block' : 'none',
            }}
          >
            <h1 className="lbh-heading-h2">Close work order form</h1>

            <Radios
              labelSize="s"
              label="Select reason for closing"
              name="reason"
              options={newReasonOptions}
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

            {selectedFurtherWorkRequired ? (
              <PrimarySubmitButton
                label="Add details"
                type="button"
                onClick={viewFollowOnDetailsPage}
              />
            ) : (
              <PrimarySubmitButton label={`Close work order`} />
            )}
          </div>

          <div
            style={{
              display:
                currentPage === PAGES.FOLLOW_ON_DETAILS ? 'block' : 'none',
            }}
          >
            <h1 className="lbh-heading-h2">Details of further work required</h1>

            <fieldset>
              <label className={`govuk-label govuk-label--m`} htmlFor={name}>
                Operatives
              </label>

              <ul>
                {/* // Checkboxes */}
                {[
                  {
                    name: 'Same trade',
                    children: null,
                  },
                  {
                    name: 'Different trade(s)',
                    children: (
                      <DifferentTradesFurtherOptions
                        register={register}
                        errors={errors}
                      />
                    ),
                  },
                  {
                    name: 'Multiple operatives',
                    children: null,
                  },
                ].map(({ name, children }) => {
                  const showChildren = watch(name)

                  return (
                    <li style={{ display: 'flex', flexDirection: 'column' }}>
                      <Checkbox
                        className="govuk-!-margin-0"
                        labelClassName="lbh-body-xs govuk-!-margin-0"
                        // key={index}
                        name={name}
                        label={name}
                        register={register}
                        children={children}
                        showChildren={showChildren}
                      />

   
                    </li>
                  )
                })}
              </ul>
            </fieldset>


            <TextArea
              name="workRequiredDescription"
              label="Describe work required"
              register={register}
              error={errors && errors.notes}
              // defaultValue={notes}
            />

            <fieldset>
              <label className={`govuk-label govuk-label--m`} htmlFor={name}>
                Materials
              </label>

              <ul>
                {/* // Checkboxes */}
                {['Stock items required', 'Non stock items required'].map(
                  (x) => (
                    <li style={{ display: 'flex' }}>
                      <Checkbox
                        className="govuk-!-margin-0"
                        labelClassName="lbh-body-xs govuk-!-margin-0"
                        // key={index}
                        name={`yeet`}
                        label={x}
                        register={register}
                      />
                    </li>
                  )
                )}
              </ul>
            </fieldset>

            <TextArea
              name="materialsRequired"
              label="Materials required"
              register={register}
              error={errors && errors.notes}
            />
          </div>

          <PrimarySubmitButton label="Close work order" />
        </form>
      </div>
    </>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
