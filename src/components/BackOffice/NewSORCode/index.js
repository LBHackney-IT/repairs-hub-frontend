const NewSORCode = ({ sorCode, handleRemoveSORCode, handleSORCodeFieldChange }) => {

    return (
        <>
            <div className="govuk-form-group lbh-form-group">
                <label className="govuk-label lbh-label" htmlFor="input-with-hint-text">
                    SOR code <span id="input-with-hint-text-hint" className="govuk-hint lbh-hint">Example: 4896830H</span>
                </label>

                <input
                    className="govuk-select lbh-select"
                    name="test-name-2"
                    type="text"
                    aria-describedby="input-with-hint-text-hint"
                    value={sorCode.sorCode}
                    id='sor-code-input'
                    onChange={(e) => handleSORCodeFieldChange(e, sorCode)}
                />
            </div>
            <button onClick={() => handleRemoveSORCode(sorCode)}>
                Remove
            </button>
        </>
    )
}

export default NewSORCode