// This class is intended to use to wrap property objects
// returned from the resource list endpoint.

export class PropertyListItem {
  constructor(property) {
      this.address = property.assetAddress.addressLine1
      this.postalCode = property.assetAddress.postCode
      this.propertyType = property.assetType
      this.propertyReference = property.assetId
  }
}
