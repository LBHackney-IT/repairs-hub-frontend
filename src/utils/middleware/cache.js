import LRU from 'lru-cache'

import { CACHE_MAX_SIZE, CACHE_MAX_AGE_IN_MS } from '../helpers/cache'

const context = {
  cache: new LRU({
    max: CACHE_MAX_SIZE,
    maxAge: CACHE_MAX_AGE_IN_MS,
  }),
}

export const cache = (handler) => (req, res) => {
  req.cache = context.cache

  return handler(req, res, validateCacheRequest(req.url))
}

const validateCacheRequest = (url) => {
  return Boolean(
    url.match(new RegExp('^.*/properties.*$')) ||
      url.match(new RegExp('^.*/schedule-of-rates/.*$')) ||
      url.match(new RegExp('^.*/filter/.*$')) ||
      url.match(new RegExp('^.*/contractors.*$'))
  )
}
