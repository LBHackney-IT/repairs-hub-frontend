import UpdateWorkOrder from '../../../../components/WorkOrders/UpdateWorkOrder'

const JobPage = ({ query }) => {
  return <UpdateWorkOrder reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

export default JobPage
