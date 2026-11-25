import WarningInfoBox from '../Template/WarningInfoBox'

const UnderWarrantyFlag = () => (
  <WarningInfoBox
    header="This property is under warranty"
    text={
      <p>
        Before raising a work order please check the{' '}
        <a
          href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_WARRANTIES_SPREADSHEET_ID}?gid=0`}
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          New Property Warranties Spreadsheet{' '}
        </a>
        and contact the <strong>
          Regeneration Aftercare & Defects Team
        </strong>{' '}
        by sending an email to
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          {' '}
          aftercareanddefects@hackney.gov.uk{' '}
        </a>
        or calling <strong>0208 356 1998</strong> to ensure eligibility
      </p>
    }
    style={{ maxWidth: 600, backgroundColor: 'lavender' }}
  />
)

export default UnderWarrantyFlag
