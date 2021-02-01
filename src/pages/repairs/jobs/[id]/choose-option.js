import ChooseOption from '../../../../components/WorkOrders/ChooseOption'

const JobPage = ({ query }) => {
  return <ChooseOption reference={query.id} />
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
