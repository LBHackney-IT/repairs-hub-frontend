import Head from 'next/head'
import { hotjar } from 'react-hotjar'
import { useEffect } from 'react'

const Meta = ({ title }) => {
  const applicationTitle = 'Hackney Repairs Hub'
  useEffect(() => {
    if (!window.Cypress) {
      // init hotjar when not in test environment
      hotjar.initialize(3085570, 6)
    }
  }, [])

  return (
    <Head>
      <meta charSet="utf-8" />
      <title>
        {title ? `${title} | ${applicationTitle}` : applicationTitle}
      </title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="theme-color" content="#0b0c0c" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Head>
  )
}

export default Meta
