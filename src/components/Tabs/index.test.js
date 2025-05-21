import { act, render } from '@testing-library/react'
import Tabs from './index'
import { TabName } from './tabNames'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/work-orders/10203040?currentTab=work-orders-history-tab',
    }
  },
}))

describe('Tabs component', () => {
  const props = {
    tabsList: ['Work orders history', 'Tasks and SORs'],
    propertyReference: '00012345',
    workOrderReference: '10203040',
  }

  it('should render properly', async () => {
    await act(async () => {
      const { asFragment } = render(
        <Tabs
          tabsList={props.tabsList}
          propertyReference={props.propertyReference}
          workOrderReference={props.workOrderReference}
          tasksAndSors={undefined}
          budgetCode={undefined}
          workOrder={undefined}
          setActiveTab={() => {}}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
