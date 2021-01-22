import CloseJob from '../../../../components/WorkOrders/CloseJob'

const JobPage = ({ query }) => {
  return <CloseJob reference={query.id} />
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
