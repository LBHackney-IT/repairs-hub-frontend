const NewSORCode = ({ sorCode, handleRemoveSORCode }) => {

    return (
        <>
            <h5>SOR Code: {sorCode.sorCode}</h5>
            <h5>SMV: {sorCode.smv}</h5>
            <button onClick={() => handleRemoveSORCode(sorCode)}>
                Remove
            </button>
        </>
    )
}

export default NewSORCode