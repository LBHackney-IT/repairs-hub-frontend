// This class is intended to use to wrap property objects
// returned from the resource list endpoint.

export class PropertyListItem {
  constructor(property) {
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
