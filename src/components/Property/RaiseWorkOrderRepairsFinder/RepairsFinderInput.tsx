import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { useEffect, useState } from 'react'
import { parseString } from 'xml2js'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import { DataList, TextArea } from '../../Form'
import RateScheduleItemView from '../RaiseWorkOrder/RateScheduleItemView'
import { Table, TBody, TH, THead, TR } from '../../Layout/Table'
import ErrorMessage from '../../Errors/ErrorMessage'

const DEFAULT_VALUE = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME></WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink top is loose</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060020</SOR_CODE><PRIORITY>A3</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink top is loose - sadfsdf</SOR_COMMENTS><SOR_CLASS></SOR_CLASS></SOR></RF_INFO>`

interface RepairsFinderXmlContent {
  RF_INFO: {
    RESULT: string[]
    PROPERTY: string[]
    WORK_PROGRAMME: string[]
    CAUSED_BY: string[]
    NOTIFIED_DEFECT: string[]
    DEFECT: Array<{
      DEFECT_CODE: string[]
      DEFECT_LOC_CODE: string[]
      DEFECT_COMMENTS: string[]
      DEFECT_PRIORITY: string[]
      DEFECT_QUANTITY: string[]
    }>
    SOR: Array<{
      SOR_CODE: string[]
      PRIORITY: string[]
      QUANTITY: string[]
      SOR_LOC_CODE: string[]
      SOR_COMMENTS: string[]
      SOR_CLASS: string[]
    }>
  }
}

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
  register: any
  formState: any
}

const RepairsFinderInput = (props: Props) => {
  const { register, formState } = props

  const [matchingCode, setMatchingCode] = useState<MatchingSorCode | null>(null)

  // const contractors = [
  //   ...new Set(matchingCode.map((x) => x.contractorReference)),
  // ]

  // const [selectedContractor, setSelectedContractor] = useState<string>()
  // const [selectedTrade, setSelectedTrade] = useState<string>()

  // const tradesForSelectedContractor = [
  //   ...new Set(
  //     matchingCode
  //       .filter((x) => x.contractorReference === selectedContractor)
  //       .map((x) => x.tradeCode)
  //   ),
  // ]

  const [xmlContent, setXmlContent] = useState<string>(DEFAULT_VALUE)
  const [xmlIsValid, setXmlIsValid] = useState<boolean | null>(true)

  const [isFindingMatches, setIsFindingMatches] = useState<boolean>(false)

  useEffect(() => {
    handleSearchCode()
  }, [xmlContent])

  const handleSearchCode = async () => {
    console.log('validating')

    console.log({ xmlContent })

    const result = await handleParseXML(xmlContent)

    if (!result.success) {
      console.error(result.error)
      setXmlIsValid(() => false)
      return
    }

    setXmlIsValid(() => true)

    // success, extract useful data

    console.log({ result })

    const sorCodes = result.result.RF_INFO.SOR

    if (sorCodes.length !== 1) {
      alert('Repairs hub can only accept a single task from Repairs FInder')
      return
    }

    const {
      PRIORITY: [priority],
      QUANTITY: [quantity],
      SOR_CODE: [sorCode],
      SOR_COMMENTS: [comments],
    } = sorCodes[0]

    console.log({ priority, quantity, sorCode, comments })

    setIsFindingMatches(() => true)
    setMatchingCode(() => null)

    const response = await frontEndApiRequest({
      method: 'get',
      path: '/api/repairs-finder/matching-sor-codes',
      params: {
        sorCode: '20060020',
        tradeCode: 'PL',
        contractorReference: 'H01',
        propertyReference: '00023400',
      },
    })

    setTimeout(() => {
      setIsFindingMatches(() => false)

      console.log({ response })

      setMatchingCode(() => response)

      if (response.length === 0) {
        console.info('No matching results')
      }
    }, 2000)
  }

  const handleParseXML = (xml: string) =>
    new Promise<{
      success: boolean
      error: Error
      result: RepairsFinderXmlContent
    }>((resolve) => {
      parseString(xml, (err, result) => {
        if (err) {
          resolve({ success: false, error: err, result: null })
          return
        }

        resolve({ success: true, error: null, result })

        // console.log({ result, err }, typeof err)
      })
    })

  return (
    <>
      {/* <h2 className="lbh-heading-h2 govuk-!-margin-top-6">
           Repairs Finder stuff
          </h2> */}

      {/* <p>Repairs Finder stuffs</p> */}

      <TextArea
        value={xmlContent}
        label="Repairs finder code"
        hint="Please paste the code from Repairs Finder"
        required
        error={!xmlIsValid && { message: 'Invalid code format' }}
        onInput={(x) => setXmlContent(x.target.value)}
        rows={6}
      />

      <div>
        {isFindingMatches && <SpinnerWithLabel label="Validating code.." />}
      </div>

      {/* {matchingCode === null && (
        <p>Sorry, SOR code was not found in any contrract</p>
      )} */}

      {/* {} */}

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
              {matchingCode === null ? '-' : `3`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Priority</td>
            <td className="govuk-table__cell">
              {matchingCode === null ? '-' : `Normal`}
            </td>
          </tr>
        </TBody>
      </Table>
    </>
  )
}

export default RepairsFinderInput
