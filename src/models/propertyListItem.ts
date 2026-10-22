// This class is intended to use to wrap property objects
// returned from the resource list endpoint.

export class PropertyListItem {
  address: string
  postalCode: string
  propertyType: string
  propertyReference: string

  constructor(property: any) {
    if (typeof property.address === 'object') {
      this.address = property.address.shortAddress
      this.postalCode = property.address.postalCode
      this.propertyType = property.hierarchyType.subTypeDescription
      this.propertyReference = property.propertyReference
    } else {
      this.address = property.address
      this.postalCode = property.postCode
      this.propertyType = property.propertyType
      this.propertyReference = property.propertyReference
    }
  }
}
