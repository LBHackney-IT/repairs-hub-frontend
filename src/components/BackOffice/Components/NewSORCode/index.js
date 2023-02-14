import { TextArea, TextInput } from '../../../Form'

const NewSORCode = ({
  sorCode,
  handleRemoveSORCode,
  handleSORCodeFieldChange,
  errors,
}) => {
  return (
    <>
      <div id="new-sor-code-container">
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-input-grid-area "
        >
          <TextInput
            label="SOR code"
            placeholder="Example: 4896830H"
            name="sor-code-input"
            value={sorCode.code}
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'code')}
            error={errors?.code && { message: 'Please enter SOR code' }}
          />
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-cost-input-grid-area"
        >
          <TextInput
            label="Cost (£)"
            placeholder="Example: 10.47"
            name="sor-code-cost-input"
            value={sorCode.cost}
            type="number"
            min={0}
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'cost')}
            error={errors?.cost && { message: 'Please enter cost value' }}
          />
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-smv-input-grid-area"
        >
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
        <div id="sor-code-remove-grid-area" style={{ textAlign: 'center' }}>
          <a
            className="lbh-link"
            href="#"
            onClick={(e) => handleRemoveSORCode(e, sorCode)}
          >
            Remove SOR code
          </a>
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-short-desc-input-grid-area"
        >
          <TextArea
            label="Short description"
            placeholder="Example: LH Gas Carcass LGSR inc cooker"
            name="sor-code-short-desc-input"
            value={sorCode.shortDescription}
            rows="1"
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
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-long-desc-input-grid-area"
        >
          <TextArea
            label="Long description"
            placeholder="Example: LH Gas Carcass test. Test internal gas pipework for soundness from meter to all appliances. Visual check cooker or any other gas appliances, excludes gas fire. Issue LGSR Landlord gas safety record..."
            name="sor-code-long-desc-input"
            value={sorCode.longDescription}
            rows="2"
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
      </div>
      <hr />
    </>
  )
}

export default NewSORCode
