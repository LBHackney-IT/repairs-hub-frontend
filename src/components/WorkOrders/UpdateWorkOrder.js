import PropTypes from 'prop-types'
import BackButton from '../Layout/BackButton/BackButton'
import CloseJob from './ClosingJob/CloseJob'
import SelectProcess from './SelectProcess'
import { useState } from 'react'

const UpdateWorkOrder = (reference) => {
  const [updateStage, setUpdateStage] = useState('selectProcess')

  const changeStage = () => {
    setUpdateStage('closeJob')
  }

  if (updateStage == 'selectProcess') {
    return (
      <SelectProcess
        reference={reference.reference}
        changeStage={changeStage}
      />
    )
  } else if (updateStage == 'closeJob') {
    return (
      <CloseJob reference={reference.reference} changeStage={changeStage} />
    )
  }
}

UpdateWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default UpdateWorkOrder
