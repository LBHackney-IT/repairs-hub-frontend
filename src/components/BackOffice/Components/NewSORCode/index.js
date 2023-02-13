const NewSORCode = ({
  sorCode,
  handleRemoveSORCode,
  handleSORCodeFieldChange,
  errors,
}) => {
  console.log('NewSORCode ERRORS', errors)

  return (
    <>
      <div id="new-sor-code-container">
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-input-grid-area "
        >
          <label className="govuk-label lbh-label" htmlFor="sor-code-input">
            SOR code
          </label>

          <input
            className="govuk-select lbh-select"
            placeholder="Example: 4896830H"
            name="sor-code-input"
            type="text"
            value={sorCode.code}
            id="sor-code-input"
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'code')}
          />
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-cost-input-grid-area"
        >
          <label
            className="govuk-label lbh-label"
            htmlFor="sor-code-cost-input"
          >
            Cost (£)
          </label>

          <input
            className="govuk-select lbh-select"
            placeholder="Example: 10.47"
            name="sor-code-cost-input"
            type="number"
            step=".01"
            min={0}
            value={sorCode.cost}
            id="sor-code-cost-input"
            onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'cost')}
          />
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-smv-input-grid-area"
        >
          <label className="govuk-label lbh-label" htmlFor="sor-code-smv-input">
            Standard Minute Value
          </label>

          <input
            className="govuk-select lbh-select"
            placeholder="Example: 29"
            name="sor-code-smv-input"
            type="number"
            min={0}
            value={sorCode.standardMinuteValue}
            id="sor-code-smv-input"
            onChange={(e) =>
              handleSORCodeFieldChange(e, sorCode.id, 'standardMinuteValue')
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
          <label
            className="govuk-label lbh-label"
            htmlFor="sor-code-short-desc-input"
          >
            Short description
          </label>
          <textarea
            className="govuk-textarea lbh-textarea"
            id="sor-code-short-desc-input"
            name="sor-code-short-desc-input"
            rows="1"
            placeholder="Example: LH Gas Carcass LGSR inc cooker"
            value={sorCode.shortDescription}
            onChange={(e) =>
              handleSORCodeFieldChange(e, sorCode.id, 'shortDescription')
            }
          ></textarea>
        </div>
        <div
          className="govuk-form-group lbh-form-group"
          id="sor-code-long-desc-input-grid-area"
        >
          <label
            className="govuk-label lbh-label"
            htmlFor="sor-code-long-desc-input"
          >
            Long description
          </label>
          <textarea
            className="govuk-textarea lbh-textarea"
            id="sor-code-long-desc-input"
            name="sor-code-long-desc-input"
            rows="2"
            placeholder="Example: LH Gas Carcass test. Test internal gas pipework for soundness from meter to all appliances. Visual check cooker or any other gas appliances, excludes gas fire. Issue LGSR Landlord gas safety record..."
            value={sorCode.longDescription}
            onChange={(e) =>
              handleSORCodeFieldChange(e, sorCode.id, 'longDescription')
            }
          ></textarea>
        </div>
      </div>
      <hr />
    </>
  )
}

export default NewSORCode
