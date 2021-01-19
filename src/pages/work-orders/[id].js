import WorkOrderView from '../../components/WorkOrder/WorkOrderView'

const WorkOrderPage = ({ query }) => {
  return <WorkOrderView workOrderReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

export default WorkOrderPage
