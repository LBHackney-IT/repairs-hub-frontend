import '../styles/all.scss'
import App from 'next/app'
import Layout from '../components/Layout'
import Head from 'next/head'

import { isAuthorised, AUTH_WHITELIST } from '../utils/GoogleAuth'
import UserContext from '../components/UserContext/UserContext'

const { NEXT_PUBLIC_ALLOWED_IP_ADDRESSES } = process.env

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <UserContext.Provider value={{ user: this.props.userDetails }}>
          <Layout>
            <Head>
              <title>Hackney Repairs Hub</title>
            </Head>
            <Component {...pageProps} userDetails={this.props.userDetails} />
          </Layout>
        </UserContext.Provider>
      </>
    )
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  const WITH_REDIRECT = true

  if (AUTH_WHITELIST.includes(ctx.pathname)) {
    return {}
  }

  const userDetails = isAuthorised(ctx, WITH_REDIRECT)

  if (NEXT_PUBLIC_ALLOWED_IP_ADDRESSES) {
    // Block access by default
    let shouldBlockAccess = true

    // Specify IP's to whitelist
    var allowedIps = NEXT_PUBLIC_ALLOWED_IP_ADDRESSES.split(',')
    // Read the request objects headers to find out ip address
    var ip =
      ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress

    if (allowedIps.includes(ip)) {
      shouldBlockAccess = false
    }

    // Return the 403 status code
    if (shouldBlockAccess) {
      ctx.res.statusCode = 403
      ctx.res.end(`Not allowed for ${ip}`)
      return
    }

    return { userDetails, shouldBlockAccess, ip }
  } else {
    return { userDetails }
  }
}

export default MyApp
