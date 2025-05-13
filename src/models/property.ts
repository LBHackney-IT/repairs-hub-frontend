export interface Property  {
    property: {
        propertyReference: string,
        address: {
            shortAddress: string,
            postalCode: string,
            addressLine: string,
            streetSuffix: string,
        },
        hierarchyType: {
            levelCode: string,
            subTypeCode: string,
            subTypeDescription: string
        },
        tmoName: string,
        canRaiseRepair: boolean,
        boilerHouseId: string,
    },
    tenure: {
        typeCode: string,
        typeDescription: string,
        tenancyAgreementReference: string,
        id: string
    }
}