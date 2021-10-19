export const getQueryProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}
