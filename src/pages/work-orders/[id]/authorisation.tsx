import { AUTHORISATION_MANAGER_ROLE } from '@/utils/user'
import AuthorisationView from '@/components/WorkOrder/Authorisation/AuthorisationView'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const AuthorisationPage = ({ query }: PageProps<{ id: string }>) => {
  return (
    <>
      <Meta title={`Authorisation for Work Order ${query.id}`} />
      <AuthorisationView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

AuthorisationPage.permittedRoles = [AUTHORISATION_MANAGER_ROLE]

export default AuthorisationPage
