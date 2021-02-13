import PropTypes from 'prop-types'
import { GridRow, GridColumn } from '../Layout/Grid'
import { Button, TextInput } from '../Form'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import ExtraSorCode from './ExtraSorCode'

const UpdateJobForm = ({
  task,
  sorCodes,
  onGetToSummary,
  sorCodesCollection,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const isContractorUpdatePage = true
  const [temporarySorCodeCollection, setTemporarySorCodeCollection] = useState([
    ...sorCodesCollection,
  ])
  const [nextFreeIndex, setNextFreeIndex] = useState(sorCodesCollection.length)

  const onDeleteTemporarySorCode = (index) => {
    let filtered = temporarySorCodeCollection.filter((e) => e.id != index)
    setTemporarySorCodeCollection([...filtered])
  }

  const onAddTemporarySorCode = () => {
    temporarySorCodeCollection.push({ id: nextFreeIndex })
    setNextFreeIndex(nextFreeIndex + 1)
    setTemporarySorCodeCollection([...temporarySorCodeCollection])
  }

  return (
    <>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <GridRow className="sor-code-select align-items-center" key="lol">
          {task.map((t, index) => (
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
        <ExtraSorCode
          sorCodes={sorCodes}
          register={register}
          errors={errors}
          sorCodesCollection={temporarySorCodeCollection}
          isContractorUpdatePage={isContractorUpdatePage}
          onDeleteTemporarySorCode={onDeleteTemporarySorCode}
          onAddTemporarySorCode={onAddTemporarySorCode}
        />

        <Button label="Next" type="submit" />
      </form>
    </>
  )
}

UpdateJobForm.propTypes = {
  task: PropTypes.array.isRequired,
  sorCodes: PropTypes.array.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  sorCodesCollection: PropTypes.array.isRequired,
  showAddedSoreCodes: PropTypes.bool.isRequired,
}

export default UpdateJobForm
