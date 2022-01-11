import { render } from '@testing-library/react'
import PropertiesTable from './PropertiesTable'

describe('PropertiesTable component', () => {
  const props = {
    properties: [
      {
        propertyReference: '00012345',
        address: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        propertyType: 'Dwelling',
      },
      {
        propertyReference: '00012346',
        address: '1 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        propertyType: 'Dwelling',
      },
    ],
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <PropertiesTable properties={props.properties} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
