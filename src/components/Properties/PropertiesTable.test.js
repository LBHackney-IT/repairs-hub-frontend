import { render } from '@testing-library/react'
import PropertiesTable from './PropertiesTable'

describe('PropertiesTable component', () => {
  const props = {
    properties: [
      {
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
      },
      {
        propertyReference: '00012346',
        address: {
          shortAddress: '1 Pitcairn House  St Thomass Square',
          postalCode: 'E9 6PT',
          addressLine: '1 Pitcairn House',
          streetSuffix: 'St Thomass Square',
        },
        hierarchyType: {
          subTypeDescription: 'Dwelling',
        },
      },
    ],
    query: 'E9 6PT',
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <PropertiesTable properties={props.properties} query={props.query} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
