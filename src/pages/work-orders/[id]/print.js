import Meta from '../../../components/Meta'
import PrintJobTicketView from '../../../components/WorkOrder/PrintJobTicketView'
import { CONTRACTOR_ROLE } from '../../../utils/user'

const PrintWorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Print Work Order ${query.id}`} />
      <PrintJobTicketView workOrderReference={query.id} />
    </>
  )
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

PrintWorkOrderPage.permittedRoles = [CONTRACTOR_ROLE]

export default PrintWorkOrderPage
