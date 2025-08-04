import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { useEffect, useState } from 'react'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import { TextArea } from '../../Form'
import { Table, TBody } from '../../Layout/Table'
import ErrorMessage from '../../Errors/ErrorMessage'
import { extractXmlData, RepairsFinderExtractedData } from './helpers'

// Placeholder for testing
const DEFAULT_VALUE = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME></WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink top is loose</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060020</SOR_CODE><PRIORITY>A3</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink top is loose - sadfsdf</SOR_COMMENTS><SOR_CLASS></SOR_CLASS></SOR></RF_INFO>`

interface MatchingSorCode {
  sorCode: {
    code: string
    shortDescription: string
    longDescription: string
    priority: {
      priorityCode: number
      description: string
    }
    cost: number
    standardMinuteValue: number
    displayPriority: number
  }
  tradeCode: string
  trade: string
  contractReference: string
  contractorReference: string
  contractor: string
  hasPropertyContract: boolean
}

interface Props {
  propertyReference: string
}

const RepairsFinderInput = (props: Props) => {
  const { propertyReference } = props

  const [matchingCode, setMatchingCode] = useState<MatchingSorCode | null>(null)

  const [xmlContent, setXmlContent] = useState<string>(DEFAULT_VALUE)
  const [error, setError] = useState<string | null>(null)
  const [
    extractedXmlData,
    setExtractedXmlData,
  ] = useState<RepairsFinderExtractedData | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    handleSearchCode()
  }, [xmlContent])

  const handleSearchCode = async () => {
    setError(() => null)

    const extractedData = await extractXmlData(xmlContent)

    setExtractedXmlData(() => extractedData)
    if (extractedData == null) return

    setIsLoading(() => true)
    setMatchingCode(() => null)

    try {
      const response = await frontEndApiRequest({
        method: 'get',
        path: '/api/repairs-finder/matching-sor-codes',
        params: {
          sorCode: extractedData.sorCode,
          tradeCode: extractedData.tradeCode,
          contractorReference: extractedData.contractorReference,
          propertyReference: propertyReference,
        },
      })

      setTimeout(() => {
        setIsLoading(() => false)
        setMatchingCode(() => response)
      }, 2000)
    } catch (e) {
      console.error(e.message)
      setIsLoading(() => false)
      setError('Something went wrong validating sorCode. Please try again')
      // setError(formatRequestErrorMessage(e.message))
    }
  }

  const onSetXmlCode = (e) => {
    e.preventDefault()

    setXmlContent(() => e.target.value)
  }

  return (
    <>
      <TextArea
        name="xmlContent"
        value={xmlContent}
        label="Repairs finder code"
        hint="Please paste the code from Repairs Finder"
        required
        error={!xmlContent && { message: 'Invalid code format' }}
        onInput={onSetXmlCode}
        rows={6}
      />

      {error && <ErrorMessage label={error} />}

      <div>{isLoading && <SpinnerWithLabel label="Validating code.." />}</div>

      <Table className="original-tasks-table">
        <TBody>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Trade</td>
            <td className="govuk-table__cell">
              {matchingCode === null
                ? '-'
                : `${matchingCode?.trade} - ${matchingCode?.tradeCode}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Contractor</td>
            <td className="govuk-table__cell">
              {matchingCode === null ? '-' : `${matchingCode?.contractor}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">SOR code</td>
            <td className="govuk-table__cell">
              {matchingCode === null
                ? '-'
                : `${matchingCode?.sorCode?.cost} - ${matchingCode?.sorCode?.shortDescription}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Quantity</td>
            <td className="govuk-table__cell">
              {matchingCode === null ? '-' : extractedXmlData.quantity}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Priority</td>
            <td className="govuk-table__cell">
              {matchingCode === null ? '-' : extractedXmlData.priority}
            </td>
          </tr>
        </TBody>
      </Table>
    </>
  )
}

export default RepairsFinderInput
