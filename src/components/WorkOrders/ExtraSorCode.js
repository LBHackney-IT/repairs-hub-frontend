import PropTypes from 'prop-types'
import SorCodeSelect from '../Property/RaiseRepair/SorCodeSelect'
import { Fragment } from 'react'

const ExtraSorCode = ({
  sorCodes,
  register,
  errors,
  sorCodesCollection,
  isContractorUpdatePage,
  onAddTemporarySorCode,
  onDeleteTemporarySorCode,
}) => {
  const sorCodesList = sorCodes.map(
    (code) => `${code.customCode} - ${code.customName}`
  )

  const sorCodeSelectCollection = (sorCodeCollection) => {
    return sorCodeCollection.map((sorCodeEl) => {
      return (
        <Fragment key={`sorCodeCollection~${sorCodeEl.id}`}>
          <SorCodeSelect
            code={sorCodeEl.code}
            quantity={sorCodeEl.quantity}
            cost={sorCodeEl.cost}
            sorCodesList={sorCodesList}
            register={register}
            errors={errors}
            key={sorCodeEl.id}
            index={sorCodeEl.id}
            onSorCodeSelect={() => {}}
            showRemoveSorCodeSelect={isContractorUpdatePage}
            removeSorCodeSelect={onDeleteTemporarySorCode}
            isContractorUpdatePage={isContractorUpdatePage}
          />
        </Fragment>
      )
    })
  }

  return (
    <div className="govuk-!-padding-bottom-5">
      {sorCodeSelectCollection(sorCodesCollection)}
      <a
        onClick={onAddTemporarySorCode}
        href="#"
        className="repairs-hub-link govuk-body-s"
      >
        + Add another SOR code
      </a>
    </div>
  )
}

ExtraSorCode.propTypes = {
  sorCodes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isContractorUpdatePage: PropTypes.bool.isRequired,
  sorCodesCollection: PropTypes.array.isRequired,
}

export default ExtraSorCode
