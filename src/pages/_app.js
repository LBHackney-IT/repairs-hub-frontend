import '../styles/all.scss'
import App from 'next/app'
import Layout from '../components/Layout'

const { NEXT_PUBLIC_ALLOWED_IP_ADDRESSES } = process.env

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    )
  }
}

if (NEXT_PUBLIC_ALLOWED_IP_ADDRESSES) {
  MyApp.getInitialProps = async ({ ctx }) => {
    // Block access by default
    let shouldBlockAccess = true

    // Specify IP's to whitelist
    var allowedIps = NEXT_PUBLIC_ALLOWED_IP_ADDRESSES.split(",")
    // Read the request objects headers to find out ip address
    var ip = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress

    if (allowedIps.includes(ip)) {
      shouldBlockAccess = false
    }

    // Return the 403 status code
    if (shouldBlockAccess) {
      ctx.res.statusCode = 403
      ctx.res.end(`Not allowed for ${ip}`)
      return
    }

    return { shouldBlockAccess, ip }
  }
}

export default MyApp
