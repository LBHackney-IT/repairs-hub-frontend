import type { ParsedUrlQuery } from 'querystring'

// Props for pages that use `getServerSideProps = getQueryProps`.
// Pass the dynamic route params as `Params` to narrow them to strings,
// e.g. PageProps<{ id: string }> for /work-orders/[id]
export type PageProps<Params extends ParsedUrlQuery = ParsedUrlQuery> = {
  query: Params & ParsedUrlQuery
}
