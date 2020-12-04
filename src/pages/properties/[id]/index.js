import PropertyView from '../../../Components/Property/PropertyView'

const PropertyPage = ({ query }) => {
  return (
    <PropertyView propertyReference={query.id} />
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query
    }
  }
}

export default PropertyPage
