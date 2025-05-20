import Meta from '@/components/Meta'
import WorkOrderUpdateView from '@/components/WorkOrder/Update'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/utils/user'

const WorkOrderUpdatePage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />
      <WorkOrderUpdateView
        reference={query.id}
        onSuccess={() => {
          console.log('on success')
        }}
      />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderUpdatePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderUpdatePage
