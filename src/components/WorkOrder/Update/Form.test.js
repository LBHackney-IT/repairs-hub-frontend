import { render } from '@testing-library/react'
import WorkOrderUpdateForm from './Form'
import { PURDY_CONTRACTOR_REFERENCE } from '@/utils/constants'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/work-orders/[id]/update',
    }
  },
}))

describe('WorkOrderUpdateForm component', () => {
  const props = {
    propertyReference: '000012345',
    originalTasks: [
      {
        code: 'DES5R006',
        quantity: 1,
        original: true,
        originalQuantity: 1,
      },
    ],
    latestTasks: [
      {
        code: 'DES5R006',
        quantity: 2,
        original: true,
        originalQuantity: 1,
      },
      {
        code: 'DES5R005',
        quantity: 1,
        original: false,
        originalQuantity: null,
      },
    ],
    addedTasks: [
      {
        code: 'DES5R004',
        quantity: 2,
        description: 'Immediate call outs',
      },
    ],
    onGetToSummary: jest.fn(),
    setVariationReason: jest.fn(),
    sorSearchRequest: jest.fn(),
    setSorCodeArrays: jest.fn(),
    variationReason: 'More work is necessary',
  }

  it('should render properly with unlimited characters for variation reason, as contractor is Purdy', () => {
    const { asFragment } = render(
      <WorkOrderUpdateForm
        propertyReference={props.propertyReference}
        originalTasks={props.originalTasks}
        latestTasks={props.latestTasks}
        addedTasks={props.addedTasks}
        onGetToSummary={props.onGetToSummary}
        setVariationReason={props.setVariationReason}
        variationReason={props.variationReason}
        contractor={{
          contractorReference: 'PCL',
          contractorName: 'Purdy',
          useExternalScheduleManager: false,
          canAssignOperative: false,
          perTradeAvailability: false,
          multiTradeEnabled: true,
        }}
        sorCodeArrays={[
          [
            {
              code: 'DES5R003',
              shortDescription: 'Immediate call outs',
              priority: {
                priorityCode: 1,
                description: '1 [I] IMMEDIATE',
              },
              cost: 0,
            },
            {
              code: 'DES5R004',
              shortDescription: 'Emergency call out',
              priority: {
                priorityCode: 2,
                description: '2 [E] EMERGENCY',
              },
            },
          ],
        ]}
        setSorCodeArrays={props.setSorCodeArrays}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render properly with 250 characters limit for variation reason', () => {
    const { asFragment } = render(
      <WorkOrderUpdateForm
        propertyReference={props.propertyReference}
        originalTasks={props.originalTasks}
        latestTasks={props.latestTasks}
        addedTasks={props.addedTasks}
        onGetToSummary={props.onGetToSummary}
        setVariationReason={props.setVariationReason}
        variationReason={props.variationReason}
        contractorReference="ABC"
        sorCodeArrays={[
          [
            {
              code: 'DES5R003',
              shortDescription: 'Immediate call outs',
              priority: {
                priorityCode: 1,
                description: '1 [I] IMMEDIATE',
              },
              cost: 0,
            },
            {
              code: 'DES5R004',
              shortDescription: 'Emergency call out',
              priority: {
                priorityCode: 2,
                description: '2 [E] EMERGENCY',
              },
            },
          ],
        ]}
        sorSearchRequest={props.sorSearchRequest}
        setSorCodeArrays={props.setSorCodeArrays}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render properly when there are no added tasks', () => {
    const { asFragment } = render(
      <WorkOrderUpdateForm
        propertyReference={props.propertyReference}
        originalTasks={props.originalTasks}
        latestTasks={props.latestTasks}
        addedTasks={[]}
        onGetToSummary={props.onGetToSummary}
        setVariationReason={props.setVariationReason}
        variationReason={props.variationReason}
        sorCodeArrays={[
          [
            {
              code: 'DES5R003',
              shortDescription: 'Immediate call outs',
              priority: {
                priorityCode: 1,
                description: '1 [I] IMMEDIATE',
              },
              cost: 0,
            },
            {
              code: 'DES5R004',
              shortDescription: 'Emergency call out',
              priority: {
                priorityCode: 2,
                description: '2 [E] EMERGENCY',
              },
            },
          ],
        ]}
        setSorCodeArrays={props.setSorCodeArrays}
        contractorReference={'ABC'}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
