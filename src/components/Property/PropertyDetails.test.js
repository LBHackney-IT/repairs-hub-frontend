import { render } from '@testing-library/react'
import PropertyDetails from './PropertyDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('PropertyDetails component', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  const props = {
    property: {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        addressLine: '16 Pitcairn House',
        streetSuffix: 'St Thomass Square',
      },
      hierarchyType: {
        subTypeDescription: 'Dwelling',
      },
      canRaiseRepair: true,
    },
    tenure: {
      id: 'tenureId1',
      typeCode: 'SEC',
      typeDescription: 'Secure',
      tenancyAgreementReference: 'tenancyAgreementRef1',
    },
  }

  describe('when the date is before out of hours does not show the link', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('Thursday 16 September 2021 13:01:00'))
    })
    afterAll(() => {
      jest.useRealTimers()
    })

    it('should render properly', async () => {
      const { asFragment } = render(
        <PropertyDetails
          property={props.property}
          tenure={props.tenure}
          showLegalDisrepairFlag={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the date is after out of hours should show the link', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('Thursday 16 September 2021 18:01:00'))
    })
    afterAll(() => {
      jest.useRealTimers()
    })

    it('should render properly', async () => {
      const { asFragment } = render(
        <PropertyDetails
          property={props.property}
          tenure={props.tenure}
          showLegalDisrepairFlag={false}
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
