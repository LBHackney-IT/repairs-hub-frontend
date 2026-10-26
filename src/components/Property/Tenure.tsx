import type { Tenure as TenureModel } from '@/root/src/models/propertyTenure'

interface Props {
  canRaiseRepair: boolean
  tenure: Pick<TenureModel, 'typeCode' | 'typeDescription'>
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
