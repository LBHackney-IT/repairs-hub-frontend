import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../Layout/Grid'
import { PrimarySubmitButton, TextInput } from '../Form'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import AdditionalRateScheduleItem from './AdditionalRateScheduleItem'

const UpdateJobForm = ({
  tasks,
  sorCodes,
  onGetToSummary,
  rateScheduleItems,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const isContractorUpdatePage = true
  const [
    additionalRateScheduleItems,
    setAdditionalRateScheduleItems,
  ] = useState([...rateScheduleItems])
  const [nextFreeIndex, setNextFreeIndex] = useState(rateScheduleItems.length)

  const removeRateScheduleItem = (index) => {
    let filtered = additionalRateScheduleItems.filter((e) => e.id != index)
    setAdditionalRateScheduleItems([...filtered])
  }

  const addRateScheduleItem = () => {
    additionalRateScheduleItems.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setAdditionalRateScheduleItems([...additionalRateScheduleItems])
  }

  return (
    <>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <GridRow className="rate-schedule-items align-items-center">
          {tasks.map((t, index) => (
            <div key={index}>
              <GridColumn width="two-thirds">
                <TextInput
                  name={`sor-code-${index}`}
                  label={index == 0 ? 'SOR code' : ''}
                  widthClass={`sor-code-${index} govuk-!-width-full`}
                  register={register}
                  disabled="disabled"
                  value={`${[t.code, t.description].join(' - ')}`}
                />
                <input
                  id={`hidden-sor-code-${index}`}
                  name={`hidden-sor-code-${index}`}
                  label={`hidden-sor-code-${index}`}
                  type="hidden"
                  value={`${[t.code, t.description].join(' - ')}`}
                  ref={register}
                />
              </GridColumn>
              <GridColumn width="one-third">
                <TextInput
                  name={`quantity-${index}`}
                  label={index == 0 ? 'Quantity' : ''}
                  error={errors && errors.quantity}
                  widthClass={`quantity-${index} govuk-!-width-full`}
                  defaultValue={t.quantity}
                  register={register({
                    required: 'Please enter a quantity',
                    valueAsNumber: true,
                    validate: (value) => {
                      if (!Number.isInteger(value)) {
                        return 'Quantity must be a whole number'
                      } else if (value > 50) {
                        return 'Quantity must be 50 or less'
                      } else {
                        return true
                      }
                    },
                  })}
                />
              </GridColumn>
            </div>
          ))}
        </GridRow>
        <AdditionalRateScheduleItem
          sorCodes={sorCodes}
          register={register}
          errors={errors}
          rateScheduleItems={additionalRateScheduleItems}
          isContractorUpdatePage={isContractorUpdatePage}
          removeRateScheduleItem={removeRateScheduleItem}
          addRateScheduleItem={addRateScheduleItem}
        />

        <PrimarySubmitButton label="Next" />
      </form>
    </>
  )
}

UpdateJobForm.propTypes = {
  tasks: PropTypes.array.isRequired,
  sorCodes: PropTypes.array.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  rateScheduleItems: PropTypes.array.isRequired,
}

export default UpdateJobForm
