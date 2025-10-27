import { useEffect, useState } from 'react'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import { TextArea } from '../../Form'
import { Table, TBody } from '../../Layout/Table'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { useRepairsFinderInput } from './useRepairsFinderInput'
import { Priority } from '@/root/src/models/priority'
import { getPriorityObjectByCode } from './helpers'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

const REPAIRS_FINDER_LINK = process.env.NEXT_PUBLIC_REPAIRS_FINDER_LINK

interface Props {
  propertyReference: string
  register: any
  errors: DeepMap<FieldValues, FieldError>
  setTotalCost: (cost: number) => void
  setContractorReference: (reference: string) => void
  setTradeCode: (tradeCode: string) => void
  priorities: Priority[]
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
      <TextArea
        name="xmlContent"
        label="Repairs finder code"
        hint={
          <>
            Visit{' '}
            <a
              className="lbh-link"
              target="_blank"
              href={REPAIRS_FINDER_LINK}
              rel="noreferrer"
            >
              Repairs Finder
            </a>{' '}
            to diagnose the repair, then paste the code below.
          </>
        }
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

      {matchingSorCode?.hasPropertyContract === false && (
        <WarningInfoBox
          className="variant-error govuk-!-margin-bottom-4"
          header="Repair cannot be raised on this property"
          name="despatched-warning"
          text={`The selected work order cannot be raised against this property. `}
        />
      )}

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
