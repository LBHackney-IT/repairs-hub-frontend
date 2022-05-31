import { render } from '@testing-library/react'
import SuccessPage from './index'
import Panel from '@/components/Template/Panel'
import PageAnnouncement from '@/components/Template/PageAnnouncement'
import {
  createWOLinks,
  LinksWithDRSBooking,
  cancelWorkOrderLinks,
  generalLinks,
  updateWorkOrderLinks,
  rejectLinks,
  authorisationApprovedLinks,
} from '@/utils/successPageLinks'

describe('SuccessPage component', () => {
  const props = {
    workOrder: {
      workOrderReference: '10000012',
    },
    property: {
      propertyReference: '12345678',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        addressLine: '16 Pitcairn House',
      },
    },
  }

  describe('Raising a repair', () => {
    describe('creates WO with RH appointment', () => {
      it('should render success message with appointment date and related links', () => {
        const { asFragment } = render(
          <SuccessPage
            banner={
              <Panel
                title="Work order created"
                workOrderReference={props.workOrder.workOrderReference}
                dateSelected={'Thursday, 11 March'}
                slot={'AM'}
                comments={'10 am works for me'}
              />
            }
            links={createWOLinks(
              props.workOrder.workOrderReference,
              props.property
            )}
          />
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('creates WO with an external scheduler URL', () => {
      it('should render text with a link to schedule externally', () => {
        const externalSchedulerUrl = 'https://drs.example.com'
        const userName = 'Hackney User'

        const { asFragment } = render(
          <SuccessPage
            banner={
              <Panel
                title="Work order created"
                workOrderReference={props.workOrder.workOrderReference}
              />
            }
            links={LinksWithDRSBooking(
              props.workOrder.workOrderReference,
              props.property,
              externalSchedulerUrl,
              userName
            )}
          />
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('creates Emergency/Immediate DLO WO', () => {
      it('should render a success page with an Emergency/Immediate DLO warning text', () => {
        const { asFragment } = render(
          <SuccessPage
            banner={
              <Panel
                title="Work order created"
                workOrderReference={props.workOrder.workOrderReference}
              />
            }
            warningText="Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked"
            links={createWOLinks(
              props.workOrder.workOrderReference,
              props.property
            )}
          />
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('creates Emergency/Immediate WO for external contractor', () => {
      it('should render a success page with an Emergency/Immediate warning text', () => {
        const { asFragment } = render(
          <SuccessPage
            banner={
              <Panel
                title="Work order created"
                workOrderReference={props.workOrder.workOrderReference}
              />
            }
            warningText="Emergency and immediate repairs must be booked immediately. Please call the external contractor"
            links={createWOLinks(
              props.workOrder.workOrderReference,
              props.property
            )}
          />
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('High cost (over raise limit) authorisation', () => {
      it('should render a success screen with a warning message', () => {
        const { asFragment } = render(
          <SuccessPage
            banner={
              <Panel
                title="Work order created but requires authorisation"
                workOrderReference={props.workOrder.workOrderReference}
              />
            }
            warningText="Please request authorisation from a manager"
            links={createWOLinks(
              props.workOrder.workOrderReference,
              props.property
            )}
          />
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })
  describe('WO cancelled', () => {
    it('should render a success screen with a link to raise a new wo', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <Panel
              title="Work order cancelled"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={cancelWorkOrderLinks(
            props.workOrder.workOrderReference,
            props.propertyReference,
            props.property.address.shortAddress
          )}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('WO closed', () => {
    it('should render a success screen', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <Panel
              title="Work order closed"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={generalLinks(props.workOrder.workOrderReference)}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('WO update', () => {
    it('should render a success screen', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <PageAnnouncement
              title="Work order updated"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={updateWorkOrderLinks(props.workOrder.workOrderReference)}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Variation requires authorisation', () => {
    it('should render a success screen with warning text', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <PageAnnouncement
              title="Variation requires authorisation"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={generalLinks(props.workOrder.workOrderReference)}
          showWarningText={true}
          warningText="Please request authorisation from a manager"
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Variation approved', () => {
    it('should render a success screen', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <PageAnnouncement
              title="Variation request approved"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={generalLinks(props.workOrder.workOrderReference)}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Variation rejected', () => {
    it('should render a success screen with link to raise a new wo', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <PageAnnouncement
              title="Variation request rejected"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={rejectLinks(
            props.workOrder.workOrderReference,
            props.property.propertyReference,
            props.property.address.shortAddress
          )}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Authorisation approved', () => {
    it('should render a success screen with link to book an appointment', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <PageAnnouncement
              title="Authorisation request approved"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={authorisationApprovedLinks(props.workOrder.workOrderReference)}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Authorisation rejected', () => {
    it('should render a success screen with link to raise a new wo', () => {
      const { asFragment } = render(
        <SuccessPage
          banner={
            <Panel
              title="Work order cancelled, authorisation request rejected"
              workOrderReference={props.workOrder.workOrderReference}
            />
          }
          links={cancelWorkOrderLinks(
            props.workOrder.workOrderReference,
            props.propertyReference,
            props.property.address.shortAddress
          )}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
