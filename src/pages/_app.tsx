import '@/styles/fonts.css'
import '@/styles/all.scss'
import type { AppContext, AppProps } from 'next/app'
import Layout from '@/components/Layout'
import AccessDenied from '@/components/AccessDenied'
import * as Sentry from '@sentry/nextjs'
import { QueryClient, QueryClientProvider } from 'react-query'

import {
  isAuthorised,
  redirectToAcessDenied,
  AUTH_WHITELIST,
} from '@/utils/authSession'

import { buildUser } from '@/utils/user'
import UserContext from '@/components/UserContext'
import Meta from '@/components/Meta'

// Comment to trigger pipeline

const SCRUBBED_COOKIE_PATTERN = /^((__Secure-|__Host-)?next-auth\.|_cs_)/
const NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME =
  process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME

if (typeof window !== 'undefined') {
  document.body.className = document.body.className
    ? document.body.className + ' js-enabled'
    : 'js-enabled'
}

const queryClient = new QueryClient()

type MyAppProps = AppProps & {
  userDetails?: ReturnType<typeof buildUser>
  accessDenied?: boolean
}

const MyApp = ({
  Component,
  pageProps,
  userDetails,
  accessDenied,
}: MyAppProps) => {
  const ComponentToRender = accessDenied ? AccessDenied : Component

  if (userDetails) {
    Sentry.setUser({ name: userDetails.name, email: userDetails.email })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user: userDetails }}>
        <Layout serviceName="Repairs Hub">
          <Meta title="" />

          <ComponentToRender {...pageProps} userDetails={userDetails} />
        </Layout>
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

MyApp.getInitialProps = async ({
  ctx,
  Component: pageComponent,
}: AppContext): Promise<any> => {
  if (AUTH_WHITELIST.includes(ctx.pathname)) {
    return {}
  }

  const isClientSideTransition = ctx.req.url.match('^/_next/data')

  // Do not write server redirects if this is a client side transition.
  // Otherwise I think Next JS tries to write another response and the
  // entire request fails.
  const userDetails = await isAuthorised(ctx, !isClientSideTransition)

  if (!userDetails) {
    return { accessDenied: true }
  }

  Sentry.getCurrentScope().addEventProcessor((event) => {
    // next-auth.* (session-token and its .0/.1 chunks, csrf-token, callback-url)
    // and Contentsquare _cs_* cookies
    Object.keys(event.request?.cookies ?? {})
      .filter((name) => SCRUBBED_COOKIE_PATTERN.test(name))
      .forEach((name) => {
        event.request.cookies[name] = '[REMOVED]'
      })

    if (event.request?.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]) {
      event.request.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME] = '[REMOVED]'
    }

    return event
  })

  if (userAuthorisedForPage(pageComponent, userDetails)) {
    return { userDetails, accessDenied: false }
  } else {
    if (!isClientSideTransition) {
      redirectToAcessDenied(ctx.res)
    }
    return { userDetails, accessDenied: true }
  }
}

const userAuthorisedForPage = (component, user) => {
  if (component.name === 'RepairsHubError') {
    return true
  }

  if (!component.permittedRoles || component?.permittedRoles?.length === 0) {
    console.log(`Component ${component.name} has no permittedRoles defined.`)
    return false
  }

  return component.permittedRoles.some((role) => user.hasRole(role))
}

export default MyApp
