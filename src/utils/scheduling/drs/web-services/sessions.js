import { soapRequest } from '../../../soap-request-client'
import { DOMParser } from 'xmldom'
import xpath from 'xpath'

const {
  DRS_WEB_SERVICES_URL,
  DRS_WEB_SERVICES_USERNAME,
  DRS_WEB_SERVICES_PASSWORD,
} = process.env

class DRSError extends Error {
  constructor(status, ...params) {
    super(...params)

    this.name = 'DRSWebServicesError'
    this.status = status
  }
}

export const createDRSSession = async () => {
  const { response } = await soapRequest({
    url: DRS_WEB_SERVICES_URL,
    xml: createSessionXml,
  })

  const { statusCode, body } = response

  if (statusCode === 200) {
    return xpath.select(
      'string(//sessionId)',
      new DOMParser().parseFromString(body)
    )
  } else {
    throw new DRSError(
      status,
      `DRS Web Services returned non-200 response: ${body}`
    )
  }
}

export const closeDRSSession = async (sessionID) => {
  const { response } = await soapRequest({
    url: DRS_WEB_SERVICES_URL,
    xml: closeSessionXml(sessionID),
  })

  const { statusCode, body } = response

  if (statusCode === 200) {
    return statusCode
  } else {
    throw new DRSError(
      status,
      `DRS Web Services returned non-200 response: ${body}`
    )
  }
}

const createSessionXml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aut="http://autogenerated.OTWebServiceApi.xmbrace.com/">
  <soapenv:Header/>
  <soapenv:Body>
      <aut:openSession>
        <openSession>
            <login>${DRS_WEB_SERVICES_USERNAME}</login>
            <password>${DRS_WEB_SERVICES_PASSWORD}</password>
        </openSession>
      </aut:openSession>
  </soapenv:Body>
</soapenv:Envelope>
`

const closeSessionXml = (sessionID) => `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aut="http://autogenerated.OTWebServiceApi.xmbrace.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <aut:closeSession>
      <closeSession>
          <sessionId>${sessionID}</sessionId>
      </closeSession>
    </aut:closeSession>
  </soapenv:Body>
  </soapenv:Envelope>
`
