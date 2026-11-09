import { TextArea, TextInput } from '../../../Form'
import type { ChangeEvent, MouseEvent } from 'react'
import type SorCode from '@/root/src/models/sorCode'

export interface SorCodeErrors {
  id: string
  code: boolean
  cost: boolean
  standardMinuteValue: boolean
  shortDescription: boolean
  longDescription: boolean
}

type EditableField = Exclude<keyof SorCode, 'id'>

interface Props {
  sorCode: SorCode
  handleRemoveSORCode: (e: MouseEvent, sorCode: SorCode) => void
  handleSORCodeFieldChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sorCodeId: string,
    editedField: EditableField
  ) => void
  errors?: SorCodeErrors
}

const NewSORCode = ({
  sorCode,
  handleRemoveSORCode,
  handleSORCodeFieldChange,
  errors,
}: Props) => {
  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <button
          className="lbh-link"
          role="button"
          onClick={(e) => handleRemoveSORCode(e, sorCode)}
          data-testid="sor-code-remove-link"
        >
          Remove SOR code
        </button>
      </div>

      <div id="new-sor-code-container">
        <div>
          <TextInput
            label="SOR code"
            placeholder="Example: 4896830H"
            name="sor-code-input"
            value={sorCode.code}
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'code')}
            error={errors?.code && { message: 'Please enter SOR code' }}
          />
        </div>
        <div>
          <TextInput
            label="Cost (£)"
            placeholder="Example: 10.47"
            name="sor-code-cost-input"
            value={sorCode.cost}
            type="number"
            min={0}
            step={0.01}
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'cost')}
            error={errors?.cost && { message: 'Please enter cost value' }}
          />
        </div>
        <div>
          <TextInput
            label="Standard Minute Value"
            placeholder="Example: 29"
            name="sor-code-smv-input"
            value={sorCode.standardMinuteValue}
            type="number"
            min={0}
            onChange={(e) =>
              handleSORCodeFieldChange(e, sorCode.id, 'standardMinuteValue')
            }
            error={
              errors?.standardMinuteValue && {
                message: 'Please enter SMV value',
              }
            }
          />
        </div>
      </div>

      <div>
        <TextArea
          label="Short description"
          placeholder="Example: LH Gas Carcass LGSR inc cooker"
          name="sor-code-short-desc-input"
          value={sorCode.shortDescription}
          rows={1}
          onChange={(e) =>
            handleSORCodeFieldChange(e, sorCode.id, 'shortDescription')
          }
          error={
            errors?.shortDescription && {
              message: 'Please enter short description',
            }
          }
        />
      </div>
      <div>
        <TextArea
          label="Long description"
          placeholder="Example: LH Gas Carcass test. Test internal gas pipework for soundness from meter to all appliances. Visual check cooker or any other gas appliances, excludes gas fire. Issue LGSR Landlord gas safety record..."
          name="sor-code-long-desc-input"
          value={sorCode.longDescription}
          rows={2}
          onChange={(e) =>
            handleSORCodeFieldChange(e, sorCode.id, 'longDescription')
          }
          error={
            errors?.longDescription && {
              message: 'Please enter long description',
            }
          }
        />
      </div>
      <hr />
    </>
  )
}

export default NewSORCode
