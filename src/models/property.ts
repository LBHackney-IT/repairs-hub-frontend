export interface Property {
  propertyReference: string
  address: {
    shortAddress: string
    postalCode: string
    addressLine: string
    streetSuffix: string
  }
  hierarchyType: {
    levelCode: string
    subTypeCode: string
    subTypeDescription: string
  }
  tmoName: string
  canRaiseRepair: boolean
  boilerHouseId: string
}
