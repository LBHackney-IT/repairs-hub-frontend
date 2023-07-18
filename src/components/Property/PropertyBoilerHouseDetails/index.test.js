import axios from 'axios'

import PropertyBoilerHouseDetails from '.'
import { render, screen, waitFor } from '@testing-library/react'

jest.mock('axios', () => jest.fn())

describe('PropertyBoilerHouseDetails', () => {
  it('it shows an error message when request fails', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 404,
          data: {
            message: 'error message',
          },
        },
      })
    )

    const boilerHouseId = '1234'

    const { asFragment } = render(
      <PropertyBoilerHouseDetails boilerHouseId={boilerHouseId} />
    )

    await waitFor(async () => {
      expect(screen.getByTestId(/error-message/i)).toHaveTextContent(
        'Error loading boiler house details status 404 with message: error message'
      )
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('it shows boiler house details', async () => {
    const mockResponse = {
      propertyReference: '00023404',
      address: {
        shortAddress: '16 Pitcairn House St Thomass Square',
        postalCode: 'E9 6PT',
        addressLine: '16 Pitcairn House St Thomass Square',
        streetSuffix: null,
      },
      hierarchyType: {
        levelCode: null,
        subTypeCode: null,
        subTypeDescription: 'Dwelling',
      },
      tmoName: 'London Borough of Hackney',
      canRaiseRepair: false,
    }

    axios.mockResolvedValue({
      data: mockResponse,
    })

    const boilerHouseId = '1234'

    const { asFragment } = render(
      <PropertyBoilerHouseDetails boilerHouseId={boilerHouseId} />
    )

    await waitFor(async () => {
      expect(screen.getByTestId('boiler-house-details-link')).toHaveTextContent(
        mockResponse.address.addressLine
      )
      expect(screen.getByTestId('boiler-house-details-link')).toHaveAttribute(
        'href',
        `/properties/${mockResponse.propertyReference}`
      )
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
