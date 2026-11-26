import { JSX } from 'react'
import WarningInfoBox from '../Template/WarningInfoBox'

interface WarrantyStatusFlagProps {
  status?: string | null
}

const WarrantyStatusFlag = ({ status }: WarrantyStatusFlagProps) => {
  const normalizedStatus = status?.toUpperCase().trim()

  if (!normalizedStatus) {
    return null
  }

  const warrantiesSpreadsheetId =
    process.env.NEXT_PUBLIC_WARRANTIES_SPREADSHEET_ID

  let header: string
  let text: JSX.Element

  if (normalizedStatus === 'DEFECTS') {
    header = 'Property under defects period'
    text = (
      <p>
        This property is currently under a defects period and is not eligible
        for standard repairs. <br /> For more information please contact the{' '}
        <strong>Regeneration Aftercare &amp; Defects Team</strong> by sending an
        email to{' '}
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          aftercareanddefects@hackney.gov.uk
        </a>{' '}
        or calling <strong>0208 356 1998</strong>
      </p>
    )
  } else if (normalizedStatus === 'WARRANTIES') {
    header = 'Property under warranty period'
    text = (
      <p>
        This property is currently under a warranty period which may cover
        certain repairs. <br />
        Before raising a work order please check if the repair is covered under
        warranty by reviewing the{' '}
        {warrantiesSpreadsheetId ? (
          <a
            href={`https://docs.google.com/spreadsheets/d/${warrantiesSpreadsheetId}?gid=0`}
            target="_blank"
            rel="noreferrer"
          >
            New Property Warranties Spreadsheet
          </a>
        ) : (
          'New Property Warranties Spreadsheet'
        )}{' '}
        and contacting the{' '}
        <strong>Regeneration Aftercare &amp; Defects Team</strong> by sending an
        email to{' '}
        <a href="mailto:aftercareanddefects@hackney.gov.uk">
          aftercareanddefects@hackney.gov.uk
        </a>{' '}
        or calling <strong>0208 356 1998</strong>
      </p>
    )
  } else {
    header = 'Error: Invalid Defects & Warranties Status'
    text = (
      <p>
        Invalid status: &lsquo;{status}&rsquo;. Please contact support to
        rectify. <br /> Valid statuses are &lsquo;DEFECTS&rsquo; or
        &lsquo;WARRANTIES&rsquo;.
      </p>
    )
  }

  return (
    <WarningInfoBox
      header={header}
      text={text}
      style={{ maxWidth: 600, backgroundColor: 'lavender' }}
    />
  )
}

export default WarrantyStatusFlag
