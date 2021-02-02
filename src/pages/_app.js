import '../styles/all.scss'
import App from 'next/app'
import Layout from '../components/Layout'
import Head from 'next/head'

import { isAuthorised, AUTH_WHITELIST } from '../utils/GoogleAuth'
import UserContext from '../components/UserContext/UserContext'

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
        <script src="/js/govuk.js"></script>
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

  return { userDetails }
}

export default MyApp
