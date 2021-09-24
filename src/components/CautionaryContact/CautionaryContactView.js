import BackButton from '../Layout/BackButton'
import CautionaryContactTable from './CautionaryContactTable'

const CautionaryContactView = (cautContact) => {
  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary contact</h3>
      <CautionaryContactTable codes={cautContact.cautContact} />
    </>
  )
}

export default CautionaryContactView
