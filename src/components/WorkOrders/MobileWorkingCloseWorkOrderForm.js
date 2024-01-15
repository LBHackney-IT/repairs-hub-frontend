import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import WarningInfoBox from '../Template/WarningInfoBox'
import { CLOSURE_STATUS_OPTIONS } from '@/utils/statusCodes'
import { useState } from 'react'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  DAMP_OR_MOULD: '2',
}

const MobileWorkingCloseWorkOrderForm = ({ onSubmit }) => {
  const { handleSubmit, register, errors, getValues, trigger, watch } = useForm(
    {
      shouldUnregister: false,
    }
  )

  const [currentPage, setCurrentPage] = useState(PAGES.WORK_ORDER_STATUS)

  const viewNextPage = async () => {
    // validate form
    const results = await trigger('reason')
    if (!results) return

    setCurrentPage(PAGES.DAMP_OR_MOULD)
  }

  const viewPreviousPage = async () => {
    setCurrentPage(PAGES.WORK_ORDER_STATUS)
  }

  const watchedReasonField = watch('reason')
  const watchedIsDampOrMouldInPropertyField = watch('isDampOrMouldInProperty')
  const watchedResidentPreviouslyReportedField = watch(
    'residentPreviouslyReported'
  )

  return (
    <>
      <div>
        {/* if on second page, override back button */}
        <BackButton
          onClick={
            currentPage === PAGES.DAMP_OR_MOULD ? viewPreviousPage : null
          }
        />

        <h1 className="lbh-heading-h2">Close work order form</h1>

        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display:
                currentPage === PAGES.WORK_ORDER_STATUS ? 'block' : 'none',
            }}
          >
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

            {watchedReasonField === 'Work Order Completed' ? (
              <PrimarySubmitButton
                label="Next"
                type="button"
                onClick={viewNextPage}
              />
            ) : (
              <PrimarySubmitButton label="Close work order" />
            )}
          </div>

          <div
            style={{
              display: currentPage === PAGES.DAMP_OR_MOULD ? 'block' : 'none',
            }}
          >
            <h2 className="lbh-heading-h4" style={{ marginBottom: '60px' }}>
              Damp and mould status
            </h2>

            <Radios
              labelSize="s"
              label="Is there damp or mould in the property?"
              name="isDampOrMouldInProperty"
              options={['Yes', 'No', 'Not sure']}
              register={register({
                validate: {
                  required: (value) => {
                    if (
                      !value &&
                      getValues('reason') === 'Work Order Completed'
                    ) {
                      return 'Please indicate whether there is damp or mould in the property'
                    }

                    return true
                  },
                },
              })}
              error={errors && errors.isDampOrMouldInProperty}
            />

            <div
              style={{
                display:
                  watchedIsDampOrMouldInPropertyField === 'Yes' ||
                  watchedIsDampOrMouldInPropertyField === 'Not sure'
                    ? 'block'
                    : 'none',
              }}
            >
              <Radios
                labelSize="s"
                label="Has the resident previously reported damp or mould?"
                name="residentPreviouslyReported"
                options={['Yes', 'No']}
                register={register({
                  validate: {
                    required: (value) => {
                      const isDampOrMouldPresence =
                        getValues('isDampOrMouldInProperty') === 'Yes' ||
                        getValues('isDampOrMouldInProperty') === 'Not sure'

                      if (!value && isDampOrMouldPresence) {
                        return 'Please indicate whether the resident has previous reported damp or mould in the property'
                      }

                      return true
                    },
                  },
                })}
                error={errors && errors.residentPreviouslyReported}
              />

              <div
                style={{
                  display:
                    watchedResidentPreviouslyReportedField === 'Yes'
                      ? 'block'
                      : 'none',
                }}
              >
                <Radios
                  labelSize="s"
                  label="Was the previously reported damp or mould resolved at the time?"
                  name="resolvedAtTheTime"
                  options={['Yes', 'No']}
                  register={register({
                    validate: {
                      required: (value) => {
                        if (
                          !value &&
                          getValues('residentPreviouslyReported') === 'Yes'
                        ) {
                          return 'Please indicate whether the damp or mould was resolved after it was previously reported'
                        }

                        return true
                      },
                    },
                  })}
                  error={errors && errors.resolvedAtTheTime}
                />
              </div>

              <TextArea
                labelSize="s"
                name="comments"
                label="Comments"
                register={register}
                error={errors && errors.comments}
              />
            </div>

            <PrimarySubmitButton label="Close work order" />
          </div>
        </form>
      </div>
    </>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
