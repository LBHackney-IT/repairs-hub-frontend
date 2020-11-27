import Document, { Html, Head, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  render() {
    return (
      <Html className="govuk-template lbh-template">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="govuk-template__body lbh-template__body js-enabled">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
