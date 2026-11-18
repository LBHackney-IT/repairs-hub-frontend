import easySoapRequest, { SoapRequestOptions } from 'easy-soap-request'

export const soapRequest = async (options: SoapRequestOptions) =>
  await easySoapRequest(options)
