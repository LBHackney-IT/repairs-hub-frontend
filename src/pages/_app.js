import '@/styles/all.scss'
import App from 'next/app'
import Layout from '@/components/Layout'
import AccessDenied from '@/components/AccessDenied'
import { configureScope, setUser } from '@sentry/nextjs'
import { hotjar } from 'react-hotjar'
import { useEffect } from 'react'

import {
  isAuthorised,
  redirectToAcessDenied,
  AUTH_WHITELIST,
} from '@/utils/googleAuth'

import UserContext from '@/components/UserContext'
import Meta from '@/components/Meta'

const GSSO_TOKEN_NAME = process.env.GSSO_TOKEN_NAME
const NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME =
  process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME

if (typeof window !== 'undefined') {
  document.body.className = document.body.className
    ? document.body.className + ' js-enabled'
    : 'js-enabled'
}

class MyApp extends App {
  render() {
    const { Component, pageProps, userDetails } = this.props

    const ComponentToRender = this.props.accessDenied ? AccessDenied : Component

    useEffect(() => {
      hotjar.initialize(783901, 6)
    }, [])

    if (userDetails) {
      setUser({ name: userDetails.name, email: userDetails.email })
    }

    return (
      <>
        <UserContext.Provider value={{ user: this.props.userDetails }}>
          <Layout
            serviceName="Repairs Hub"
            feedbackLink="mailto:repairshub.feedback@hackney.gov.uk"
          >
            <Meta />

            <ComponentToRender
              {...pageProps}
              userDetails={this.props.userDetails}
            />
          </Layout>
        </UserContext.Provider>
      </>
    )
  }
}

MyApp.getInitialProps = async ({ ctx, Component: pageComponent }) => {
  if (AUTH_WHITELIST.includes(ctx.pathname)) {
    return {}
  }

  const isClientSideTransition = ctx.req.url.match('^/_next/data')

  // Do not write server redirects if this is a client side transition.
  // Otherwise I think Next JS tries to write another response and the
  // entire request fails.
  const userDetails = isAuthorised(ctx, !isClientSideTransition)

  if (!userDetails) {
    return { accessDenied: true }
  }

  configureScope((scope) => {
    scope.addEventProcessor((event) => {
      if (event.request?.cookies[GSSO_TOKEN_NAME]) {
        event.request.cookies[GSSO_TOKEN_NAME] = '[REMOVED]'
      }

      if (event.request?.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]) {
        event.request.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME] = '[REMOVED]'
      }

      return event
    })
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
