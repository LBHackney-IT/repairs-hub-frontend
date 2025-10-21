import { useEffect, useState } from 'react'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import { TextArea } from '../../Form'
import { Table, TBody } from '../../Layout/Table'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { useRepairsFinderInput } from './useRepairsFinderInput'
import { Priority } from '@/root/src/models/priority'
import { getPriorityObjectByCode } from './helpers'
import { DeepMap, ErrorOption, FieldError, FieldValues } from 'react-hook-form'

const DEFAULT_VALUE = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`

interface Props {
  propertyReference: string
  register: any
  errors: DeepMap<FieldValues, FieldError>
  setTotalCost: (cost: number) => void
  setContractorReference: (reference: string) => void
  setTradeCode: (tradeCode: string) => void
  priorities: Priority[]
  setError: (name: string, error: ErrorOption) => void
  trigger: (name?: string | string[]) => Promise<boolean>
  isSubmitted: boolean
}

const RepairsFinderInput = (props: Props) => {
  const {
    propertyReference,
    register,
    errors,
    setTotalCost,
    setContractorReference,
    setTradeCode,
    priorities,
    trigger,
    isSubmitted,
  } = props

  const [textInput, setTextInput] = useState<string>()

  const {
    extractedXmlData,
    error,
    isLoading,
    matchingSorCode,
    touched,
  } = useRepairsFinderInput(textInput, propertyReference)

  useEffect(() => {
    if (!isSubmitted && !touched) return
    trigger('xmlContent')
  }, [error, trigger, isSubmitted])

  useEffect(() => {
    if (matchingSorCode == null) return

    const totalCost =
      matchingSorCode?.sorCode?.cost * parseInt(extractedXmlData?.quantity)

    setTotalCost(totalCost)
    setContractorReference(extractedXmlData.contractorReference)
    setTradeCode(matchingSorCode.tradeCode)
  }, [matchingSorCode])

  return (
    <>
      <WarningInfoBox
        className="variant-warning govuk-!-margin-bottom-4"
        header="Looking to use Repairs Finder?"
        name="despatched-warning"
        text={
          <>
            Visit{' '}
            <a
              className="lbh-link"
              target="_blank"
              href="https://product-test.necsws.com/cgi-bin/hackney_rftr_launchalone.pl"
              rel="noreferrer"
            >
              Repairs Finder
            </a>{' '}
            to diagnose the repair, then paste the code below.
          </>
        }
      />

      <TextArea
        name="xmlContent"
        label="Repairs finder code"
        hint="Please paste the code from Repairs Finder"
        required={true}
        register={register({
          required: 'Please enter a code',
          validate: () => {
            return error || true
          },
        })}
        error={errors && errors?.xmlContent}
        onInput={(e) => setTextInput(e.target.value)}
        rows={6}
      />

      <div>{isLoading && <SpinnerWithLabel label="Validating code.." />}</div>

      <Table className="original-tasks-table">
        <TBody>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Trade</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null
                ? '-'
                : `${matchingSorCode?.trade} - ${matchingSorCode?.tradeCode}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Contractor</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null
                ? '-'
                : `${matchingSorCode?.contractor}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">SOR code</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null
                ? '-'
                : `${matchingSorCode?.sorCode?.cost} - ${matchingSorCode?.sorCode?.shortDescription}`}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Quantity</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null ? '-' : extractedXmlData?.quantity}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Priority</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null
                ? '-'
                : getPriorityObjectByCode(
                    extractedXmlData?.priority,
                    priorities ?? []
                  )?.description}
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Description</td>
            <td className="govuk-table__cell">
              {matchingSorCode === null ? '-' : extractedXmlData?.comments}
            </td>
          </tr>
        </TBody>
      </Table>

      {/* Description */}
      <input
        id="descriptionOfWork"
        name="descriptionOfWork"
        type="hidden"
        ref={register}
        value={extractedXmlData?.comments}
      />

      {/* Trade */}
      <input
        id="trade"
        name="trade"
        type="hidden"
        ref={register}
        value={matchingSorCode?.trade}
      />

      <input
        id="tradeCode"
        name="tradeCode"
        type="hidden"
        ref={register}
        value={matchingSorCode?.tradeCode}
      />

      {/* Contractor */}
      <input
        id="contractor"
        name="contractor"
        type="hidden"
        ref={register}
        value={`${matchingSorCode?.contractor} - ${matchingSorCode?.contractorReference}`}
      />

      <input
        id="contractorRef"
        name="contractorRef"
        type="hidden"
        ref={register}
        value={matchingSorCode?.contractorReference}
      />

      {/* SOR code fields */}
      <input
        id={`rateScheduleItems[${0}][code]`}
        name={`rateScheduleItems[${0}][code]`}
        value={`${matchingSorCode?.sorCode?.code} - ${matchingSorCode?.sorCode?.shortDescription} - £${matchingSorCode?.sorCode?.cost}`}
        type="hidden"
        ref={register}
      />
      <input
        id={`rateScheduleItems[${0}][description]`}
        name={`rateScheduleItems[${0}][description]`}
        value={matchingSorCode?.sorCode?.shortDescription}
        type="hidden"
        ref={register}
      />
      <input
        id={`rateScheduleItems[${0}][cost]`}
        name={`rateScheduleItems[${0}][cost]`}
        value={matchingSorCode?.sorCode?.cost}
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
        value={extractedXmlData?.priority}
        type="hidden"
        ref={register}
      />
    </>
  )
}

export default RepairsFinderInput
