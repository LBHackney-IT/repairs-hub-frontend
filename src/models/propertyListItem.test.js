import { PropertyListItem } from './propertyListItem'

describe('PropertyListItem', () => {
  describe('when built with a property object', () => {
    let property = new PropertyListItem({
      address: 'Address Line 1',
      postCode: 'E9 6PT',
      propertyType: 'Dwelling',
      propertyReference: '00012345',
    })

    describe('address', () => {
      it('returns the address', () => {
        expect(property.address).toEqual('Address Line 1')
      })
    })

    describe('postalCode', () => {
      it('returns the postCode', () => {
        expect(property.postalCode).toEqual('E9 6PT')
      })
    })

    describe('propertyType', () => {
      it('returns the propertyType', () => {
        expect(property.propertyType).toEqual('Dwelling')
      })
    })

    describe('propertyReference', () => {
      it('returns the propertyReference', () => {
        expect(property.propertyReference).toEqual('00012345')
      })
    })
  })

  // Legacy property search API results
  describe('when built with a property object with nested address and hierarchyType', () => {
    let property = new PropertyListItem({
      propertyReference: '00012345',
      address: {
        shortAddress: 'Address Line 1',
        postalCode: 'E9 6PT',
      },
      hierarchyType: {
        subTypeDescription: 'Dwelling',
      },
    })

    describe('address', () => {
      it('returns the address.shortAddress', () => {
        expect(property.address).toEqual('Address Line 1')
      })
    })

    describe('postalCode', () => {
      it('returns the address.postalCode', () => {
        expect(property.postalCode).toEqual('E9 6PT')
      })
    })

    describe('propertyType', () => {
      it('returns the hierarchyType.subTypeDescription', () => {
        expect(property.propertyType).toEqual('Dwelling')
      })
    })

    describe('propertyReference', () => {
      it('returns the propertyReference', () => {
        expect(property.propertyReference).toEqual('00012345')
      })
    })
  })
})
