import { render, screen } from '@testing-library/react'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'

describe('SummaryCloseWorkOrder component', () => {
  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => 'mockResponseUrl')
  })

  const props = {
    reference: '10000012',
    notes: 'this is a note',
    completionDate: '2021-02-03T11:33:35.757339',
    startDate: '2021-02-03T11:33:35.757339',
    reason: 'No Access',
    operatives: ['Operative A', 'Operative B'],
    onJobSubmit: jest.fn(),
    changeStep: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        operativeNames={props.operatives}
        paymentType={'Overtime'}
        files={[]}
        description=""
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should include photos', () => {
    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        operativeNames={props.operatives}
        paymentType={'Overtime'}
        files={[
          new File([''], 'photo1.jpg'),
          new File([''], 'photo2.jpg'),
          new File([''], 'photo3.jpg'),
        ]}
        description="some description"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('does not show rows for operatives and payment type if absent', () => {
    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        files={[]}
        description=""
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('includes follow-on request details', () => {
    const followOnData = {
      isMultipleOperatives: true,
      requiredFollowOnTrades: [
        {
          value: 'Plumbing',
        },
        { value: 'Electrical' },
        { value: 'Other' },
      ],
      followOnTypeDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      stockItemsRequired: true,
      nonStockItemsRequired: true,
      materialNotes:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      additionalNotes:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    }

    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        followOnData={followOnData}
        files={[]}
        description=""
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('includes only includes materials required if selcted', () => {
    const followOnData = {
      isMultipleOperatives: true,
      requiredFollowOnTrades: [
        {
          value: 'Plumbing',
        },
        { value: 'Electrical' },
        { value: 'Other' },
      ],
      followOnTypeDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      stockItemsRequired: false,
      nonStockItemsRequired: false,
      materialNotes: '',
      additionalNotes:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    }

    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        followOnData={followOnData}
        files={[]}
        description=""
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  describe('completion approval notice', () => {
    const renderSummary = (
      requiresApprovalToComplete: boolean,
      reason: string
    ) =>
      render(
        <SummaryCloseWorkOrder
          reference={props.reference}
          notes={props.notes}
          completionDate={props.completionDate}
          startDate={props.startDate}
          reason={reason}
          onJobSubmit={props.onJobSubmit}
          changeStep={props.changeStep}
          files={[]}
          description=""
          requiresApprovalToComplete={requiresApprovalToComplete}
        />
      )

    it('is shown when the job needs approval and is being completed', () => {
      renderSummary(true, 'Work Order Completed')

      expect(screen.getByTestId('completion-approval-notice')).toBeVisible()
    })

    it('is not shown when the job does not need approval', () => {
      renderSummary(false, 'Work Order Completed')

      expect(
        screen.queryByTestId('completion-approval-notice')
      ).not.toBeInTheDocument()
    })

    it('is not shown when the job is closed for another reason', () => {
      renderSummary(true, 'No Access')

      expect(
        screen.queryByTestId('completion-approval-notice')
      ).not.toBeInTheDocument()
    })
  })
})
