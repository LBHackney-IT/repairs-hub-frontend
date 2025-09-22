import { render } from '@testing-library/react'
import PropertyFlags from '.'

jest.mock('axios', () => jest.fn())

describe('PropertyFlags', () => {
  it('should render tenure and alerts', async () => {
    const { asFragment } = render(
      <PropertyFlags
        canRaiseRepair={true}
        boilerHouseId=""
        tenure={{
          id: 'tenureId1',
          tenancyAgreementReference: 'tenancyAgreementRef1',
          typeCode: 'tenancyTypeCode',
          typeDescription: 'tenancyTypeDescription',
        }}
        tmoName={'tmoName'}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
