interface Props {
  tenure: {
    typeCode?: string
    typeDescription?: string
  }
  canRaiseRepair: boolean
}

const Tenure = ({ tenure, canRaiseRepair }: Props) => (
  <>
    {tenure.typeDescription && (
      <li className={`bg-${canRaiseRepair ? 'dark-green' : 'orange'}`}>
        Tenure: {tenure.typeDescription}
      </li>
    )}
  </>
)

export default Tenure
