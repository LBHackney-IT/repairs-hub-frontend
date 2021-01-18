import RaiseRepairFormView from '../../../../components/Property/RaiseRepair/RaiseRepairFormView'

const RaiseRepairPage = ({ query }) => {
  return <RaiseRepairFormView propertyReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

export default RaiseRepairPage
