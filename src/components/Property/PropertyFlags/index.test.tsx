import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import PropertyFlags from '.'
import { usePropertyBoilerHouse } from '../../../hooks/usePropertyBoilerHouse'
import { Tenure } from '@/models/propertyTenure'

jest.mock('../../../hooks/usePropertyBoilerHouse')

const mockUsePropertyBoilerHouse = usePropertyBoilerHouse as jest.Mock

const tenure = {
  typeCode: 'SEC',
  typeDescription: 'Secure',
} as Tenure

const renderPropertyFlags = (
  props: Partial<ComponentProps<typeof PropertyFlags>> = {}
) => render(<PropertyFlags canRaiseRepair tenure={tenure} {...props} />)

describe('PropertyFlags component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('tenure', () => {
    it('shows the tenure type', () => {
      renderPropertyFlags()

      expect(screen.getByText('Tenure: Secure')).toBeInTheDocument()
    })

    it.each([
      ['has no tenure', null],
      ['has an empty tenure', {}],
      ['has a tenure without a type', { typeCode: 'SEC' }],
    ])('does not show the tenure when the property %s', (_, noTenure) => {
      renderPropertyFlags({ tenure: noTenure as Tenure })

      expect(screen.queryByText(/Tenure/)).not.toBeInTheDocument()
    })
  })

  describe('TMO', () => {
    it('shows the TMO name', () => {
      renderPropertyFlags({ tmoName: 'Shoreditch TMO' })

      expect(screen.getByText('TMO: Shoreditch TMO')).toBeInTheDocument()
    })

    it("does not show the TMO when it is 'London Borough of Hackney'", () => {
      renderPropertyFlags({ tmoName: 'London Borough of Hackney' })

      expect(screen.queryByText(/TMO/)).not.toBeInTheDocument()
    })
  })

  describe('boiler house', () => {
    it('shows the boiler house, linking to its property page', () => {
      mockUsePropertyBoilerHouse.mockReturnValue({
        loading: false,
        boilerHouse: {
          propertyReference: '00087086',
          addressLine1: 'Booster Pump 1-93 Pitcairn House',
        },
        boilerHouseError: undefined,
      })

      renderPropertyFlags({ boilerHouseId: 'boiler-house-id' })

      expect(mockUsePropertyBoilerHouse).toHaveBeenCalledWith('boiler-house-id')
      expect(screen.getByTestId('boiler-house-details-link')).toHaveAttribute(
        'href',
        '/properties/00087086'
      )
      expect(screen.getByTestId('boiler-house-details-link')).toHaveTextContent(
        'Booster Pump 1-93 Pitcairn House'
      )
    })

    it.each([
      ['an empty string', ''],
      ['null', null],
      ['undefined', undefined],
    ])(
      'does not request or show a boiler house when the id is %s',
      (_, boilerHouseId) => {
        renderPropertyFlags({ boilerHouseId })

        expect(mockUsePropertyBoilerHouse).not.toHaveBeenCalled()
        expect(
          screen.queryByTestId('boiler-house-details')
        ).not.toBeInTheDocument()
      }
    )
  })
})
