import PropertyRow from '../Property/PropertyRow'
import { Table, THead, TBody, TR, TH } from '../Layout/Table'

interface Props {
  properties: {
    propertyReference: string
    address: string
    postalCode: string
    propertyType: string
  }[]
}

const PropertiesTable = ({ properties }: Props) => (
  <div>
    <Table className="govuk-!-margin-top-5">
      <THead>
        <TR className="lbh-body">
          <TH scope="col">Address</TH>
          <TH scope="col">Postcode</TH>
          <TH scope="col">Property type</TH>
          <TH scope="col">Property reference</TH>
        </TR>
      </THead>
      <TBody>
        {properties.map((property, index) => (
          <PropertyRow key={index} {...property} />
        ))}
      </TBody>
    </Table>
  </div>
)

export default PropertiesTable
