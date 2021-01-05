import axios from 'axios'
import AuthHeader from '../../../utils/AuthHeader'
const LRUCache = require('lru-cache')

class ApiRequestsCacher {
  constructor() {
    // 100 elements should be enough
    this.cache = new LRUCache(100)
    const { NEXT_PUBLIC_ENDPOINT_API } = process.env
    this.baseUrl = NEXT_PUBLIC_ENDPOINT_API
  }

  async getProperties(params) {
    const url = `${this.baseUrl}/properties/?q=${params}`

    return await this._getData(url)
  }

  async getProperty(propertyReference) {
    const url = `${this.baseUrl}/properties/${propertyReference}`

    return await this._getData(url)
  }

  async _getData(url) {
    const value = this.cache.get(url)
    if (value) {
      return value
    } else {
      const { data } = await axios.get(url, { headers: AuthHeader() })
      const minutes = 5
      this.cache.set(url, data, minutes * 60 * 1000)

      return data
    }
  }
}

export default ApiRequestsCacher
