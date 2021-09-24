import BackButton from '../Layout/BackButton'
import CautionaryContactTable from './CautionaryContactTable'

const CautionaryContactView = (query) => {
  return (
    <>
      <BackButton />
      <h3 className="lbh-heading-h3">Cautionary contact</h3>
      <CautionaryContactTable codes={query ? query.query.cautContact : false} />
    </>
  )
}

export default CautionaryContactView
