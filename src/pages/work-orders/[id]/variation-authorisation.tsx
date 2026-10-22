import { CONTRACT_MANAGER_ROLE } from '@/utils/user'
import VariationAuthorisationView from '@/components/WorkOrder/Authorisation/VariationAuthorisationView'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const VariationAuthorisationPage = ({ query }: PageProps<{ id: string }>) => {
  return (
    <>
      <Meta title={`Authorise variation for Work Order ${query.id}`} />
      <VariationAuthorisationView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

VariationAuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default VariationAuthorisationPage
