import Document, { Html, Head, Main, NextScript } from 'next/document'

const TAG_MANAGER_ID = process.env.TAG_MANAGER_ID || null

class AppDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="govuk-template lbh-template">
      <Head>
        <link rel="icon" href="/hackney_favicon.ico" />
        {TAG_MANAGER_ID && <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TAG_MANAGER_ID}');`,
        }}
        />}
      </Head>
      <body className="govuk-template__body">
        {TAG_MANAGER_ID && <noscript>
          <iframe
            src={"https://www.googletagmanager.com/ns.html?id=" + TAG_MANAGER_ID}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>}
        <Main />
        <NextScript />
      </body>
      </Html>
    )
  }
}

export default AppDocument
