const NewSORCode = ({ sorCode, handleRemoveSORCode, handleSORCodeFieldChange }) => {

    return (
        <>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="sor-code-input">
                    SOR code <span id="input-with-hint-text-hint" className="govuk-hint lbh-hint">Example: 4896830H</span>
                </label>

                <input
                    className="govuk-select lbh-select"
                    name="sor-code-input"
                    type="text"
                    value={sorCode.sorCode}
                    id='sor-code-input'
                    onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'sorCode')}
                />
            </div>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="sor-code-cost-input">
                    Cost (£) <span id="input-with-hint-text-hint" className="govuk-hint lbh-hint">Example: 10.47</span>
                </label>

                <input
                    className="govuk-select lbh-select"
                    name="sor-code-cost-input"
                    type="text"
                    value={sorCode.cost}
                    id='sor-code-cost-input'
                    onChange={(e) => handleSORCodeFieldChange(e, sorCode.id, 'cost')}
                />
            </div>
            <button onClick={() => handleRemoveSORCode(sorCode)}>
                Remove
            </button>
        </>
    )
}

export default NewSORCode