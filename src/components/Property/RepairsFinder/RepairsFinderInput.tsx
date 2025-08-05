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
  register: any
  setTotalCost: (cost: number) => void
  setContractorReference: (reference: string) => void
  setTradeCode: (tradeCode: string) => void
}

const RepairsFinderInput = (props: Props) => {
  const {
    propertyReference,
    register,
    setTotalCost,
    setContractorReference,
    setTradeCode,
  } = props

  const [
    repairsApiResponse,
    setRepairsApiResponse,
  ] = useState<MatchingSorCode | null>(null)

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
    setExtractedXmlData(() => null)
    setRepairsApiResponse(() => null)

    const extractedData = await extractXmlData(xmlContent)

    setExtractedXmlData(() => extractedData)
    if (extractedData == null) return

    setIsLoading(() => true)
    setRepairsApiResponse(() => null)

    try {
      const response: MatchingSorCode = await frontEndApiRequest({
        method: 'get',
        path: '/api/repairs-finder/matching-sor-codes',
        params: {
          sorCode: extractedData.sorCode,
          tradeCode: extractedData.tradeCode,
          contractorReference: extractedData.contractorReference,
          propertyReference: propertyReference,
        },
      })

      const totalCost =
        response?.sorCode?.cost * parseInt(extractedData?.quantity)

      setTotalCost(totalCost)
      setContractorReference(extractedData.contractorReference)
      setTradeCode(extractedData.tradeCode)

      // timeout makes it look cooler
      setTimeout(() => {
        setIsLoading(() => false)
        setRepairsApiResponse(() => response)
      }, 2000)
    } catch (e) {
      console.error(e.message)
      setIsLoading(() => false)
      setError('Something went wrong validating sorCode. Please try again')
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
        error={!extractedXmlData && { message: 'Invalid code format' }}
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
              {repairsApiResponse === null
                ? '-'
                : `${repairsApiResponse?.trade} - ${repairsApiResponse?.tradeCode}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Contractor</td>
            <td className="govuk-table__cell">
              {repairsApiResponse === null
                ? '-'
                : `${repairsApiResponse?.contractor}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">SOR code</td>
            <td className="govuk-table__cell">
              {repairsApiResponse === null
                ? '-'
                : `${repairsApiResponse?.sorCode?.cost} - ${repairsApiResponse?.sorCode?.shortDescription}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Quantity</td>
            <td className="govuk-table__cell">
              {repairsApiResponse === null ? '-' : extractedXmlData?.quantity}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Priority</td>
            <td className="govuk-table__cell">
              {repairsApiResponse === null ? '-' : extractedXmlData?.priority}
            </td>
          </tr>
        </TBody>
      </Table>

      {/* Trade */}
      <input
        id="trade"
        name="trade"
        type="hidden"
        ref={register}
        value={repairsApiResponse?.trade}
      />

      <input
        id="tradeCode"
        name="tradeCode"
        type="hidden"
        ref={register}
        value={repairsApiResponse?.tradeCode}
      />

      {/* Contractor */}
      <input
        id="contractor"
        name="contractor"
        type="hidden"
        ref={register}
        value={`${repairsApiResponse?.contractor} - ${repairsApiResponse?.contractorReference}`}
      />

      <input
        id="contractorRef"
        name="contractorRef"
        type="hidden"
        ref={register}
        value={repairsApiResponse?.contractorReference}
      />

      {/* SOR code fields */}
      <input
        id={`rateScheduleItems[${0}][code]`}
        name={`rateScheduleItems[${0}][code]`}
        value={`${repairsApiResponse?.sorCode?.code} - ${repairsApiResponse?.sorCode?.shortDescription} - £${repairsApiResponse?.sorCode?.cost}`}
        type="hidden"
        ref={register}
      />
      <input
        id={`rateScheduleItems[${0}][description]`}
        name={`rateScheduleItems[${0}][description]`}
        value={repairsApiResponse?.sorCode?.shortDescription}
        type="hidden"
        ref={register}
      />
      <input
        id={`rateScheduleItems[${0}][cost]`}
        name={`rateScheduleItems[${0}][cost]`}
        value={repairsApiResponse?.sorCode?.cost}
        type="hidden"
        ref={register}
      />

      <input
        id={`rateScheduleItems[${0}][quantity]`}
        name={`rateScheduleItems[${0}][quantity]`}
        value={extractedXmlData?.quantity}
        type="hidden"
        ref={register}
      />

      {/* Priority */}
      <input
        id={`priorityCode`}
        name={`priorityCode`}
        value={4}
        type="hidden"
        ref={register}
      />
    </>
  )
}

export default RepairsFinderInput
