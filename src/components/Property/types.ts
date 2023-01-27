export interface Address {
  addressLine: string
  postalCode: string
  shortAddress: string
  streetSuffix: string
}

export interface HierarchyType {
  levelCode: string
  subTypeCode: string
  subTypeDescription: string
}

export interface Property {
  address: Address
  canRaiseRepair: boolean
  hierarchyType: HierarchyType
  propertyReference: string
  tmoName: string
}

export interface PhoneNumber {
  contactType: string
  value: string
  description: string
}

export interface ContactDetails {
  fullName: string
  phoneNumbers: Array<PhoneNumber>
  tenureType: string
}

export interface Tenure {
  tenancyAgreementReference: string
  typeCode: string
  typeDescription: string
}
