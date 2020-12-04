import Search from '../../Components/Search/Search'

const SearchPage = ({ query }) => {
  return (
    <Search query={query} />
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

export default SearchPage
