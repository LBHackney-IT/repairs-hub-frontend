// The API returns {property, tenure} in the same response
// so they are grouped here

export interface PropertyTenure {
  property: Property
  tenure: Tenure
}

export interface Property {
  propertyReference: string
  address: Address
  hierarchyType: HierarchyType
  tmoName: string
  canRaiseRepair: boolean
  isUnderWarranty: boolean
  boilerHouseId: string
}

export interface Address {
  shortAddress: string
  postalCode: string
  addressLine: string
  streetSuffix: string
}

export interface HierarchyType {
  levelCode: string
  subTypeCode: string
  subTypeDescription: string
}

export type Tenure = {
  typeCode: string
  typeDescription: string
  tenancyAgreementReference: string
  id: string
}
