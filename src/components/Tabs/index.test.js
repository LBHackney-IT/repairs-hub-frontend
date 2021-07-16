import { act, render } from '@testing-library/react'
import Tabs from './index'
import { enableGOVUKFrontendJavascript } from '../../utils/govuk'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/work-orders/10203040#repairs-history-tab',
    }
  },
}))
jest.mock('../../utils/govuk')

describe('Tabs component', () => {
  const funcSpy = jest.fn()
  enableGOVUKFrontendJavascript.mockImplementation(() => funcSpy())

  const props = {
    tabsList: ['Tasks and SORs', 'Repairs history'],
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
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
