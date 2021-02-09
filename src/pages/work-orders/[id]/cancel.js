import CancelWorkOrderView from '../../../components/WorkOrder/CancelWorkOrder/CancelWorkOrderView'

const CancelWorkOrderPage = ({ query }) => {
  return <CancelWorkOrderView workOrderReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

export default CancelWorkOrderPage
