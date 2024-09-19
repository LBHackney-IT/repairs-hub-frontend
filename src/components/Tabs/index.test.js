import { act, render } from '@testing-library/react'
import Tabs from './index'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/work-orders/10203040#work-orders-history-tab',
    }
  },
}))

describe('Tabs component', () => {
  const props = {
    tabsList: ['Tasks and SORs', 'Work orders history'],
    propertyReference: '00012345',
    workOrderReference: '10203040',
  }

  it('should render properly', async () => {
    // await act(async () => {
    const { asFragment } = render(
      <Tabs
        tabsList={props.tabsList}
        propertyReference={props.propertyReference}
        workOrderReference={props.workOrderReference}
      />
    )
    expect(asFragment()).toMatchSnapshot()
    // })
  })
})
