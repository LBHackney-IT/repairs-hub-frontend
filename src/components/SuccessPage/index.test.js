import { render } from '@testing-library/react'
import SuccessPage from '.'
import { user } from 'factories/agent'
import UserContext from '../UserContext'

describe('SuccessPage component', () => {
  describe('Approving / Rejecting a work order', () => {
    const props = {
      workOrderReference: '10000012',
      showDashboardLink: true,
    }

    describe('when variation is approved', () => {
      it('should render success screen with approved message', () => {
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage
              workOrderReference={props.workOrderReference}
              text="You have approved a variation"
              showDashboardLink={props.showDashboardLink}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when variation is rejected', () => {
      it('should render success screen with rejected message', () => {
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage
              workOrderReference={props.workOrderReference}
              text="You have rejected a variation"
              showDashboardLink={props.showDashboardLink}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('Raising a repair', () => {
    const props = {
      workOrderReference: '10000012',
      text: 'Repair work order created',
      propertyReference: '12345678',
      shortAddress: '12 Random Lane',
      showSearchLink: true,
    }

    describe('High cost (over raise limit) authorisation', () => {
      it('should render a success screen with a warning message', () => {
        const testProps = { ...props, authorisationPendingApproval: true }
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage {...testProps} />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('Above target date (over raise limit) authorisation', () => {
      it('should render a success screen with a warning message and link to raise new work order', () => {
        const testProps = {
          ...props,
          authorisationPendingApproval: true,
          showNewWorkOrderLink: true,
        }
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage {...testProps} />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('Within raise limit', () => {
      it('should render a success screen without a warning message', () => {
        const testProps = { ...props, authorisationPendingApproval: false }
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage {...testProps} />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('With an external scheduler URL', () => {
      it('should render text with a link to schedule externally', () => {
        const testProps = {
          ...props,
          externalSchedulerUrl: 'https://drs.example.com',
        }
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage {...testProps} />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('With Emergency and Immediate DLO repairs text', () => {
      it('should render text that Emergency and immediate DLO repairs are sent directly to the Planners', () => {
        const testProps = {
          ...props,
          immediateOrEmergencyDloRepairText: true,
        }
        const { asFragment } = render(
          <UserContext.Provider value={{ user }}>
            <SuccessPage {...testProps} />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('Close a work order', () => {
    const props = {
      workOrderReference: '10000012',
      showDashboardLink: true,
      action: 'close',
    }

    it('should render a success screen with confirmation text and 2 links: View work order and Manage work orders', () => {
      const testProps = { ...props }
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <SuccessPage {...testProps} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Cancel a work order', () => {
    const props = {
      workOrderReference: '10000012',
      propertyReference: '12345678',
      shortAddress: '12 Random Lane',
      raiseNewRepair: true,
      showSearchLink: true,
      action: 'cancel',
    }

    it('should render a success screen with confirmation text and 3 links: View work order, New repair link and Start a new search', () => {
      const testProps = { ...props }
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <SuccessPage {...testProps} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Update a work order', () => {
    const props = {
      workOrderReference: '10000012',
      showDashboardLink: true,
      linkToCloseWorkorder: true,
      action: 'update',
    }

    it('requires authorisation', () => {
      const testProps = { ...props, requiresAuthorisation: true }
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <SuccessPage {...testProps} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('does not require authorisation', () => {
      const testProps = { ...props, requiresAuthorisation: false }
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <SuccessPage {...testProps} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
