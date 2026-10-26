import type { GetServerSidePropsContext } from 'next'

export const getQueryProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}
